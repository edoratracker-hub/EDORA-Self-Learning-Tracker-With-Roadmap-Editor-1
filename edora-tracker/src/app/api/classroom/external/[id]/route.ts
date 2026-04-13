import { db } from "@/drizzle/db";
import { classrooms } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// CORS headers to allow the external Novel editor to fetch/save
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return new NextResponse(null, { headers: corsHeaders });
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const classroom = await db.query.classrooms.findFirst({
            where: eq(classrooms.id, id),
            columns: {
                content: true,
                name: true,
            }
        });

        if (!classroom) {
            return NextResponse.json({ error: "Classroom not found" }, { status: 404, headers: corsHeaders });
        }

        return NextResponse.json({ success: true, classroom }, { headers: corsHeaders });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();

        const { content } = body;
        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400, headers: corsHeaders });
        }

        await db
            .update(classrooms)
            .set({ content, updatedAt: new Date() })
            .where(eq(classrooms.id, id));

        return NextResponse.json({ success: true }, { headers: corsHeaders });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
}
