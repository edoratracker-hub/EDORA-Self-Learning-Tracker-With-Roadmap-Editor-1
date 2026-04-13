"use server"

import { auth } from "@/app/lib/auth"
import { headers } from "next/headers"
import { db } from "@/drizzle/db"
import { user } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

export async function checkUserStatus(email: string, role?: string) {
    try {
        let existingUser = await db.query.user.findFirst({
            where: eq(user.email, email)
        })

        if (!existingUser) {
            if (!role) {
                return {
                    success: false,
                    requiresRole: true,
                }
            }

            const [newUser] = await db.insert(user).values({
                id: crypto.randomUUID(),
                email: email,
                name: email.split('@')[0],
                role: (role as any),
                emailVerified: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            }).returning();

            // Send welcome email and system message
            try {
                const { sendWelcomeEmail, sendSystemInboxMessage, createNotification } = await import("@/app/lib/notification-service");
                const userName = newUser.name || newUser.email.split('@')[0];
                await sendWelcomeEmail(newUser.email, userName);
                await sendSystemInboxMessage(newUser.id, `Welcome to Edora Tracker, ${userName}! We're thrilled to have you join our community.`);
                await createNotification({
                    userId: newUser.id,
                    type: "welcome",
                    title: "Welcome to Edora! 🎉",
                    message: `Welcome to Edora Tracker, ${userName}! We're thrilled to have you join our community. Start exploring your dashboard, set up your goals, and begin your learning journey.`,
                });
            } catch (notifyError) {
                console.error("Error sending welcome notifications:", notifyError);
            }

            existingUser = newUser;
        }


        return {
            success: true,
            role: existingUser.role,
        }
    } catch (error: any) {
        console.error("Error in checkUserStatus:", error);
        return {
            error: error.message || "Error checking user status",
        }
    }
}

export async function updateUserRole(role: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return { error: "Not authenticated" };
        }

        await db.update(user)
            .set({ role: role as any })
            .where(eq(user.id, session.user.id));

        return { success: true };
    } catch (error: any) {
        console.error("Error updating user role:", error);
        return { error: "Failed to update role" };
    }
}
