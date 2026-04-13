import { db } from "@/drizzle/db";
import { workspaceFiles } from "@/drizzle/schema";
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

        const file = await db.query.workspaceFiles.findFirst({
            where: eq(workspaceFiles.id, id),
            columns: {
                content: true,
                name: true,
            }
        });

        if (!file) {
            return NextResponse.json({ error: "File not found" }, { status: 404, headers: corsHeaders });
        }

        return NextResponse.json({ success: true, file }, { headers: corsHeaders });
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
            .update(workspaceFiles)
            .set({ content, updatedAt: new Date() })
            .where(eq(workspaceFiles.id, id));

        return NextResponse.json({ success: true }, { headers: corsHeaders });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
}
