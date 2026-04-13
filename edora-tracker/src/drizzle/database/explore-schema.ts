import {
    pgTable,
    text,
    timestamp,
    jsonb,
    integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema";

export const explorePosts = pgTable("explore_posts", {
    id: text("id").primaryKey(),
    authorId: text("author_id")
        .references(() => user.id, { onDelete: "cascade" })
        .notNull(),
    content: text("content").notNull(),
    imageUrl: text("image_url"),
    tags: jsonb("tags").$type<string[]>().default([]),
    likes: integer("likes").default(0),
    comments: integer("comments").default(0),
    shares: integer("shares").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const explorePostsRelations = relations(explorePosts, ({ one }) => ({
    author: one(user, {
        fields: [explorePosts.authorId],
        references: [user.id],
    }),
}));
