"use server";

import { db } from "@/drizzle/db";
import { message } from "@/drizzle/database/message-schema";
import { user } from "@/drizzle/database/auth-schema"; // Assuming user table is here
import { eq, or, and, desc, asc, ne } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function sendMessage(senderId: string, receiverId: string, content: string) {
    try {
        await db.insert(message).values({
            id: nanoid(),
            senderId,
            receiverId, 
            content,
            createdAt: new Date(),
        });
        return { success: true };
    } catch (error) {
        console.error("Error sending message:", error);
        return { success: false, error: "Failed to send message" };
    }
}

export async function getMessages(userId: string, otherUserId: string) {
    try {
        const messages = await db.query.message.findMany({
            where: or(
                and(eq(message.senderId, userId), eq(message.receiverId, otherUserId)),
                and(eq(message.senderId, otherUserId), eq(message.receiverId, userId))
            ),
            orderBy: [asc(message.createdAt)],
            with: {
                sender: true,
            }
        });
        return { success: true, data: messages };
    } catch (error) {
        console.error("Error fetching messages:", error);
        return { success: false, error: "Failed to fetch messages" };
    }
}

export async function getConversations(userId: string) {
    try {
        // Get all unique users interacted with
        // This is a bit complex in pure Drizzle without raw SQL for 'DISTINCT', 
        // but we can fetch all messages involving the user and process in JS for now 
        // or use a more optimized query if performance matters later.

        // Fetch latest message for each conversation
        // For simplicity: fetch all messages where user is sender or receiver
        const messages = await db.query.message.findMany({
            where: or(
                eq(message.senderId, userId),
                eq(message.receiverId, userId)
            ),
            orderBy: [desc(message.createdAt)],
            with: {
                sender: true,
                receiver: true,
            }
        });

        const conversationsMap = new Map();

        messages.forEach(msg => {
            const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
            const otherUserId = otherUser.id;

            if (!conversationsMap.has(otherUserId)) {
                conversationsMap.set(otherUserId, {
                    user: otherUser,
                    lastMessage: msg,
                });
            }
        });

        return { success: true, data: Array.from(conversationsMap.values()) };
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return { success: false, error: "Failed to fetch conversations" };
    }
}
export async function getNotifications(userId: string) {
    try {
        const messages = await db.query.message.findMany({
            where: eq(message.receiverId, userId),
            orderBy: [desc(message.createdAt)],
            with: {
                sender: true,
            }
        });
        return { success: true, data: messages };
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return { success: false, error: "Failed to fetch notifications" };
    }
}
