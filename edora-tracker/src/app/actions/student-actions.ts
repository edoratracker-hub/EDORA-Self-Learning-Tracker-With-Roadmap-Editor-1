"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "@/drizzle/db";
import { appliedJobs, jobOpportunities, mentorProfile } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";

export async function applyToJob(jobId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return { success: false, error: "Unauthorized. Only authenticated users can apply to jobs." };
        }
        const job = await db.query.jobOpportunities.findFirst({
            where: eq(jobOpportunities.id, jobId)
        });

        if (!job) {
            return { success: false, error: "Job not found" };
        }
        const existingApplication = await db.query.appliedJobs.findFirst({
            where: and(
                eq(appliedJobs.studentId, session.user.id),
                eq(appliedJobs.jobAppliedId, jobId)
            )
        });

        if (existingApplication) {
            return { success: false, error: "You have already applied to this job" };
        }
        const applicationId = crypto.randomUUID();
        await db.insert(appliedJobs).values({
            id: applicationId,
            studentId: session.user.id,
            jobAppliedId: jobId,
            createdAt: new Date(),
        });
        await db
            .update(jobOpportunities)
            .set({
                totalApplicants: (job.totalApplicants || 0) + 1
            })
            .where(eq(jobOpportunities.id, jobId));

        return { success: true, applicationId };
    } catch (error: any) {
        console.error("Error applying to job:", error);
        return { success: false, error: error.message || "Failed to apply to job" };
    }
}

export async function getAppliedJobs() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return { success: false, error: "Unauthorized", appliedJobIds: [] };
        }

        const applications = await db.query.appliedJobs.findMany({
            where: eq(appliedJobs.studentId, session.user.id)
        });

        const appliedJobIds = applications.map(app => app.jobAppliedId).filter(Boolean) as string[];

        return { success: true, appliedJobIds };
    } catch (error: any) {
        console.error("Error fetching applied jobs:", error);
        return { success: false, error: error.message || "Failed to fetch applied jobs", appliedJobIds: [] };
    }
}

export async function getAppliedJobsDetails() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return { success: false, error: "Unauthorized", applications: [] };
        }

        const applications = await db.query.appliedJobs.findMany({
            where: eq(appliedJobs.studentId, session.user.id),
            with: {
                job: {
                    with: {
                        organization: true,
                        recruiter: true,
                    }
                }
            },
            orderBy: (appliedJobs, { desc }) => [desc(appliedJobs.createdAt)]
        });

        return { success: true, applications };
    } catch (error: any) {
        console.error("Error fetching applied jobs details:", error);
        return { success: false, error: error.message || "Failed to fetch applied jobs", applications: [] };
    }
}

export async function getStudentScheduledInterviews() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return { success: false, error: "Unauthorized", interviews: [] };
        }

        const { scheduledInterviews } = await import("@/drizzle/schema");

        const interviews = await db.query.scheduledInterviews.findMany({
            where: eq(scheduledInterviews.studentId, session.user.id),
            with: {
                job: {
                    with: {
                        organization: true,
                        recruiter: true,
                    }
                },
                rescheduleHistory: {
                    orderBy: (history, { desc }) => [desc(history.createdAt)],
                },
            },
            orderBy: (scheduledInterviews, { asc }) => [asc(scheduledInterviews.time)]
        });

        return { success: true, interviews };
    } catch (error: any) {
        console.error("Error fetching scheduled interviews:", error);
        return { success: false, error: error.message || "Failed to fetch scheduled interviews", interviews: [] };
    }
}

export async function getMentors() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || (session.user.role !== "student" && session.user.role !== "professional")) {
            return { success: false, error: "Unauthorized", mentors: [] };
        }

        const mentors = await db.select()
            .from(mentorProfile)
            .where(eq(mentorProfile.isVerified, true));

        return { success: true, mentors };
    } catch (error: any) {
        console.error("Error fetching mentors:", error);
        return { success: false, error: error.message || "Failed to fetch mentors", mentors: [] };
    }
}
