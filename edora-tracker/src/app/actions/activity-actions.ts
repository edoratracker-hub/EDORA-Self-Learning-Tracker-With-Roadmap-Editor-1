"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "@/drizzle/db";
import { session, user } from "@/drizzle/schema";
import { eq, sql } from "drizzle-orm";

export interface ActivityDay {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface ActivityHeatmapResult {
  success: boolean;
  data: ActivityDay[];
  accountCreatedAt?: string;
  error?: string;
}

/**
 * Fetches the current user's session-based activity for the past year.
 * Groups sessions by calendar date and returns a count per day.
 */
export async function getUserActivityHeatmap(): Promise<ActivityHeatmapResult> {
  try {
    const currentSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!currentSession) {
      return { success: false, data: [], error: "Unauthorized" };
    }

    const userId = currentSession.user.id;

    const userRecord = await db
      .select({ createdAt: user.createdAt })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    const accountCreatedAt = userRecord[0]?.createdAt ?? new Date();

    const rows = await db
      .select({
        date: sql<string>`DATE(${session.createdAt})`.as("activity_date"),
        count: sql<number>`COUNT(*)::int`.as("activity_count"),
      })
      .from(session)
      .where(eq(session.userId, userId))
      .groupBy(sql`DATE(${session.createdAt})`)
      .orderBy(sql`DATE(${session.createdAt})`);

    return {
      success: true,
      data: rows,
      accountCreatedAt: accountCreatedAt.toISOString(),
    };
  } catch (error: any) {
    console.error("Error fetching activity heatmap:", error);
    return {
      success: false,
      data: [],
      error: error.message ?? "Failed to fetch activity data",
    };
  }
}
