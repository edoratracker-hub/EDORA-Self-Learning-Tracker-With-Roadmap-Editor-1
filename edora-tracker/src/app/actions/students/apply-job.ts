"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "@/drizzle/db";
import { appliedJobs } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function applyForJob(jobId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || !session.user || session.user.role !== "student") {
            return { success: false, error: "Unauthorized. Please sign in as a student to apply." };
        }

        const studentId = session.user.id;

        // Check if student has already applied
        const existingApplication = await db.query.appliedJobs.findFirst({
            where: and(
                eq(appliedJobs.studentId, studentId),
                eq(appliedJobs.jobAppliedId, jobId)
            )
        });

        if (existingApplication) {
            return { success: false, error: "You have already applied for this job." };
        }

        // Create new application
        await db.insert(appliedJobs).values({
            id: crypto.randomUUID(),
            studentId,
            jobAppliedId: jobId,
            status: "applied",
            createdAt: new Date()
        });

        revalidatePath("/dashboard/students/career");
        revalidatePath(`/dashboard/career/${jobId}`);

        return { success: true };
    } catch (error: any) {
        console.error("Error applying for job:", error);
        return { success: false, error: error.message || "An unexpected error occurred while applying." };
    }
}
