"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "@/drizzle/db";
import { studentProfile, userActivity } from "@/drizzle/database/student-schema";
import { mentorProfile } from "@/drizzle/database/mentor-schema";
import { professionalProfile } from "@/drizzle/database/professional-schema";
import { eq, sql } from "drizzle-orm";

export async function updateScore(pointsToAdd: number, taskName: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) return { success: false, error: "Unauthorized" };

    const userId = session.user.id;
    const role = session.user.role;

    // Log Activity
    await db.insert(userActivity).values({
      id: crypto.randomUUID(),
      userId: userId,
      type: "todo_complete",
      description: `Completed: ${taskName}`,
      points: pointsToAdd,
    });

    // Update Profile points ONLY for students
    if (role === "student") {
      await db
        .update(studentProfile)
        .set({
          points: sql`${studentProfile.points} + ${pointsToAdd}`,
          updatedAt: new Date(),
        })
        .where(eq(studentProfile.userId, userId));
    }

    return { success: true };
  } catch (error: any) {
    console.error("Score update error:", error);
    return { success: false, error: error.message };
  }
}
