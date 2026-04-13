"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "@/drizzle/db";
import { scheduledInterviews, appliedJobs, interviewRescheduleHistory, jobOpportunities } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { createCalendarEvent, updateCalendarEvent } from "@/app/lib/google-calendar";
import {
    sendInterviewConfirmationEmail,
    sendRescheduleNotificationEmail,
    type InterviewDetails
} from "@/app/lib/email-service";

export interface ScheduleInterviewData {
    jobId: string;
    studentId: string;
    applicationId: string;
    date: Date;
    time: string;
    googleAccessToken?: string; // Optional, for Google Calendar integration
}

export async function scheduleInterview(data: ScheduleInterviewData) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || session.user.role !== "recruiter") {
            return { success: false, error: "Unauthorized" };
        }

        // Fetch student and job details for email
        const application = await db.query.appliedJobs.findFirst({
            where: eq(appliedJobs.id, data.applicationId),
            with: {
                student: true,
                job: {
                    with: {
                        organization: true,
                    }
                }
            }
        });

        if (!application || !application.student || !application.job) {
            return { success: false, error: "Application not found" };
        }

        // Create scheduled interview
        const interviewId = crypto.randomUUID();

        // Combine date and time into a single timestamp
        const [hours, minutes] = data.time.split(':').map(Number);
        const interviewDateTime = new Date(data.date);
        interviewDateTime.setHours(hours, minutes, 0, 0);

        let googleEventId: string | undefined;
        let meetingLink: string | undefined;
        let emailSent = false;

        // Create Google Calendar event if access token provided
        if (data.googleAccessToken) {
            const endDateTime = new Date(interviewDateTime);
            endDateTime.setHours(endDateTime.getHours() + 1);

            const calendarEvent = {
                summary: `Interview: ${application.job.title}`,
                description: `Interview for the position of ${application.job.title} at ${application.job.organization?.companyName || 'the company'}`,
                start: {
                    dateTime: interviewDateTime.toISOString(),
                    timeZone: 'Asia/Kolkata', // Adjust based on your timezone
                },
                end: {
                    dateTime: endDateTime.toISOString(),
                    timeZone: 'Asia/Kolkata',
                },
                attendees: [
                    {
                        email: application.student.email,
                        displayName: application.student.name || undefined,
                    }
                ],
                reminders: {
                    useDefault: false as const,
                    overrides: [
                        { method: 'email' as const, minutes: 24 * 60 }, // 1 day before
                        { method: 'popup' as const, minutes: 60 }, // 1 hour before
                    ],
                },
            };

            const calendarResult = await createCalendarEvent(data.googleAccessToken, calendarEvent);

            if (calendarResult.success) {
                googleEventId = calendarResult.eventId || undefined;
                meetingLink = calendarResult.meetLink || undefined;
            }
        }

        // Send email confirmation
        const emailDetails: InterviewDetails = {
            jobTitle: application.job.title,
            companyName: application.job.organization?.companyName || 'Company',
            candidateName: application.student.name || 'Candidate',
            candidateEmail: application.student.email,
            recruiterName: session.user.name || 'Recruiter',
            recruiterEmail: session.user.email || '',
            interviewDate: data.date,
            interviewTime: interviewDateTime,
            meetingLink: meetingLink,
            location: application.job.location || undefined,
        };

        const emailResult = await sendInterviewConfirmationEmail(emailDetails);
        emailSent = emailResult.success;

        // Save to database
        await db.insert(scheduledInterviews).values({
            id: interviewId,
            studentId: data.studentId,
            jobAppliedId: data.jobId,
            date: data.date,
            time: interviewDateTime,
            googleCalendarEventId: googleEventId,
            meetingLink: meetingLink,
            emailSent: emailSent,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Update application status to "scheduled"
        await db
            .update(appliedJobs)
            .set({ status: "scheduled" })
            .where(eq(appliedJobs.id, data.applicationId));

        // Send inbox notification to student
        try {
            const { sendInterviewScheduledNotification } = await import("@/app/lib/notification-service");
            const { format: fmtDate } = await import("date-fns");
            const dateTimeStr = fmtDate(interviewDateTime, "MMM d, yyyy 'at' h:mm a");
            await sendInterviewScheduledNotification(
                data.studentId,
                application.job.title,
                application.job.organization?.companyName || 'Company',
                dateTimeStr
            );
        } catch (e) {
            console.error("Failed to send interview notification:", e);
        }

        return {
            success: true,
            interviewId,
            meetingLink,
            googleEventCreated: !!googleEventId,
            emailSent,
            message: "Interview scheduled successfully"
        };
    } catch (error: any) {
        console.error("Error scheduling interview:", error);
        return { success: false, error: error.message || "Failed to schedule interview" };
    }
}

export interface RescheduleInterviewData {
    interviewId: string;
    newDate: Date;
    newTime: string;
    reason?: string;
    googleAccessToken?: string;
}

