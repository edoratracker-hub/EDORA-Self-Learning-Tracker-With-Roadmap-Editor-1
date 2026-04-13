"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "@/drizzle/db";
import { explorePosts } from "@/drizzle/schema";
import { eq, desc, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function createExplorePost(data: {
    content: string;
    imageUrl?: string;
    tags?: string[];
}) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return { success: false, error: "Unauthorized" };

        const id = nanoid();
        await db.insert(explorePosts).values({
            id,
            authorId: session.user.id,
            content: data.content,
            imageUrl: data.imageUrl || null,
            tags: data.tags || [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return { success: true, id };
    } catch (error: any) {
        console.error("Error creating post:", error);
        return { success: false, error: error.message || "Failed to create post" };
    }
}

export async function getExplorePosts() {
    try {
        const posts = await db.query.explorePosts.findMany({
            orderBy: [desc(explorePosts.createdAt)],
            with: {
                author: true,
            },
            limit: 50,
        });

        return { success: true, posts };
    } catch (error: any) {
        console.error("Error fetching posts:", error);
        return { success: false, error: error.message || "Failed to fetch posts", posts: [] };
    }
}

export async function likeExplorePost(postId: string) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return { success: false, error: "Unauthorized" };

        await db
            .update(explorePosts)
            .set({ likes: sql`${explorePosts.likes} + 1` })
            .where(eq(explorePosts.id, postId));

        return { success: true };
    } catch (error: any) {
        console.error("Error liking post:", error);
        return { success: false, error: error.message || "Failed to like post" };
    }
}
