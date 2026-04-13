"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "@/drizzle/db";
import { mentorProfile } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { sendMentorVerificationEmail } from "@/app/lib/email";

export interface MentorProfileData {
    // Basic Information
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    bio?: string;
    profileImage?: string;

    // Professional Background
    title?: string;
    company?: string;
    industry?: string;
    yearsOfExperience?: number;
    currentRole?: string;
    previousRoles?: string[];

    // Education & Qualifications
    highestDegree?: string;
    university?: string;
    fieldOfStudy?: string;
    certifications?: string[];

    // Expertise & Skills
    expertise?: string[];
    technicalSkills?: string[];
    softSkills?: string[];
    toolsAndTechnologies?: string[];

    // Mentorship Details
    mentorshipTopics?: string[];
    mentorshipStyle?: string;
    preferredMenteeLevel?: string;
    maxMentees?: number;
    sessionDurationMinutes?: number;
    availability?: any;
    hourlyRate?: number;
    currency?: string;
    isFreeForStudents?: boolean;

    // Professional Links
    linkedinUrl?: string;
    websiteUrl?: string;
    githubUrl?: string;
    twitterUrl?: string;
    portfolioUrl?: string;

    // Motivation & Goals
    whyMentor?: string;
    mentorshipGoals?: string;
    successStory?: string;
    teachingApproach?: string;
}

// Calculate completion percentage
function calculateCompletionPercentage(data: MentorProfileData): number {
    const allFields = [
        // Basic (mandatory)
        data.fullName,
        data.email,
        data.phone,
        data.location,
        data.bio,
        // Professional Background
        data.title,
        data.company,
        data.industry,
        data.yearsOfExperience,
        data.currentRole,
        data.previousRoles,
        // Education
        data.highestDegree,
        data.university,
        data.fieldOfStudy,
        data.certifications,
        // Expertise
        data.expertise,
        data.technicalSkills,
        data.softSkills,
        data.toolsAndTechnologies,
        // Mentorship
        data.mentorshipTopics,
        data.mentorshipStyle,
        data.preferredMenteeLevel,
        data.maxMentees,
        data.sessionDurationMinutes,
        data.isFreeForStudents,
        // Links
        data.linkedinUrl,
        data.websiteUrl,
        // Motivation
        data.whyMentor,
        data.mentorshipGoals,
        data.teachingApproach,
    ];

    const filledFields = allFields.filter(
        (field) =>
            field !== undefined &&
            field !== null &&
            field !== "" &&
            (Array.isArray(field) ? field.length > 0 : true)
    ).length;

    return Math.round((filledFields / allFields.length) * 100);
}

export async function createOrUpdateMentorProfile(data: MentorProfileData) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || session.user.role !== "mentor") {
            return { success: false, error: "Unauthorized" };
        }

        const userId = session.user.id;
        const completionPercentage = calculateCompletionPercentage(data);

        // Check if profile exists
        const existingProfile = await db.query.mentorProfile.findFirst({
            where: eq(mentorProfile.userId, userId),
        });

        if (existingProfile) {
            await db
                .update(mentorProfile)
                .set({
                    ...data,
                    completionPercentage,
                    onboardingCompleted: completionPercentage >= 30, // At least basic info done
                    updatedAt: new Date(),
                })
                .where(eq(mentorProfile.userId, userId));
        } else {
            const profileId = crypto.randomUUID();
            await db.insert(mentorProfile).values({
                id: profileId,
                userId,
                fullName: data.fullName || "New Mentor",
                ...data,
                completionPercentage,
                onboardingCompleted: completionPercentage >= 30,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        return {
            success: true,
            completionPercentage,
            message: "Profile saved successfully",
        };
    } catch (error: any) {
        console.error("Error saving mentor profile:", error);
        return { success: false, error: error.message || "Failed to save profile" };
    }
}

export async function completeMentorInitialSetup(data: { 
    fullName: string; 
    location: string; 
    bio: string;
    yearsOfExperience?: number;
    industry?: string;
    expertise?: string[];
    currentRole?: string;
}) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || session.user.role !== "mentor") {
            return { success: false, error: "Unauthorized" };
        }

        const userId = session.user.id;
        const existingProfile = await db.query.mentorProfile.findFirst({
            where: eq(mentorProfile.userId, userId),
        });

        const updateData = {
            ...data,
            initialSetupCompleted: true,
            updatedAt: new Date(),
        };

        if (existingProfile) {
            await db.update(mentorProfile).set(updateData).where(eq(mentorProfile.userId, userId));
        } else {
            await db.insert(mentorProfile).values({
                id: crypto.randomUUID(),
                userId,
                ...updateData,
                createdAt: new Date(),
            });
        }
        return { success: true };
    } catch (error: any) {
        console.error("Error completing mentor initial setup:", error);
        return { success: false, error: error.message || "Failed to complete setup" };
    }
}

