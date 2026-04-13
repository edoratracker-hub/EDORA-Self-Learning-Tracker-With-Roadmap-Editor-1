import { db } from "@/drizzle/db";
import { jobOpportunities, recruiterOrganization } from "@/drizzle/schema";
import { eq, desc, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        console.log("Recruiter Jobs API - Session:", JSON.stringify(session, null, 2));

        if (!session || !session.user || session.user.role !== "recruiter") {
            console.log("Unauthorized access attempt. Role:", session?.user?.role);
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get the recruiter's organization
        const organization = await db.query.recruiterOrganization.findFirst({
            where: eq(recruiterOrganization.userId, session.user.id)
        });

        if (!organization) {
            console.log("No organization found for recruiter:", session.user.id);
            return NextResponse.json({
                success: true,
                data: [],
                count: 0,
                organization: null,
                message: "Please set up your organization first"
            });
        }

        // Fetch jobs with organization data using relations
        const jobs = await db.query.jobOpportunities.findMany({
            where: and(
                eq(jobOpportunities.recruiterId, session.user.id),
                eq(jobOpportunities.company, organization.id)
            ),
            orderBy: [desc(jobOpportunities.createdAt)],
            with: {
                organization: true,
            }
        });

        // Transform jsonb fields safely and calculate stats
        const formattedJobs = jobs.map(job => ({
            ...job,
            requiredSkills: job.requiredSkills as string[] | null,
            niceToHaveSkills: job.niceToHaveSkills as string[] | null,
        }));

        const activeJobs = formattedJobs.filter(job => job.status === "open").length;
        const totalApplicants = formattedJobs.reduce((acc, job) => acc + (job.totalApplicants || 0), 0);

        // Fetch interview count
        const jobIds = formattedJobs.map(job => job.id);
        let totalInterviews = 0;
        if (jobIds.length > 0) {
            const interviews = await db.query.scheduledInterviews.findMany({
                where: (table, { inArray }) => inArray(table.jobAppliedId, jobIds)
            });
            totalInterviews = interviews.length;
        }

        return NextResponse.json({
            success: true,
            data: formattedJobs,
            count: formattedJobs.length,
            stats: {
                activeJobs,
                totalApplicants,
                totalInterviews
            },
            organization: {
                id: organization.id,
                companyName: organization.companyName,
                companyLogo: organization.companyLogo,
                location: organization.location,
                website: organization.website,
                phoneNumber: organization.phoneNumber,
            }
        });
    } catch (error) {
        console.error("Error fetching job opportunities:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

