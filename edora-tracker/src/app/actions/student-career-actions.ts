"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "@/drizzle/db";
import { appliedJobs, scheduledInterviews } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";

export async function getStudentApplications() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            throw new Error("Unauthorized");
        }

        const applications = await db.query.appliedJobs.findMany({
            where: eq(appliedJobs.studentId, session.user.id),
            with: {
                job: {
                    with: {
                        organization: true,
                    },
                },
            },
            orderBy: [desc(appliedJobs.createdAt)],
        });

        return { success: true, data: applications };
    } catch (error: any) {
        console.error("Error fetching applications:", error);
        return {
            success: false,
            error: error.message || "Failed to fetch applications",
        };
    }
}

export async function getStudentInterviews() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            throw new Error("Unauthorized");
        }

        const interviews = await db.query.scheduledInterviews.findMany({
            where: eq(scheduledInterviews.studentId, session.user.id),
            with: {
                job: {
                    with: {
                        organization: true,
                    },
                },
                rescheduleHistory: true,
            },
            orderBy: [desc(scheduledInterviews.time)],
        });

        return { success: true, data: interviews };
    } catch (error: any) {
        console.error("Error fetching interviews:", error);
        return {
            success: false,
            error: error.message || "Failed to fetch interviews",
        };
    }
}
