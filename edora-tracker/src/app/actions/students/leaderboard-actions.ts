"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "@/drizzle/db";
import { user, studentProfile } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";

export interface LeaderboardStudent {
  id: string;
  userId: string;
  name: string;
  avatar: string | null;
  points: number;
  streak: number;
  previousRank: number;
  department: string;
}

export async function getStudentLeaderboard() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false as const, error: "Unauthorized" };
    }

    // Fetch all students with their profiles, ordered by points descending
    const students = await db
      .select({
        profileId: studentProfile.id,
        userId: studentProfile.userId,
        name: user.name,
        avatar: user.image,
        points: studentProfile.points,
        streak: studentProfile.streak,
        previousRank: studentProfile.previousRank,
        studyGoal: studentProfile.studyGoal,
        currentEducation: studentProfile.currentEducation,
      })
      .from(studentProfile)
      .innerJoin(user, eq(studentProfile.userId, user.id))
      .orderBy(desc(studentProfile.points));

    // Map to leaderboard entries with computed ranks
    const leaderboard: LeaderboardStudent[] = students.map((s, index) => ({
      id: s.profileId,
      userId: s.userId,
      name: s.name ?? "Unknown Student",
      avatar: s.avatar,
      points: s.points,
      streak: s.streak,
      previousRank: s.previousRank,
      department: s.currentEducation ?? s.studyGoal ?? "Student",
    }));

    return { success: true as const, data: leaderboard };
  } catch (error: any) {
    console.error("Error fetching student leaderboard:", error);
    return {
      success: false as const,
      error: error.message || "Failed to fetch leaderboard",
    };
  }
}
