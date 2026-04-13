"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "@/drizzle/db";
import { scheduledInterviews, jobOpportunities } from "@/drizzle/schema";
import { eq, gte, and } from "drizzle-orm";

export interface UpcomingEvent {
    id: string;
    title: string;
    type: "interview" | "deadline" | "webinar";
    date: Date;
    time: Date | null;
    meetingLink: string | null;
    company: string | null;
    candidateName: string | null;
}

export async function getUpcomingEventsForProfessional() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || session.user.role !== "professional") {
            return { success: false, error: "Unauthorized", events: [] };
        }

        const now = new Date();

        // 1. Fetch upcoming interviews (scheduled for the future)
        const interviews = await db.query.scheduledInterviews.findMany({
            with: {
                student: true,
                job: {
                    with: {
                        organization: true,
                    },
                },
            },
        });

        const upcomingInterviews: UpcomingEvent[] = interviews
            .filter((interview) => {
                if (!interview.date || !interview.time) return false;
                const interviewDateTime = new Date(interview.time);
                return interviewDateTime > now;
            })
            .map((interview) => ({
                id: interview.id,
                title: interview.job?.title || "Interview",
                type: "interview" as const,
                date: new Date(interview.date!),
                time: interview.time ? new Date(interview.time) : null,
                meetingLink: interview.meetingLink,
                company:
                    interview.job?.organization?.companyName || null,
                candidateName: interview.student?.name || null,
            }));

        // 2. Fetch job opportunities with upcoming deadlines
        const jobsWithDeadlines = await db.query.jobOpportunities.findMany({
            where: gte(jobOpportunities.applicationDeadline, now),
            with: {
                organization: true,
            },
        });

        const upcomingDeadlines: UpcomingEvent[] = jobsWithDeadlines.map(
            (job) => ({
                id: job.id,
                title: job.title,
                type: "deadline" as const,
                date: new Date(job.applicationDeadline!),
                time: null,
                meetingLink: null,
                company: job.organization?.companyName || null,
                candidateName: null,
            })
        );

        // Combine and sort by date (nearest first)
        const allEvents = [...upcomingInterviews, ...upcomingDeadlines]
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(0, 6); // Limit to 6 upcoming events

        return { success: true, events: allEvents };
    } catch (error: any) {
        console.error("Error fetching upcoming events:", error);
        return {
            success: false,
            error: error.message || "Failed to fetch events",
            events: [],
        };
    }
}
