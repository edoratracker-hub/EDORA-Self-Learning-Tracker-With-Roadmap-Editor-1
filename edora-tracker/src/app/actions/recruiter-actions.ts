"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "@/drizzle/db";
import { recruiterOrganization, jobOpportunities } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { recruiterOrganizationSchema, type RecruiterOrganizationValues, jobOpportunitySchema, type JobOpportunityFormData } from "@/app/lib/validations";
import { redirect } from "next/navigation";
import { sendOrganizationVerificationEmail } from "@/app/lib/email";

export async function createRecruiterOrganization(values: RecruiterOrganizationValues) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return { error: "Unauthorized" };
        }

        const parsed = recruiterOrganizationSchema.safeParse(values);
        if (!parsed.success) {
            return { error: "Invalid data" };
        }

        const existingOrg = await db.query.recruiterOrganization.findFirst({
            where: eq(recruiterOrganization.userId, session.user.id)
        });

        if (existingOrg) {
            return { error: "Organization already exists" };
        }

        const organizationId = crypto.randomUUID();

        await db.insert(recruiterOrganization).values({
            id: organizationId,
            userId: session.user.id,
            companyName: values.companyName,
            website: values.website || null,
            phoneNumber: values.phoneNumber || null,
            companyLogo: values.companyLogo || null,
            location: values.location,
            verified: false, // Default to false
            createdAt: new Date(),
        });

        // Send verification email to admin
        try {
            await sendOrganizationVerificationEmail(
                values.companyName,
                organizationId,
                session.user.email,
                session.user.name || session.user.email
            );
        } catch (emailError) {
            console.error("Failed to send verification email:", emailError);
            // Don't fail the organization creation if email fails
        }

        return {
            success: true,
            organization: {
                id: organizationId,
                companyName: values.companyName,
                verified: false
            }
        };
    } catch (error: any) {
        console.error("Error creating recruiter organization:", error);
        return { error: error.message || "Failed to create organization" };
    }
}

export async function checkRecruiterOrganizationStatus() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return { hasOrganization: false };
        }

        const existingOrg = await db.query.recruiterOrganization.findFirst({
            where: eq(recruiterOrganization.userId, session.user.id)
        });

        return {
            hasOrganization: !!existingOrg,
            organization: existingOrg || null,
            session
        };

    } catch (error) {
        return { hasOrganization: false, organization: null };
    }
}

export async function getRecruiterOrganization() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return { organization: null, error: "Unauthorized" };
        }

        const organization = await db.query.recruiterOrganization.findFirst({
            where: eq(recruiterOrganization.userId, session.user.id)
        });

        if (!organization) {
            return { organization: null, error: "No organization found" };
        }

        return { organization, error: null };

    } catch (error) {
        return { organization: null, error: "Failed to fetch organization" };
    }
}

export async function createJobOpportunity(values: JobOpportunityFormData) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || session.user.role !== "recruiter") {
            return { success: false, error: "Unauthorized" };
        }

        // Get recruiter's organization
        const organization = await db.query.recruiterOrganization.findFirst({
            where: eq(recruiterOrganization.userId, session.user.id)
        });

        if (!organization) {
            return { success: false, error: "You must set up an organization first" };
        }

        // Validate data
        const parsed = jobOpportunitySchema.safeParse(values);
        if (!parsed.success) {
            return { success: false, error: "Invalid data", errors: parsed.error.flatten().fieldErrors };
        }

        const data = parsed.data;

        // Parse skills from comma-separated strings to arrays
        const requiredSkills = data.requiredSkills
            ? data.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
            : null;
        const niceToHaveSkills = data.niceToHaveSkills
            ? data.niceToHaveSkills.split(',').map((s) => s.trim()).filter(Boolean)
            : null;

        // Create job opportunity
        const jobId = crypto.randomUUID();
        await db.insert(jobOpportunities).values({
            id: jobId,
            recruiterId: session.user.id,
            company: organization.id,
            title: data.title,
            description: data.description || null,
            responsibilities: data.responsibilities || null,
            benefits: data.benefits || null,
            requiredSkills: requiredSkills as any,
            niceToHaveSkills: niceToHaveSkills as any,
            experienceMin: data.experienceMin ?? null,
            experienceMax: data.experienceMax ?? null,
            educationRequired: data.educationRequired || null,
            salaryMin: data.salaryMin ?? null,
            salaryMax: data.salaryMax ?? null,
            currency: data.currency || "INR",
            salaryType: data.salaryType || null,
            jobType: data.jobType || "full-time",
            workMode: data.workMode || "hybrid",
            location: data.location || null,
            country: data.country || null,
            applicationDeadline: data.applicationDeadline ?? null,
            status: data.status || "draft",
            totalApplicants: 0,
            views: 0,
            createdAt: new Date(),
        });

        return { success: true, jobId };
    } catch (error: any) {
        console.error("Error creating job opportunity:", error);
        return { success: false, error: error.message || "Failed to create job opportunity" };
    }
}

