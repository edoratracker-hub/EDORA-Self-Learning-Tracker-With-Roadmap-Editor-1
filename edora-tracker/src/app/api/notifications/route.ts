import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// In-memory map of userId → SSE controller
// Works for single-instance deployments (Vercel serverless uses per-request isolation,
// so this acts like a polling SSE — clients reconnect every 30s)
const clients = new Map<string, ReadableStreamDefaultController>();

export function GET() {
    // This is a placeholder route to keep the fetch polling approach simple.
    // Real SSE with Next.js App Router:
    return new Response("SSE stream not supported in this deployment.\nUse polling instead.", {
        headers: { "Content-Type": "text/plain" }
    });
}

// Utility to push a notification to a connected user (call from server actions)
export function pushNotificationToUser(_userId: string, _data: object) {
    // No-op in edge/serverless. Clients poll via /api/notifications/poll instead.
}
