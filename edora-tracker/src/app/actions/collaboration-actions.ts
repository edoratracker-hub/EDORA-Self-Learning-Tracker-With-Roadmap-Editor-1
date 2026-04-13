"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "@/drizzle/db";
import { fileCollaborators, notifications, user, workspaceFiles, workspaces } from "@/drizzle/schema";
import { eq, ilike, and, ne, or } from "drizzle-orm";

// ── Get all files shared with the current user (accepted collabs) ─────
export async function getSharedFiles() {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return { success: false, files: [] };

        // Get files where current user is an accepted collaborator
        const shared = await db
            .select({
                id: workspaceFiles.id,
                name: workspaceFiles.name,
                type: workspaceFiles.type,
                template: workspaceFiles.template,
                updatedAt: workspaceFiles.updatedAt,
                folderId: workspaceFiles.folderId,
                workspaceId: workspaceFiles.workspaceId,
                ownerName: user.name,
                ownerImage: user.image,
                ownerEmail: user.email,
            })
            .from(fileCollaborators)
            .innerJoin(workspaceFiles, eq(fileCollaborators.fileId, workspaceFiles.id))
            .innerJoin(workspaces, eq(workspaceFiles.workspaceId, workspaces.id))
            .innerJoin(user, eq(workspaces.userId, user.id))
            .where(
                and(
                    eq(fileCollaborators.userId, session.user.id),
                    eq(fileCollaborators.status, "accepted")
                )
            );

        return { success: true, files: shared };
    } catch (error: any) {
        console.error("getSharedFiles error:", error);
        return { success: false, files: [] };
    }
}

// ── Get all users (searchable) ────────────────────────────────────────
export async function searchUsers(query: string) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return { success: false, users: [] };

        const results = await db
            .select({ id: user.id, name: user.name, email: user.email, image: user.image, role: user.role })
            .from(user)
            .where(
                and(
                    ne(user.id, session.user.id), // exclude self
                    or(
                        ilike(user.name, `%${query}%`),
                        ilike(user.email, `%${query}%`)
                    )
                )
            )
            .limit(20);

        return { success: true, users: results };
    } catch (error: any) {
        console.error("searchUsers error:", error);
        return { success: false, users: [] };
    }
}

// ── Invite a user to collaborate on a file ────────────────────────────
export async function inviteCollaborator(fileId: string, targetUserId: string) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return { success: false, error: "Unauthorized" };

        const file = await db.query.workspaceFiles.findFirst({
            where: eq(workspaceFiles.id, fileId),
        });
        if (!file) return { success: false, error: "File not found" };

        // Check if already invited
        const existing = await db.query.fileCollaborators.findFirst({
            where: and(
                eq(fileCollaborators.fileId, fileId),
                eq(fileCollaborators.userId, targetUserId)
            ),
        });
        if (existing) return { success: false, error: "User already invited" };

        const collabId = crypto.randomUUID();
        await db.insert(fileCollaborators).values({
            id: collabId,
            fileId,
            userId: targetUserId,
            invitedBy: session.user.id,
            status: "pending",
        });

        // Create notification for the target user
        const notifId = crypto.randomUUID();
        await db.insert(notifications).values({
            id: notifId,
            userId: targetUserId,
            fromUserId: session.user.id,
            type: "collab_invite",
            title: "Collaboration Invite",
            message: `${session.user.name || session.user.email} invited you to collaborate on "${file.name}"`,
            read: false,
            metadata: JSON.stringify({ fileId, collaboratorId: collabId, fileName: file.name }),
        });

        return { success: true, collaboratorId: collabId };
    } catch (error: any) {
        console.error("inviteCollaborator error:", error);
        return { success: false, error: error.message };
    }
}

// ── Accept or decline a collaboration invite ──────────────────────────
export async function respondToInvite(collaboratorId: string, accept: boolean) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return { success: false, error: "Unauthorized" };

        await db
            .update(fileCollaborators)
            .set({
                status: accept ? "accepted" : "declined",
                acceptedAt: accept ? new Date() : undefined,
            })
            .where(
                and(
                    eq(fileCollaborators.id, collaboratorId),
                    eq(fileCollaborators.userId, session.user.id)
                )
            );

        return { success: true };
    } catch (error: any) {
        console.error("respondToInvite error:", error);
        return { success: false, error: error.message };
    }
}

// ── Get active collaborators for a file ──────────────────────────────
export async function getFileCollaborators(fileId: string) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return { success: false, collaborators: [] };

        const collabs = await db
            .select({
                id: fileCollaborators.id,
                status: fileCollaborators.status,
                userId: fileCollaborators.userId,
                name: user.name,
                email: user.email,
                image: user.image,
            })
            .from(fileCollaborators)
            .leftJoin(user, eq(fileCollaborators.userId, user.id))
            .where(eq(fileCollaborators.fileId, fileId));

        return { success: true, collaborators: collabs };
    } catch (error: any) {
        console.error("getFileCollaborators error:", error);
        return { success: false, collaborators: [] };
    }
}

// ── Get notifications for the current user ─────────────────────────
export async function getNotifications() {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return { success: false, notifications: [] };

        const notifs = await db
            .select({
                id: notifications.id,
                type: notifications.type,
                title: notifications.title,
                message: notifications.message,
                read: notifications.read,
                metadata: notifications.metadata,
                createdAt: notifications.createdAt,
                fromUserId: notifications.fromUserId,
                fromUserName: user.name,
                fromUserImage: user.image,
            })
            .from(notifications)
            .leftJoin(user, eq(notifications.fromUserId, user.id))
            .where(eq(notifications.userId, session.user.id))
            .orderBy(notifications.createdAt);

        return { success: true, notifications: notifs.reverse() };
    } catch (error: any) {
        console.error("getNotifications error:", error);
        return { success: false, notifications: [] };
    }
}

// ── Mark notification as read ─────────────────────────────────────
export async function markNotificationRead(notifId: string) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return { success: false };

        await db
            .update(notifications)
            .set({ read: true })
            .where(
                and(
                    eq(notifications.id, notifId),
                    eq(notifications.userId, session.user.id)
                )
            );

        return { success: true };
    } catch (error: any) {
        return { success: false };
    }
}

// ── Mark all notifications as read ───────────────────────────────────
export async function markAllNotificationsRead() {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return { success: false };

        await db
            .update(notifications)
            .set({ read: true })
            .where(eq(notifications.userId, session.user.id));

        return { success: true };
    } catch (error: any) {
        return { success: false };
    }
}
