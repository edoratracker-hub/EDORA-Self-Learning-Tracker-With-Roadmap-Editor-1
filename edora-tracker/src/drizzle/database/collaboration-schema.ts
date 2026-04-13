import { pgTable, text, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema";
import { workspaceFiles } from "./workspace-schema";

export const collaborationStatusEnum = pgEnum("collaboration_status", [
    "pending",
    "accepted",
    "declined",
]);

export const fileCollaborators = pgTable("file_collaborators", {
    id: text("id").primaryKey(),
    fileId: text("file_id")
        .notNull()
        .references(() => workspaceFiles.id, { onDelete: "cascade" }),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    invitedBy: text("invited_by")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    status: collaborationStatusEnum("status").default("pending").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    acceptedAt: timestamp("accepted_at"),
});

export const notifications = pgTable("notifications", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    fromUserId: text("from_user_id").references(() => user.id, {
        onDelete: "set null",
    }),
    type: text("type").notNull(), // "collab_invite" | "general"
    title: text("title").notNull(),
    message: text("message").notNull(),
    read: boolean("read").default(false).notNull(),
    metadata: text("metadata"), // JSON string for extra data (fileId, collaboratorId etc.)
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const fileCollaboratorsRelations = relations(
    fileCollaborators,
    ({ one }) => ({
        file: one(workspaceFiles, {
            fields: [fileCollaborators.fileId],
            references: [workspaceFiles.id],
        }),
        user: one(user, {
            fields: [fileCollaborators.userId],
            references: [user.id],
            relationName: "collaborator",
        }),
        inviter: one(user, {
            fields: [fileCollaborators.invitedBy],
            references: [user.id],
            relationName: "inviter",
        }),
    })
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
    user: one(user, {
        fields: [notifications.userId],
        references: [user.id],
    }),
    fromUser: one(user, {
        fields: [notifications.fromUserId],
        references: [user.id],
        relationName: "notif_sender",
    }),
}));
