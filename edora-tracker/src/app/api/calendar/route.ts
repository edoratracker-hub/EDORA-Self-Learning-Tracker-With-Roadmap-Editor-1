import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "@/drizzle/db";
import { calendarEvents } from "@/drizzle/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (!start || !end) {
      return NextResponse.json({ error: "Missing start or end date" }, { status: 400 });
    }

    const events = await db.query.calendarEvents.findMany({
      where: and(
        eq(calendarEvents.userId, session.user.id),
        gte(calendarEvents.startTime, new Date(start)),
        lte(calendarEvents.startTime, new Date(end))
      ),
      orderBy: [calendarEvents.startTime],
    });

    return NextResponse.json({ success: true, events });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
