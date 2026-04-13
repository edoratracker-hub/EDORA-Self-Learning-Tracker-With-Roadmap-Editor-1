import { db } from "@/drizzle/db";
import { classroomMembers, classroomMessages } from "@/drizzle/database/classroom-schema";
import { user } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
    return new NextResponse(null, { headers: corsHeaders });
}

// GET /api/classroom/external/[id]/chat?userId=xxx — get messages (membership verified)
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: classroomId } = await params;
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400, headers: corsHeaders });
        }

        // Verify membership
        const member = await db.query.classroomMembers.findFirst({
            where: and(
                eq(classroomMembers.classroomId, classroomId),
                eq(classroomMembers.userId, userId)
            ),
        });

        if (!member) {
            return NextResponse.json({ error: "Not a classroom member" }, { status: 403, headers: corsHeaders });
        }

        // Fetch messages with sender info
        const rows = await db
            .select({
                id: classroomMessages.id,
                text: classroomMessages.text,
                createdAt: classroomMessages.createdAt,
                senderId: classroomMessages.senderId,
                senderName: user.name,
                senderImage: user.image,
            })
            .from(classroomMessages)
            .innerJoin(user, eq(classroomMessages.senderId, user.id))
            .where(eq(classroomMessages.classroomId, classroomId))
            .orderBy(classroomMessages.createdAt);

        const messages = rows.map((m) => ({
            id: m.id,
            sender: m.senderName || "Unknown",
            senderImage: m.senderImage,
            text: m.text,
            timestamp: m.createdAt,
            isOwn: m.senderId === userId,
        }));

        return NextResponse.json({ success: true, messages }, { headers: corsHeaders });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
}

// POST /api/classroom/external/[id]/chat — send message (membership verified)
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: classroomId } = await params;
        const { userId, text } = await req.json();

        if (!userId || !text?.trim()) {
            return NextResponse.json({ error: "userId and text are required" }, { status: 400, headers: corsHeaders });
        }

        // Verify membership
        const member = await db.query.classroomMembers.findFirst({
            where: and(
                eq(classroomMembers.classroomId, classroomId),
                eq(classroomMembers.userId, userId)
            ),
        });

        if (!member) {
            return NextResponse.json({ error: "Not a classroom member" }, { status: 403, headers: corsHeaders });
        }

        const id = crypto.randomUUID();
        await db.insert(classroomMessages).values({
            id,
            classroomId,
            senderId: userId,
            text: text.trim(),
        });

        return NextResponse.json({ success: true }, { headers: corsHeaders });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
}
