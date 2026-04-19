"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "@/drizzle/db";
import {
    classrooms,
    classroomMembers,
    classroomMessages,
    notifications,
    user,
} from "@/drizzle/schema";
import { eq, and, ne, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ── Create a new classroom ─────────────────────────────────────────────
export async function createClassroom(data: {
    name: string;
    subject: string;
    description?: string;
    color?: string;
}) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return { success: false, error: "Unauthorized" };

        const id = crypto.randomUUID();

        await db.insert(classrooms).values({
            id,
            name: data.name,
            subject: data.subject,
            description: data.description ?? null,
            headId: session.user.id,
            color: data.color ?? "blue",
            memberCount: 1,
        });

        // Add the creator as the classroom head
        await db.insert(classroomMembers).values({
            id: crypto.randomUUID(),
            classroomId: id,
            userId: session.user.id,
            role: "head",
        });

        revalidatePath("/dashboard/students/classroom");
        return { success: true, classroomId: id };
    } catch (error: any) {
        console.error("createClassroom error:", error);
        return { success: false, error: error.message };
    }
}

// ── Get classrooms for the current student ────────────────────────────
export async function getMyClassrooms() {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return { success: false, classrooms: [] };

        // All classrooms where the user is a member
        const rows = await db
            .select({
                id: classrooms.id,
                name: classrooms.name,
                subject: classrooms.subject,
                description: classrooms.description,
                color: classrooms.color,
                memberCount: classrooms.memberCount,
                createdAt: classrooms.createdAt,
                headId: classrooms.headId,
                headName: user.name,
                headImage: user.image,
                role: classroomMembers.role,
            })
            .from(classroomMembers)
            .innerJoin(classrooms, eq(classroomMembers.classroomId, classrooms.id))
            .innerJoin(user, eq(classrooms.headId, user.id))
            .where(eq(classroomMembers.userId, session.user.id));

        return { success: true, classrooms: rows };
    } catch (error: any) {
        console.error("getMyClassrooms error:", error);
        return { success: false, classrooms: [] };
    }
}

// ── Get a single classroom by ID ───────────────────────────────────────
export async function getClassroom(classroomId: string) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return { success: false, classroom: null };

        const rows = await db
            .select({
                id: classrooms.id,
                name: classrooms.name,
                subject: classrooms.subject,
                description: classrooms.description,
                color: classrooms.color,
                memberCount: classrooms.memberCount,
                headId: classrooms.headId,
                createdAt: classrooms.createdAt,
                content: classrooms.content,
                headName: user.name,
                headImage: user.image,
            })
            .from(classrooms)
            .innerJoin(user, eq(classrooms.headId, user.id))
            .where(eq(classrooms.id, classroomId))
            .limit(1);

        if (!rows.length) return { success: false, classroom: null };

        // Verify membership
        const member = await db.query.classroomMembers.findFirst({
            where: and(
                eq(classroomMembers.classroomId, classroomId),
                eq(classroomMembers.userId, session.user.id)
            ),
        });

        return { success: true, classroom: rows[0], isMember: !!member };
    } catch (error: any) {
        console.error("getClassroom error:", error);
        return { success: false, classroom: null };
    }
}

// ── Get classroom members ──────────────────────────────────────────────
export async function getClassroomMembers(classroomId: string) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return { success: false, members: [] };

        const members = await db
            .select({
                id: classroomMembers.id,
                userId: classroomMembers.userId,
                role: classroomMembers.role,
                joinedAt: classroomMembers.joinedAt,
                name: user.name,
                email: user.email,
                image: user.image,
            })
            .from(classroomMembers)
            .innerJoin(user, eq(classroomMembers.userId, user.id))
            .where(eq(classroomMembers.classroomId, classroomId));

        return { success: true, members };
    } catch (error: any) {
        console.error("getClassroomMembers error:", error);
        return { success: false, members: [] };
    }
}

