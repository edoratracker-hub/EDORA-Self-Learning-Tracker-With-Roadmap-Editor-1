import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema";

export const message = pgTable("message", {
    id: text("id").primaryKey(),
    senderId: text("sender_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    receiverId: text("receiver_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at").defaultNow(),
});

export const messageRelations = relations(message, ({ one }) => ({
    sender: one(user, {
        fields: [message.senderId],
        references: [user.id],
        relationName: "sentMessages",
    }),
    receiver: one(user, {
        fields: [message.receiverId],
        references: [user.id],
        relationName: "receivedMessages",
    }),
}));
