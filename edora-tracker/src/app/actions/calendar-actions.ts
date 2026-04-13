"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "@/drizzle/db";
import { calendarEvents } from "@/drizzle/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";

export async function createCalendarEvent(data: {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  color?: string;
}) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, error: "Unauthorized" };

    const id = nanoid();
    await db.insert(calendarEvents).values({
      id,
      userId: session.user.id,
      title: data.title,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      color: data.color || "bg-blue-600",
    });

    revalidatePath("/dashboard/mentor/calendar");
    revalidatePath("/dashboard/students/calendar");
    revalidatePath("/dashboard/professionals/calendar");
    revalidatePath("/dashboard/recruiter/calendar");

    // Send inbox notification
    try {
      const { sendCalendarEventNotification } = await import("@/app/lib/notification-service");
      const timeStr = format(data.startTime, "MMM d, yyyy 'at' h:mm a");
      await sendCalendarEventNotification(session.user.id, data.title, timeStr);
    } catch (e) {
      console.error("Failed to send calendar event notification:", e);
    }

    return { success: true, id };
  } catch (error: any) {
    console.error("Error creating calendar event:", error);
    return { success: false, error: error.message || "Failed to create event" };
  }
}

export async function getCalendarEvents(startDate: Date, endDate: Date) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, error: "Unauthorized", events: [] };

    const events = await db.query.calendarEvents.findMany({
      where: and(
        eq(calendarEvents.userId, session.user.id),
        gte(calendarEvents.startTime, startDate),
        lte(calendarEvents.startTime, endDate)
      ),
      orderBy: [desc(calendarEvents.startTime)],
    });

    return { success: true, events };
  } catch (error: any) {
    console.error("Error fetching calendar events:", error);
    return { success: false, error: error.message || "Failed to fetch events", events: [] };
  }
}

export async function getMonthEvents(date: Date) {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
  
  return getCalendarEvents(startOfMonth, endOfMonth);
}

export async function checkAndSendTodayReminders() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, error: "Unauthorized" };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayEvents = await db.query.calendarEvents.findMany({
      where: and(
        eq(calendarEvents.userId, session.user.id),
        gte(calendarEvents.startTime, today),
        lte(calendarEvents.startTime, tomorrow)
      ),
    });

    if (todayEvents.length > 0) {
      const { sendCalendarMorningReminders } = await import("@/app/lib/notification-service");
      for (const event of todayEvents) {
        const timeStr = format(event.startTime, "h:mm a");
        await sendCalendarMorningReminders(session.user.id, event.title, timeStr);
      }
    }

    return { success: true, count: todayEvents.length };
  } catch (error) {
    console.error("Error checking reminders:", error);
    return { success: false };
  }
}
