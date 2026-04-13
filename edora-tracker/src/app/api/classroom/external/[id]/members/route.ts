import { db } from "@/drizzle/db";
import { classroomMembers } from "@/drizzle/database/classroom-schema";
import { user } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
    return new NextResponse(null, { headers: corsHeaders });
}

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const members = await db
            .select({
                id: classroomMembers.id,
                userId: classroomMembers.userId,
                role: classroomMembers.role,
                name: user.name,
                email: user.email,
                image: user.image,
            })
            .from(classroomMembers)
            .innerJoin(user, eq(classroomMembers.userId, user.id))
            .where(eq(classroomMembers.classroomId, id));

        return NextResponse.json({ success: true, members }, { headers: corsHeaders });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
}
