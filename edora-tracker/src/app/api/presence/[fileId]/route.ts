import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

// In-memory presence store: fileId → Map<userId, { name, image, lastSeen }>
// Works for single-instance Node.js dev server. For production/serverless, swap with Redis.
const presenceStore = new Map<string, Map<string, { name: string; image: string | null; email: string; lastSeen: number }>>();

const STALE_MS = 20_000; // 20 seconds without heartbeat = user considered gone

function getFilePresence(fileId: string): Array<{ userId: string; name: string; image: string | null; email: string }> {
    const map = presenceStore.get(fileId);
    if (!map) return [];
    const now = Date.now();
    const active: Array<{ userId: string; name: string; image: string | null; email: string }> = [];
    for (const [userId, data] of map.entries()) {
        if (now - data.lastSeen < STALE_MS) {
            active.push({ userId, name: data.name, image: data.image, email: data.email });
        } else {
            map.delete(userId);
        }
    }
    return active;
}

// GET /api/presence/[fileId] — return active users as JSON (polled every 10s)
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ fileId: string }> }
) {
    const { fileId } = await params;
    const active = getFilePresence(fileId);
    return NextResponse.json({ users: active });
}

// POST /api/presence/[fileId] — heartbeat: register/refresh current user
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ fileId: string }> }
) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return NextResponse.json({ ok: false }, { status: 401 });

        const { fileId } = await params;

        if (!presenceStore.has(fileId)) {
            presenceStore.set(fileId, new Map());
        }
        const fileMap = presenceStore.get(fileId)!;
        fileMap.set(session.user.id, {
            name: session.user.name ?? "Unknown",
            image: session.user.image ?? null,
            email: session.user.email ?? "",
            lastSeen: Date.now(),
        });

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}

// DELETE /api/presence/[fileId] — user left the file
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ fileId: string }> }
) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return NextResponse.json({ ok: false }, { status: 401 });

        const { fileId } = await params;
        presenceStore.get(fileId)?.delete(session.user.id);

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