export async function rescheduleInterview(data: RescheduleInterviewData) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || session.user.role !== "recruiter") {
            return { success: false, error: "Unauthorized" };
        }

        // Fetch current interview details
        const interview = await db.query.scheduledInterviews.findFirst({
            where: eq(scheduledInterviews.id, data.interviewId),
            with: {
                student: true,
                job: {
                    with: {
                        organization: true,
                    }
                }
            }
        });

        if (!interview || !interview.student || !interview.job) {
            return { success: false, error: "Interview not found" };
        }

        const oldDate = interview.date;
        const oldTime = interview.time;

        // Combine date and time for new schedule
        const [hours, minutes] = data.newTime.split(':').map(Number);
        const newDateTime = new Date(data.newDate);
        newDateTime.setHours(hours, minutes, 0, 0);

        // Update Google Calendar event if it exists
        if (interview.googleCalendarEventId && data.googleAccessToken) {
            const endDateTime = new Date(newDateTime);
            endDateTime.setHours(endDateTime.getHours() + 1);

            await updateCalendarEvent(
                data.googleAccessToken,
                interview.googleCalendarEventId,
                {
                    start: {
                        dateTime: newDateTime.toISOString(),
                        timeZone: 'Asia/Kolkata',
                    },
                    end: {
                        dateTime: endDateTime.toISOString(),
                        timeZone: 'Asia/Kolkata',
                    },
                }
            );
        }

        // Send reschedule notification email
        if (oldDate && oldTime) {
            const emailDetails: InterviewDetails = {
                jobTitle: interview.job.title,
                companyName: interview.job.organization?.companyName || 'Company',
                candidateName: interview.student.name || 'Candidate',
                candidateEmail: interview.student.email,
                recruiterName: session.user.name || 'Recruiter',
                recruiterEmail: session.user.email || '',
                interviewDate: data.newDate,
                interviewTime: newDateTime,
                meetingLink: interview.meetingLink || undefined,
                location: interview.job.location || undefined,
            };

            await sendRescheduleNotificationEmail(emailDetails, oldDate, oldTime);
        }

        // Save reschedule history
        const historyId = crypto.randomUUID();
        await db.insert(interviewRescheduleHistory).values({
            id: historyId,
            interviewId: data.interviewId,
            oldDate: oldDate,
            oldTime: oldTime,
            newDate: data.newDate,
            newTime: newDateTime,
            reason: data.reason,
            rescheduledBy: session.user.id,
            createdAt: new Date(),
        });

        // Update interview in database
        await db
            .update(scheduledInterviews)
            .set({
                date: data.newDate,
                time: newDateTime,
                updatedAt: new Date(),
            })
            .where(eq(scheduledInterviews.id, data.interviewId));

        // Update application status to "rescheduled"
        await db
            .update(appliedJobs)
            .set({ status: "rescheduled" })
            .where(eq(appliedJobs.jobAppliedId, interview.jobAppliedId as string));

        // Send inbox notification to student
        try {
            const { sendInterviewRescheduledNotification } = await import("@/app/lib/notification-service");
            const { format: fmtDate } = await import("date-fns");
            const dateTimeStr = fmtDate(newDateTime, "MMM d, yyyy 'at' h:mm a");
            await sendInterviewRescheduledNotification(
                interview.studentId as string,
                interview.job.title,
                dateTimeStr,
                data.reason
            );
        } catch (e) {
            console.error("Failed to send reschedule notification:", e);
        }

        return {
            success: true,
            message: "Interview rescheduled successfully",
        };
    } catch (error: any) {
        console.error("Error rescheduling interview:", error);
        return { success: false, error: error.message || "Failed to reschedule interview" };
    }
}

export async function getScheduledInterviews(jobId?: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || session.user.role !== "recruiter") {
            return { success: false, error: "Unauthorized", interviews: [] };
        }

        const interviews = await db.query.scheduledInterviews.findMany({
            where: jobId
                ? eq(scheduledInterviews.jobAppliedId, jobId)
                : undefined,
            with: {
                student: true,
                job: {
                    with: {
                        organization: true,
                    },
                },
                rescheduleHistory: {
                    orderBy: (history, { desc }) => [desc(history.createdAt)],
                },
            },
        });

        return { success: true, interviews };
    } catch (error: any) {
        console.error("Error fetching scheduled interviews:", error);
        return { success: false, error: error.message, interviews: [] };
    }
}

/**
 * Fetch interviews for the currently logged-in user (as the interviewee/student).
 * Works for all roles except admin.
 */
export async function getUserScheduledInterviews() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return { success: false, error: "Unauthorized", interviews: [] };
        }

        const interviews = await db.query.scheduledInterviews.findMany({
            where: eq(scheduledInterviews.studentId, session.user.id),
            with: {
                student: true,
                job: {
                    with: {
                        organization: true,
                    },
                },
                rescheduleHistory: {
                    orderBy: (history, { desc }) => [desc(history.createdAt)],
                },
            },
        });

        return { success: true, interviews };
    } catch (error: any) {
        console.error("Error fetching user scheduled interviews:", error);
        return { success: false, error: error.message, interviews: [] };
    }
}

export async function getUpcomingInterviews() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || session.user.role !== "recruiter") {
            return { success: false, error: "Unauthorized", interviews: [] };
        }

        const now = new Date();

        const interviews = await db.query.scheduledInterviews.findMany({
            with: {
                student: true,
                job: {
                    with: {
                        organization: true,
                    }
                },
            },
        });

        // Filter interviews that are in the future
        const upcomingInterviews = interviews.filter(interview => {
            if (!interview.date || !interview.time) return false;
            const interviewDateTime = new Date(interview.time);
            return interviewDateTime > now;
        });

        return { success: true, interviews: upcomingInterviews };
    } catch (error: any) {
        console.error("Error fetching upcoming interviews:", error);
        return { success: false, error: error.message, interviews: [] };
    }
}
