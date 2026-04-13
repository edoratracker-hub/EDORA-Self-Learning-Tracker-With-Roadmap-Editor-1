"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "@/drizzle/db";
import { studentProfile } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export interface StudentProfileData {
    // Basic Information
    name?: string;
    currentEducation?: string;
    studyGoal?: string;

    // 1) Self-Discovery
    favoriteSubjects?: string[];
    topicsThatEngageYou?: string;
    learningPreference?: string;
    workPreference?: string;
    hobbies?: string;
    confidenceActivities?: string;

    // 2) Strength & Weakness Mapping
    goodAtSubjects?: string[];
    struggleWithSubjects?: string[];
    learningStyle?: string;
    communicationSkills?: string;
    thinkingStyle?: string;

    // 3) Exposure & Career Awareness
    knownCareers?: string[];
    careerSkillsKnowledge?: string;
    hasSpokenToProfessionals?: boolean;
    followsCareerContent?: boolean;
    careerContentSources?: string;

    // 4) Career Interest Identification
    dreamJob?: string;
    moneyMotivatedJob?: string;
    jobTypePreference?: string;
    fieldOfInterest?: string;
    workLocationPreference?: string;

    // 5) Academic Status
    currentMarksOrCGPA?: string;
    preparingForExams?: string;
    completedCertifications?: string[];
    extraCourses?: string;

    // 6) Skill Status
    computerSkills?: string[];
    programmingLanguages?: string[];
    knowsProgramming?: boolean;
    knowsOfficeTools?: boolean;
    officeTools?: string[];
    completedProjects?: string;
    hasPortfolio?: boolean;
    portfolioLink?: string;
    githubLink?: string;
    hasResume?: boolean;

    // 7) Time, Habits & Discipline
    dailyStudyHours?: number;
    hasStudySchedule?: boolean;
    procrastinates?: boolean;
    mainDistractions?: string;

    // 8) Dream & Lifestyle Vision
    lifeVisionAt30?: string;
    careerPriority?: string;
    jobStabilityPreference?: string;

    // 9) Mindset Check
    readyForContinuousLearning?: boolean;
    failureHandling?: string;
    hasQuitLearning?: boolean;
    quitReason?: string;
}

// Calculate completion percentage
function calculateCompletionPercentage(data: StudentProfileData): number {
    const allFields = [
        // Basic (mandatory)
        data.name,
        data.currentEducation,
        data.studyGoal,
        // Self-Discovery
        data.favoriteSubjects,
        data.topicsThatEngageYou,
        data.learningPreference,
        data.workPreference,
        data.hobbies,
        data.confidenceActivities,
        // Strength & Weakness
        data.goodAtSubjects,
        data.struggleWithSubjects,
        data.learningStyle,
        data.communicationSkills,
        data.thinkingStyle,
        // Career Awareness
        data.knownCareers,
        data.careerSkillsKnowledge,
        data.hasSpokenToProfessionals,
        data.followsCareerContent,
        // Career Interest
        data.dreamJob,
        data.moneyMotivatedJob,
        data.jobTypePreference,
        data.fieldOfInterest,
        data.workLocationPreference,
        // Academic Status
        data.currentMarksOrCGPA,
        data.preparingForExams,
        // Skill Status
        data.computerSkills,
        data.knowsProgramming,
        data.knowsOfficeTools,
        data.hasPortfolio,
        data.hasResume,
        // Time & Habits
        data.dailyStudyHours,
        data.hasStudySchedule,
        data.procrastinates,
        // Dream & Vision
        data.lifeVisionAt30,
        data.careerPriority,
        data.jobStabilityPreference,
        // Mindset
        data.readyForContinuousLearning,
        data.failureHandling,
        data.hasQuitLearning,
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

export async function createOrUpdateStudentProfile(data: StudentProfileData) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || session.user.role !== "student") {
            return { success: false, error: "Unauthorized" };
        }

        const userId = session.user.id;
        const completionPercentage = calculateCompletionPercentage(data);

        // Check if profile exists
        const existingProfile = await db.query.studentProfile.findFirst({
            where: eq(studentProfile.userId, userId),
        });

        if (existingProfile) {
            // Update existing profile
            await db
                .update(studentProfile)
                .set({
                    ...data,
                    completionPercentage,
                    onboardingCompleted: completionPercentage === 100,
                    updatedAt: new Date(),
                })
                .where(eq(studentProfile.userId, userId));
        } else {
            // Create new profile
            const profileId = crypto.randomUUID();
            await db.insert(studentProfile).values({
                id: profileId,
                userId,
                ...data,
                completionPercentage,
                onboardingCompleted: completionPercentage === 100,
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
        console.error("Error saving student profile:", error);
        return { success: false, error: error.message || "Failed to save profile" };
    }
}

export async function completeInitialSetup(data: {
    name: string;
    currentEducation: string;
    studyGoal: string;
    experienceLevel?: string;
    programmingLanguages?: string[];
    computerSkills?: string[];
    jobTypePreference?: string;
}) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || session.user.role !== "student") {
            return { success: false, error: "Unauthorized" };
        }

        const userId = session.user.id;
        const existingProfile = await db.query.studentProfile.findFirst({
            where: eq(studentProfile.userId, userId),
        });

        const updateData = {
            ...data,
            initialSetupCompleted: true,
            updatedAt: new Date(),
        };

        if (existingProfile) {
            await db.update(studentProfile).set(updateData).where(eq(studentProfile.userId, userId));
        } else {
            await db.insert(studentProfile).values({
                id: crypto.randomUUID(),
                userId,
                ...updateData,
                createdAt: new Date(),
            });
        }
        return { success: true };
    } catch (error: any) {
        console.error("Error completing initial setup:", error);
        return { success: false, error: error.message || "Failed to complete setup" };
    }
}

export async function getStudentProfile() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return { success: false, error: "Unauthorized", profile: null };
        }

        const userId = session.user.id;

        const profile = await db.query.studentProfile.findFirst({
            where: eq(studentProfile.userId, userId),
        });

        return { success: true, profile };
    } catch (error: any) {
        console.error("Error fetching student profile:", error);
        return {
            success: false,
            error: error.message || "Failed to fetch profile",
            profile: null,
        };
    }
}

export async function updateOnboardingStep(stepData: Partial<StudentProfileData>) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || session.user.role !== "student") {
            return { success: false, error: "Unauthorized" };
        }

        // Get existing profile
        const result = await getStudentProfile();
        if (!result.profile) {
            // No profile exists, create with this step data
            return await createOrUpdateStudentProfile(stepData);
        }

        // Merge with existing data
        const mergedData = {
            ...result.profile,
            ...stepData,
        } as StudentProfileData;

        return await createOrUpdateStudentProfile(mergedData);
    } catch (error: any) {
        console.error("Error updating onboarding step:", error);
        return { success: false, error: error.message || "Failed to update step" };
    }
}