// ── Add a student to a classroom ──────────────────────────────────────
export async function addStudentToClassroom(classroomId: string, targetUserId: string) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return { success: false, error: "Unauthorized" };

        // Verify that the current user is the head of the classroom
        const classroom = await db.query.classrooms.findFirst({
            where: and(
                eq(classrooms.id, classroomId),
                eq(classrooms.headId, session.user.id)
            ),
        });
        if (!classroom) return { success: false, error: "Classroom not found or you are not the head." };

        // Check if already a member
        const existing = await db.query.classroomMembers.findFirst({
            where: and(
                eq(classroomMembers.classroomId, classroomId),
                eq(classroomMembers.userId, targetUserId)
            ),
        });
        if (existing) return { success: false, error: "User is already a member." };

        // Get target user's role to determine classroom role
        const targetUser = await db.query.user.findFirst({
            where: eq(user.id, targetUserId)
        });

        if (!targetUser) return { success: false, error: "User not found" };

        const classroomRole = (targetUser.role === "mentor" || targetUser.role === "professional") ? "mentor" : "student";

        await db.insert(classroomMembers).values({
            id: crypto.randomUUID(),
            classroomId,
            userId: targetUserId,
            role: classroomRole,
        });

        // Increment member count
        await db
            .update(classrooms)
            .set({ memberCount: classroom.memberCount + 1 })
            .where(eq(classrooms.id, classroomId));

        // Send notification to the invited student
        await db.insert(notifications).values({
            id: crypto.randomUUID(),
            userId: targetUserId,
            fromUserId: session.user.id,
            type: "classroom_invite",
            title: "Classroom Invitation",
            message: `${session.user.name || session.user.email} added you to the classroom "${classroom.name}"`,
            read: false,
            metadata: JSON.stringify({ classroomId, classroomName: classroom.name }),
        });

        revalidatePath(`/dashboard/students/classroom/${classroomId}`);
        return { success: true };
    } catch (error: any) {
        console.error("addStudentToClassroom error:", error);
        return { success: false, error: error.message };
    }
}

export async function updateClassroomContent(classroomId: string, content: any) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return { success: false, error: "Unauthorized" };

        await db
            .update(classrooms)
            .set({ content, updatedAt: new Date() })
            .where(eq(classrooms.id, classroomId));

        return { success: true };
    } catch (error: any) {
        console.error("updateClassroomContent error:", error);
        return { success: false, error: error.message };
    }
}


// ── Search students (role = "student") ────────────────────────────────
export async function searchStudents(query: string) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return { success: false, users: [] };

        const results = await db
            .select({ id: user.id, name: user.name, email: user.email, image: user.image, role: user.role })
            .from(user)
            .where(
                and(
                    ne(user.id, session.user.id),
                    eq(user.role, "student"),
                    or(
                        ilike(user.name, `%${query}%`),
                        ilike(user.email, `%${query}%`)
                    )
                )
            )
            .limit(20);

        return { success: true, users: results };
    } catch (error: any) {
        console.error("searchStudents error:", error);
        return { success: false, users: [] };
    }
}

// ── Generate a shareable invite link ─────────────────────────────────
export async function getClassroomInviteLink(classroomId: string) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    return `${baseUrl}/join/classroom/${classroomId}`;
}

// ── Chat Messages ────────────────────────────────────────────────────
export async function sendClassroomMessage(classroomId: string, text: string) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return { success: false, error: "Unauthorized" };

        const id = crypto.randomUUID();
        await db.insert(classroomMessages).values({
            id,
            classroomId,
            senderId: session.user.id,
            text,
        });

        return { success: true };
    } catch (error: any) {
        console.error("sendClassroomMessage error:", error);
        return { success: false, error: error.message };
    }
}

export async function getClassroomMessages(classroomId: string) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return { success: false, messages: [] };

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
            isOwn: m.senderId === session.user.id,
        }));

        return { success: true, messages };
    } catch (error: any) {
        console.error("getClassroomMessages error:", error);
        return { success: false, messages: [] };
    }
}

// ── Delete a classroom ────────────────────────────────────────────────
export async function deleteClassroom(classroomId: string) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return { success: false, error: "Unauthorized" };

        const classroom = await db.query.classrooms.findFirst({
            where: and(eq(classrooms.id, classroomId), eq(classrooms.headId, session.user.id)),
        });

        if (!classroom) return { success: false, error: "Classroom not found or unauthorized" };

        await db.delete(classroomMembers).where(eq(classroomMembers.classroomId, classroomId));
        await db.delete(classroomMessages).where(eq(classroomMessages.classroomId, classroomId));
        await db.delete(classrooms).where(eq(classrooms.id, classroomId));

        revalidatePath("/dashboard/students/classroom");
        return { success: true };
    } catch (error: any) {
        console.error("deleteClassroom error:", error);
        return { success: false, error: error.message };
    }
}
