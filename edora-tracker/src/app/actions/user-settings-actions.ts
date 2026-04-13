"use server";

import { auth } from "@/app/lib/auth";
import { db } from "@/drizzle/db";
import { user } from "@/drizzle/database/auth-schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function updateUserSettings(settings: any) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        await db.update(user)
            .set({
                settings: settings,
                updatedAt: new Date()
            })
            .where(eq(user.id, session.user.id));

        return { success: true };
    } catch (error) {
        console.error("Failed to update user settings:", error);
        return { success: false, error: "Failed to update settings" };
    }
}
