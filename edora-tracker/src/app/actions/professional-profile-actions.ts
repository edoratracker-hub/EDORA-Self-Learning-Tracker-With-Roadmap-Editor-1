"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "@/drizzle/db";
import { professionalProfile } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export interface ProfessionalProfileData {
    // Basic Information
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    address?: string;
    bio?: string;
    profileImage?: string;

    // Professional Background
    title?: string;
    company?: string;
    industry?: string;
    yearsOfExperience?: number;
    currentRole?: string;
    teachingProfession?: string;
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

    // Links
    linkedinUrl?: string;
    websiteUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;

    // Motivation & Goals
    whyJoin?: string;
    goals?: string;
}

// Calculate completion percentage
function calculateCompletionPercentage(data: ProfessionalProfileData): number {
    const allFields = [
        data.fullName,
        data.email,
        data.phone,
        data.location,
        data.bio,
        data.title,
        data.company,
        data.industry,
        data.yearsOfExperience,
        data.linkedinUrl,
        data.expertise,
        data.whyJoin,
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

export async function createOrUpdateProfessionalProfile(data: ProfessionalProfileData) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        // The role from UI is "professional"
        if (!session || session.user.role !== "professional") {
            return { success: false, error: "Unauthorized" };
        }

        const userId = session.user.id;
        const completionPercentage = calculateCompletionPercentage(data);

        // Check if profile exists
        const existingProfile = await db.query.professionalProfile.findFirst({
            where: eq(professionalProfile.userId, userId),
        });

        if (existingProfile) {
            await db
                .update(professionalProfile)
                .set({
                    ...data,
                    onboardingCompleted: true,
                    isVerified: true,
                    verificationStatus: "verified",
                    professionalQuestionsCompleted: true,
                    updatedAt: new Date(),
                })
                .where(eq(professionalProfile.userId, userId));
        } else {
            const profileId = crypto.randomUUID();
            await db.insert(professionalProfile).values({
                id: profileId,
                userId,
                fullName: data.fullName || session.user.name || "New Professional",
                email: data.email || session.user.email,
                ...data,
                onboardingCompleted: true,
                isVerified: true,
                verificationStatus: "verified",
                professionalQuestionsCompleted: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        return {
            success: true,
            message: "Profile saved successfully",
        };
    } catch (error: any) {
        console.error("Error saving professional profile:", error);
        return { success: false, error: error.message || "Failed to save profile" };
    }
}

export async function completeProfessionalInitialSetup(data: { 
    fullName: string; 
    location: string; 
    address?: string;
    phone?: string;
    bio: string;
    yearsOfExperience?: number;
    industry?: string;
    expertise?: string[];
    currentRole?: string;
    teachingProfession?: string;
}) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || session.user.role !== "professional") {
            return { success: false, error: "Unauthorized" };
        }

        const userId = session.user.id;
        const existingProfile = await db.query.professionalProfile.findFirst({
            where: eq(professionalProfile.userId, userId),
        });

        const updateData = {
            ...data,
            initialSetupCompleted: true,
            updatedAt: new Date(),
        };

        if (existingProfile) {
            await db.update(professionalProfile).set(updateData).where(eq(professionalProfile.userId, userId));
        } else {
            await db.insert(professionalProfile).values({
                id: crypto.randomUUID(),
                userId,
                ...updateData,
                createdAt: new Date(),
            });
        }
        return { success: true };
    } catch (error: any) {
        console.error("Error completing professional initial setup:", error);
        return { success: false, error: error.message || "Failed to complete setup" };
    }
}

export async function getProfessionalProfile() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return { success: false, error: "Unauthorized", profile: null };
        }

        const userId = session.user.id;

        const profile = await db.query.professionalProfile.findFirst({
            where: eq(professionalProfile.userId, userId),
        });

        return { success: true, profile };
    } catch (error: any) {
        console.error("Error fetching professional profile:", error);
        return {
            success: false,
            error: error.message || "Failed to fetch profile",
            profile: null,
        };
    }
}

export async function updateProfessionalOnboardingStep(stepData: Partial<ProfessionalProfileData>) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || session.user.role !== "professional") {
            return { success: false, error: "Unauthorized" };
        }

        // Get existing profile
        const result = await getProfessionalProfile();
        if (!result.profile) {
            return await createOrUpdateProfessionalProfile(stepData);
        }

        // Merge with existing data
        const mergedData = {
            ...result.profile,
            ...stepData,
        } as ProfessionalProfileData;

        return await createOrUpdateProfessionalProfile(mergedData);
    } catch (error: any) {
        console.error("Error updating onboarding step:", error);
        return { success: false, error: error.message || "Failed to update step" };
    }
}

export async function submitProfessionalForVerification() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || session.user.role !== "professional") {
            return { success: false, error: "Unauthorized" };
        }

        const userId = session.user.id;

        const profile = await db.query.professionalProfile.findFirst({
            where: eq(professionalProfile.userId, userId),
        });

        if (!profile) {
            return { success: false, error: "Profile not found. Complete onboarding first." };
        }

        if (profile.isVerified) {
            return { success: false, error: "Already verified" };
        }

        if (profile.verificationStatus === "submitted") {
            return { success: false, error: "Verification already submitted." };
        }

        const verificationToken = crypto.randomUUID();

        await db
            .update(professionalProfile)
            .set({
                verificationStatus: "submitted",
                verificationToken,
                verificationSubmittedAt: new Date(),
                professionalQuestionsCompleted: true,
                updatedAt: new Date(),
            })
            .where(eq(professionalProfile.userId, userId));

        return {
            success: true,
            message: "Verification request submitted! Admin will review your application.",
        };
    } catch (error: any) {
        console.error("Error submitting professional for verification:", error);
        return { success: false, error: error.message || "Failed to submit for verification" };
    }
}

export async function skipProfessionalOnboarding() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || session.user.role !== "professional") {
            return { success: false, error: "Unauthorized" };
        }

        const userId = session.user.id;

        const existingProfile = await db.query.professionalProfile.findFirst({
            where: eq(professionalProfile.userId, userId),
        });

        if (existingProfile) {
            await db
                .update(professionalProfile)
                .set({
                    onboardingCompleted: true,
                    professionalQuestionsCompleted: false,
                    verificationStatus: "pending",
                    updatedAt: new Date(),
                })
                .where(eq(professionalProfile.userId, userId));
        } else {
            await db.insert(professionalProfile).values({
                id: crypto.randomUUID(),
                userId,
                fullName: session.user.name || "New Professional",
                email: session.user.email,
                onboardingCompleted: true,
                professionalQuestionsCompleted: false,
                verificationStatus: "pending",
            });
        }

        return { success: true, message: "Skipped onboarding." };
    } catch (error: any) {
        console.error("Error skipping professional onboarding:", error);
        return { success: false, error: error.message || "Failed to skip" };
    }
}

export async function getProfessionalProfileStatus(userId: string) {
    try {
        const profile = await db
            .select()
            .from(professionalProfile)
            .where(eq(professionalProfile.userId, userId))
            .then((res) => res[0]);

        return {
            profile_completed: profile?.onboardingCompleted || false,
            initial_setup_completed: profile?.initialSetupCompleted || false,
            is_verified: profile?.isVerified || false,
            verification_status: profile?.verificationStatus || "pending",
            professional_questions_completed: profile?.professionalQuestionsCompleted || false,
        };
    } catch (error) {
        console.error("Error fetching professional profile status:", error);
        return {
            profile_completed: false,
            is_verified: false,
            verification_status: "pending",
            professional_questions_completed: false,
        };
    }
}
