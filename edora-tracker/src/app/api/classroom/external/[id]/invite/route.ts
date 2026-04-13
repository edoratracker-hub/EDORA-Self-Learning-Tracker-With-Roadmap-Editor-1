import { db } from "@/drizzle/db";
import { classrooms, classroomMembers, notifications } from "@/drizzle/schema";
import { user } from "@/drizzle/schema";
import { eq, and, ilike, inArray, or } from "drizzle-orm";
import { NextResponse } from "next/server";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
    return new NextResponse(null, { headers: corsHeaders });
}

// GET /api/classroom/external/[id]/invite?q=query — search students
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q") ?? "";

        if (q.trim().length < 2) {
            return NextResponse.json({ success: true, users: [] }, { headers: corsHeaders });
        }

        const results = await db
            .select({ id: user.id, name: user.name, email: user.email, image: user.image, role: user.role })
            .from(user)
            .where(
                and(
                    inArray(user.role, ["student", "mentor", "professional"]),
                    or(
                        ilike(user.name, `%${q}%`),
                        ilike(user.email, `%${q}%`)
                    )
                )
            )
            .limit(20);

        return NextResponse.json({ success: true, users: results }, { headers: corsHeaders });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
}

// POST /api/classroom/external/[id]/invite — add a student by userId
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: classroomId } = await params;
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400, headers: corsHeaders });
        }

        const classroom = await db.query.classrooms.findFirst({
            where: eq(classrooms.id, classroomId),
        });

        if (!classroom) {
            return NextResponse.json({ error: "Classroom not found" }, { status: 404, headers: corsHeaders });
        }

        // Check if already a member
        const existing = await db.query.classroomMembers.findFirst({
            where: and(
                eq(classroomMembers.classroomId, classroomId),
                eq(classroomMembers.userId, userId)
            ),
        });

        if (existing) {
            return NextResponse.json({ error: "User is already a member." }, { status: 409, headers: corsHeaders });
        }

        await db.insert(classroomMembers).values({
            id: crypto.randomUUID(),
            classroomId,
            userId,
            role: "student",
        });

        await db
            .update(classrooms)
            .set({ memberCount: classroom.memberCount + 1 })
            .where(eq(classrooms.id, classroomId));

        // Notify the invited student
        await db.insert(notifications).values({
            id: crypto.randomUUID(),
            userId,
            fromUserId: classroom.headId,
            type: "classroom_invite",
            title: "Classroom Invitation",
            message: `You were added to the classroom "${classroom.name}"`,
            read: false,
            metadata: JSON.stringify({ classroomId, classroomName: classroom.name }),
        });

        return NextResponse.json({ success: true }, { headers: corsHeaders });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
}