export async function getMentorProfile() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return { success: false, error: "Unauthorized", profile: null };
        }

        const userId = session.user.id;

        const profile = await db.query.mentorProfile.findFirst({
            where: eq(mentorProfile.userId, userId),
        });

        return { success: true, profile };
    } catch (error: any) {
        console.error("Error fetching mentor profile:", error);
        return {
            success: false,
            error: error.message || "Failed to fetch profile",
            profile: null,
        };
    }
}

export async function updateOnboardingStep(stepData: Partial<MentorProfileData>) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || session.user.role !== "mentor") {
            return { success: false, error: "Unauthorized" };
        }

        // Get existing profile
        const result = await getMentorProfile();
        if (!result.profile) {
            return await createOrUpdateMentorProfile(stepData);
        }

        // Merge with existing data
        const mergedData = {
            ...result.profile,
            ...stepData,
        } as MentorProfileData;

        return await createOrUpdateMentorProfile(mergedData);
    } catch (error: any) {
        console.error("Error updating onboarding step:", error);
        return { success: false, error: error.message || "Failed to update step" };
    }
}

export async function submitForVerification() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || session.user.role !== "mentor") {
            return { success: false, error: "Unauthorized" };
        }

        const userId = session.user.id;

        const profile = await db.query.mentorProfile.findFirst({
            where: eq(mentorProfile.userId, userId),
        });

        if (!profile) {
            return { success: false, error: "Profile not found. Complete onboarding first." };
        }

        if (profile.isVerified) {
            return { success: false, error: "Already verified" };
        }

        if (profile.verificationStatus === "submitted") {
            return { success: false, error: "Verification already submitted. Please wait for admin review." };
        }

        // Generate verification token
        const verificationToken = crypto.randomUUID();

        // Update profile with verification status
        await db
            .update(mentorProfile)
            .set({
                verificationStatus: "submitted",
                verificationToken,
                verificationSubmittedAt: new Date(),
                professionalQuestionsCompleted: true,
                updatedAt: new Date(),
            })
            .where(eq(mentorProfile.userId, userId));

        // Send verification email to admin
        await sendMentorVerificationEmail(
            profile.fullName,
            profile.email || session.user.email,
            profile.id,
            profile.expertise || [],
            profile.yearsOfExperience,
            profile.mentorshipTopics || [],
            verificationToken
        );

        return {
            success: true,
            message: "Verification request submitted! Admin will review your application.",
        };
    } catch (error: any) {
        console.error("Error submitting for verification:", error);
        return { success: false, error: error.message || "Failed to submit for verification" };
    }
}

export async function skipProfessionalQuestions() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || session.user.role !== "mentor") {
            return { success: false, error: "Unauthorized" };
        }

        const userId = session.user.id;

        const existingProfile = await db.query.mentorProfile.findFirst({
            where: eq(mentorProfile.userId, userId),
        });

        if (existingProfile) {
            await db
                .update(mentorProfile)
                .set({
                    onboardingCompleted: true,
                    professionalQuestionsCompleted: false,
                    verificationStatus: "pending",
                    updatedAt: new Date(),
                })
                .where(eq(mentorProfile.userId, userId));
        } else {
            await db.insert(mentorProfile).values({
                id: crypto.randomUUID(),
                userId,
                fullName: session.user.name || "New Mentor",
                email: session.user.email,
                onboardingCompleted: true,
                professionalQuestionsCompleted: false,
                verificationStatus: "pending",
            });
        }

        return { success: true, message: "Skipped professional questions. You can complete them later from settings." };
    } catch (error: any) {
        console.error("Error skipping professional questions:", error);
        return { success: false, error: error.message || "Failed to skip" };
    }
}

export async function getProfileStatus(userId: string) {
    try {
        const profile = await db
            .select()
            .from(mentorProfile)
            .where(eq(mentorProfile.userId, userId))
            .then((res) => res[0]);

        return {
            profile_completed: profile?.onboardingCompleted || false,
            initial_setup_completed: profile?.initialSetupCompleted || false,
            is_verified: profile?.isVerified || false,
            verification_status: profile?.verificationStatus || "pending",
            professional_questions_completed: profile?.professionalQuestionsCompleted || false,
        };
    } catch (error) {
        console.error("Error fetching profile status:", error);
        return {
            profile_completed: false,
            is_verified: false,
            verification_status: "pending",
            professional_questions_completed: false,
        };
    }
}
