"use server";

import { db } from "@/drizzle/db";
import { user } from "@/drizzle/schema";
import { eq, inArray } from "drizzle-orm";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function isAdmin() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
        return false;
    }
    return true;
}

export async function getAllUsers() {
    if (!(await isAdmin())) {
        return { error: "Unauthorized", success: false };
    }

    try {
        const users = await db.select().from(user);
        return { data: users, success: true };
    } catch (error) {
        console.error("Error fetching users:", error);
        return { error: "Failed to fetch users", success: false };
    }
}

export async function deleteUser(userId: string) {
    if (!(await isAdmin())) {
        return { error: "Unauthorized", success: false };
    }

    try {
        await db.delete(user).where(eq(user.id, userId));
        revalidatePath("/dashboard/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Error deleting user:", error);
        return { error: "Failed to delete user", success: false };
    }
}

export async function deleteUsers(userIds: string[]) {
    if (!(await isAdmin())) {
        return { error: "Unauthorized", success: false };
    }

    try {
        await db.delete(user).where(inArray(user.id, userIds));
        revalidatePath("/dashboard/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Error deleting users:", error);
        return { error: "Failed to delete users", success: false };
    }
}

export async function updateUserRole(userId: string, role: "admin" | "recruiter" | "student" | "mentor" | "professional") {
    if (!(await isAdmin())) {
        return { error: "Unauthorized", success: false };
    }

    try {
        await db.update(user).set({ role }).where(eq(user.id, userId));
        revalidatePath("/dashboard/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Error updating user role:", error);
        return { error: "Failed to update user role", success: false };
    }
}
export async function getSystemLogs() {
    if (!(await isAdmin())) {
        return { error: "Unauthorized", success: false };
    }

    try {
        const logs = await db.query.session.findMany({
            with: {
                user: true
            },
            orderBy: (session, { desc }) => [desc(session.createdAt)]
        });
        return { data: logs, success: true };
    } catch (error) {
        console.error("Error fetching logs:", error);
        return { error: "Failed to fetch logs", success: false };
    }
}