export async function updateJobOpportunity(jobId: string, values: JobOpportunityFormData) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || session.user.role !== "recruiter") {
            return { success: false, error: "Unauthorized" };
        }

        // Get the existing job opportunity
        const existingJob = await db.query.jobOpportunities.findFirst({
            where: eq(jobOpportunities.id, jobId),
            with: {
                organization: true
            }
        });

        if (!existingJob) {
            return { success: false, error: "Job not found" };
        }

        // Verify the user is the creator
        if (existingJob.recruiterId !== session.user.id) {
            return { success: false, error: "You are not authorized to edit this job post" };
        }

        // Get recruiter's organization
        const organization = await db.query.recruiterOrganization.findFirst({
            where: eq(recruiterOrganization.userId, session.user.id)
        });

        if (!organization) {
            return { success: false, error: "Organization not found" };
        }

        // Verify the job belongs to the same organization
        if (existingJob.company !== organization.id) {
            return { success: false, error: "This job post belongs to a different organization" };
        }

        // Validate data
        const parsed = jobOpportunitySchema.safeParse(values);
        if (!parsed.success) {
            return { success: false, error: "Invalid data", errors: parsed.error.flatten().fieldErrors };
        }

        const data = parsed.data;

        // Parse skills from comma-separated strings to arrays
        const requiredSkills = data.requiredSkills
            ? data.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
            : null;
        const niceToHaveSkills = data.niceToHaveSkills
            ? data.niceToHaveSkills.split(',').map((s) => s.trim()).filter(Boolean)
            : null;

        // Update job opportunity
        await db.update(jobOpportunities)
            .set({
                title: data.title,
                description: data.description || null,
                responsibilities: data.responsibilities || null,
                benefits: data.benefits || null,
                requiredSkills: requiredSkills as any,
                niceToHaveSkills: niceToHaveSkills as any,
                experienceMin: data.experienceMin ?? null,
                experienceMax: data.experienceMax ?? null,
                educationRequired: data.educationRequired || null,
                salaryMin: data.salaryMin ?? null,
                salaryMax: data.salaryMax ?? null,
                currency: data.currency || "INR",
                salaryType: data.salaryType || null,
                jobType: data.jobType || "full-time",
                workMode: data.workMode || "hybrid",
                location: data.location || null,
                country: data.country || null,
                applicationDeadline: data.applicationDeadline ?? null,
                status: data.status || "draft",
            })
            .where(eq(jobOpportunities.id, jobId));

        return { success: true, jobId };
    } catch (error: any) {
        console.error("Error updating job opportunity:", error);
        return { success: false, error: error.message || "Failed to update job opportunity" };
    }
}

export async function deleteJobOpportunity(jobId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || session.user.role !== "recruiter") {
            return { success: false, error: "Unauthorized" };
        }

        // Get the existing job opportunity
        const existingJob = await db.query.jobOpportunities.findFirst({
            where: eq(jobOpportunities.id, jobId),
            with: {
                organization: true
            }
        });

        if (!existingJob) {
            return { success: false, error: "Job not found" };
        }

        // Verify the user is the creator
        if (existingJob.recruiterId !== session.user.id) {
            return { success: false, error: "You are not authorized to delete this job post" };
        }

        // Get recruiter's organization
        const organization = await db.query.recruiterOrganization.findFirst({
            where: eq(recruiterOrganization.userId, session.user.id)
        });

        if (!organization) {
            return { success: false, error: "Organization not found" };
        }

        // Verify the job belongs to the same organization
        if (existingJob.company !== organization.id) {
            return { success: false, error: "This job post belongs to a different organization" };
        }

        // Delete the job opportunity
        await db.delete(jobOpportunities)
            .where(eq(jobOpportunities.id, jobId));

        return { success: true };
    } catch (error: any) {
        console.error("Error deleting job opportunity:", error);
        return { success: false, error: error.message || "Failed to delete job opportunity" };
    }
}

export async function getJobOpportunity(jobId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || session.user.role !== "recruiter") {
            return { success: false, error: "Unauthorized", job: null };
        }

        const job = await db.query.jobOpportunities.findFirst({
            where: eq(jobOpportunities.id, jobId),
            with: {
                organization: true
            }
        });

        if (!job) {
            return { success: false, error: "Job not found", job: null };
        }


        if (job.recruiterId !== session.user.id) {
            return { success: false, error: "You are not authorized to view this job post", job: null };
        }

        return { success: true, job };
    } catch (error: any) {
        console.error("Error fetching job opportunity:", error);
        return { success: false, error: error.message || "Failed to fetch job opportunity", job: null };
    }
}

