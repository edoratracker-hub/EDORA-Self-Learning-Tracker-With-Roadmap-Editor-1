import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { mentorProfile } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user.role !== "mentor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await db.query.mentorProfile.findFirst({
      where: eq(mentorProfile.userId, session.user.id),
    });

    return NextResponse.json({
      verificationStatus: profile?.verificationStatus || "pending",
      isVerified: profile?.isVerified || false,
    });
  } catch (error) {
    console.error("Error checking mentor status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
