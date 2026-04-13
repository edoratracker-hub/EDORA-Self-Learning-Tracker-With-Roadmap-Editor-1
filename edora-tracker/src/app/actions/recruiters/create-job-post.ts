"use server";

import { db } from "@/drizzle/db";
import { jobOpportunities, recruiterOrganization } from "@/drizzle/schema";
import { jobOpportunitySchema } from "@/app/lib/validations";
import { revalidatePath } from "next/cache";
import { auth } from "@/app/lib/auth"; // Verify auth import path
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export async function createJobOpportunity(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || !session.user || session.user.role !== "recruiter") {
        return {
            success: false,
            error: "Unauthorized",
        };
    }

    // Get recruiter's organization first
    const organization = await db.query.recruiterOrganization.findFirst({
        where: eq(recruiterOrganization.userId, session.user.id)
    });

    if (!organization) {
        return {
            success: false,
            error: "You must set up an organization first",
        };
    }

    const rawData: any = {};

    formData.forEach((value, key) => {
        // Skip company field from form data since we'll use organization ID
        if (key === "company") {
            return;
        }
        if (key === "experienceMin" || key === "experienceMax" || key === "salaryMin" || key === "salaryMax") {
            rawData[key] = value ? Number(value) : undefined;
        } else if (key === "applicationDeadline") {
            rawData[key] = value ? new Date(value as string) : undefined;
        } else {
            rawData[key] = value;
        }
    });

    const validatedFields = jobOpportunitySchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            success: false,
            error: "Invalid fields",
            details: validatedFields.error.flatten().fieldErrors,
        };
    }

    const {
        requiredSkills,
        niceToHaveSkills,
        ...otherData
    } = validatedFields.data;

    // Process skills strings into arrays
    const requiredSkillsArray = requiredSkills
        ? requiredSkills.split(",").map(s => s.trim()).filter(Boolean)
        : [];

    const niceToHaveSkillsArray = niceToHaveSkills
        ? niceToHaveSkills.split(",").map(s => s.trim()).filter(Boolean)
        : [];

    try {
        await db.insert(jobOpportunities).values({
            id: crypto.randomUUID(),
            recruiterId: session.user.id,
            company: organization.id, // Use organization ID instead of company name
            ...otherData,
            requiredSkills: requiredSkillsArray,
            niceToHaveSkills: niceToHaveSkillsArray,
            createdAt: new Date(),
            totalApplicants: 0,
            views: 0
        });

        revalidatePath("/dashboard/recruiter");
        return { success: true };
    } catch (error) {
        console.error("Failed to create job opportunity:", error);
        return { success: false, error: "Failed to create job opportunity" };
    }
}
