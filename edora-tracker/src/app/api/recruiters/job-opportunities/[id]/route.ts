import { db } from "@/drizzle/db";
import { jobOpportunities, appliedJobs, scheduledInterviews } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || !session.user || session.user.role !== "recruiter") {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Fetch job with organization data
        const job = await db.query.jobOpportunities.findFirst({
            where: eq(jobOpportunities.id, id),
            with: {
                organization: true,
            }
        });

        if (!job) {
            return NextResponse.json(
                { success: false, error: "Job not found" },
                { status: 404 }
            );
        }

        // Verify the job belongs to the current recruiter
        if (job.recruiterId !== session.user.id) {
            return NextResponse.json(
                { success: false, error: "Unauthorized access to this job" },
                { status: 403 }
            );
        }

        // Fetch applicants with student details using relations
        const applications = await db.query.appliedJobs.findMany({
            where: eq(appliedJobs.jobAppliedId, id),
            with: {
                student: true,
            },
            orderBy: (appliedJobs, { desc }) => [desc(appliedJobs.createdAt)],
        });

        // Fetch scheduled interviews for this job
        const interviews = await db.query.scheduledInterviews.findMany({
            where: eq(scheduledInterviews.jobAppliedId, id),
        });

        // Create a map of studentId to interview for quick lookup
        const interviewMap = new Map(
            interviews.map(interview => [interview.studentId, interview])
        );

        // Format applicants data with interview info
        const applicants = applications.map((application) => {
            const interview = application.studentId ? interviewMap.get(application.studentId) : null;

            return {
                id: application.id,
                studentId: application.studentId || "",
                studentName: application.student?.name || "Unknown",
                email: application.student?.email || "",
                appliedAt: application.createdAt || new Date(),
                status: application.status || ("pending" as const),
                // Interview details if scheduled
                interviewDate: interview?.date,
                interviewTime: interview?.time,
                // Default values for fields not in current schema
                phone: "",
                resume: "",
                coverLetter: undefined,
                experience: 0,
                education: "",
            };
        });

        // Format the job data
        const formattedJob = {
            ...job,
            requiredSkills: job.requiredSkills as string[] | null,
            niceToHaveSkills: job.niceToHaveSkills as string[] | null,
        };

        return NextResponse.json({
            success: true,
            job: formattedJob,
            applicants: applicants
        });
    } catch (error) {
        console.error("Error fetching job details:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
