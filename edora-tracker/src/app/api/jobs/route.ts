import { db } from "@/drizzle/db";
import { jobOpportunities, recruiterOrganization } from "@/drizzle/schema";
import { eq, and, or, ilike, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search");
        const type = searchParams.get("type");
        const workMode = searchParams.get("workMode");
        const location = searchParams.get("location");
        const category = searchParams.get("category");

        const whereConditions = [eq(jobOpportunities.status, "open")];

        if (search) {
            whereConditions.push(
                or(
                    ilike(jobOpportunities.title, `%${search}%`),
                    ilike(jobOpportunities.description, `%${search}%`)
                ) as any
            );
        }

        if (type) {
            whereConditions.push(eq(jobOpportunities.jobType, type as any));
        }

        if (workMode) {
            whereConditions.push(eq(jobOpportunities.workMode, workMode as any));
        }

        if (location) {
            whereConditions.push(
                or(
                    ilike(jobOpportunities.location, `%${location}%`),
                    ilike(jobOpportunities.country, `%${location}%`)
                ) as any
            );
        }

        const jobs = await db.query.jobOpportunities.findMany({
            where: and(...whereConditions),
            with: {
                organization: {
                    columns: {
                        id: true,
                        companyName: true,
                        companyLogo: true,
                        location: true,
                        website: true,
                    }
                }
            },
            orderBy: (jobs, { desc }) => [desc(jobs.createdAt)],
        });

        return NextResponse.json({
            success: true,
            data: jobs,
            count: jobs.length,
            pagination: {
                total: jobs.length,
                limit: jobs.length,
                offset: 0,
                hasMore: false
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
