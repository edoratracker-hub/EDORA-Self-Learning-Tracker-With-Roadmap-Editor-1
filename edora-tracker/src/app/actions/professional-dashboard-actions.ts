"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "@/drizzle/db";
import {
    professionalProfile,
    appliedJobs,
    scheduledInterviews,
    studentProfile,
    user
} from "@/drizzle/schema";
import { eq, count } from "drizzle-orm";

export async function getProfessionalDashboardData() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || session.user.role !== "professional") {
            return { success: false, error: "Unauthorized" };
        }

        const userId = session.user.id;

        // 1. Fetch Profile Status
        const profile = await db.query.professionalProfile.findFirst({
            where: eq(professionalProfile.userId, userId),
        });

        // 2. Count Applied Jobs
        const appliedJobsCount = await db
            .select({ value: count() })
            .from(appliedJobs)
            .where(eq(appliedJobs.studentId, userId))
            .then(res => res[0]?.value || 0);

        // 3. Count Scheduled Interviews
        const scheduledInterviewsCount = await db
            .select({ value: count() })
            .from(scheduledInterviews)
            .where(eq(scheduledInterviews.studentId, userId))
            .then(res => res[0]?.value || 0);

        // 4. Fetch a sample of students (Mentees placeholder)
        const mentees = await db.query.studentProfile.findMany({
            limit: 5,
            with: {
                user: true
            }
        });

        return {
            success: true,
            data: {
                profile: profile || null,
                stats: {
                    appliedJobs: appliedJobsCount,
                    interviews: scheduledInterviewsCount,
                    totalMentees: mentees.length, // Placeholder logic
                },
                mentees: mentees.map(m => ({
                    id: m.id,
                    name: m.name || m.user?.name || "Student",
                    avatar: m.user?.image || "",
                    goal: m.studyGoal || "None"
                }))
            }
        };
    } catch (error: any) {
        console.error("Error fetching professional dashboard data:", error);
        return { success: false, error: error.message || "Failed to fetch dashboard data" };
    }
}

export async function getAllMentees() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || session.user.role !== "professional") {
            return { success: false, error: "Unauthorized" };
        }

        const students = await db.query.studentProfile.findMany({
            with: {
                user: true
            }
        });

        return {
            success: true,
            mentees: students.map(s => ({
                id: s.id,
                name: s.name || s.user?.name || "Student",
                avatar: s.user?.image || "",
                course: s.currentEducation || "Unknown",
                goal: s.studyGoal || "General assistance"
            }))
        };
    } catch (error: any) {
        console.error("Error fetching all mentees:", error);
        return { success: false, error: "Failed to fetch mentees" };
    }
}
