import { db } from "@/drizzle/db";
import { studentProfile } from "@/drizzle/schema";
import { sendDailyStudyReminder } from "@/app/lib/notification-service";
import { NextResponse } from "next/server";

/**
 * GET /api/notifications/daily-reminder
 *
 * Sends a daily study reminder to all students.
 * This can be triggered by a cron job (e.g., Vercel Cron or external scheduler)
 * Add to vercel.json: { "crons": [{ "path": "/api/notifications/daily-reminder", "schedule": "0 8 * * *" }] }
 */
export async function GET(request: Request) {
  try {
    // Verify cron secret (optional but recommended)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all students
    const students = await db.query.studentProfile.findMany({
      columns: { userId: true },
    });

    let sent = 0;
    for (const student of students) {
      await sendDailyStudyReminder(student.userId);
      sent++;
    }

    return NextResponse.json({
      success: true,
      message: `Sent ${sent} daily study reminders`,
    });
  } catch (error: any) {
    console.error("Error sending daily reminders:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
