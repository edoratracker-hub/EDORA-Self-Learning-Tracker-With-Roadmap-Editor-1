
import {
    pgTable,
    text,
    timestamp,
    jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema";

export const workspaces = pgTable("workspaces", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    userId: text("user_id")
        .references(() => user.id, { onDelete: "cascade" })
        .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const workspaceFolders = pgTable("workspace_folders", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    workspaceId: text("workspace_id")
        .references(() => workspaces.id, { onDelete: "cascade" })
        .notNull(),
    parentId: text("parent_id"), // For nested folders if needed later
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const workspaceFiles = pgTable("workspace_files", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    folderId: text("folder_id")
        .references(() => workspaceFolders.id, { onDelete: "cascade" })
        .notNull(),
    workspaceId: text("workspace_id") // Denormalized for easier querying
        .references(() => workspaces.id, { onDelete: "cascade" })
        .notNull(),
    content: jsonb("content"), // Tiptap JSON content
    type: text("type").default("DOCUMENT"), // DOCUMENT
    template: text("template"), // To store which template was used: TODO, PROJECT_PLANNING, etc.
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

// Relations
export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
    user: one(user, {
        fields: [workspaces.userId],
        references: [user.id],
    }),
    folders: many(workspaceFolders),
    files: many(workspaceFiles),
}));

export const workspaceFoldersRelations = relations(workspaceFolders, ({ one, many }) => ({
    workspace: one(workspaces, {
        fields: [workspaceFolders.workspaceId],
        references: [workspaces.id],
    }),
    parent: one(workspaceFolders, {
        fields: [workspaceFolders.parentId],
        references: [workspaceFolders.id],
        relationName: "parent_of_folder",
    }),
    children: many(workspaceFolders, { relationName: "parent_of_folder" }),
    files: many(workspaceFiles),
}));

export const workspaceFilesRelations = relations(workspaceFiles, ({ one }) => ({
    folder: one(workspaceFolders, {
        fields: [workspaceFiles.folderId],
        references: [workspaceFolders.id],
    }),
    workspace: one(workspaces, {
        fields: [workspaceFiles.workspaceId],
        references: [workspaces.id],
    }),
}));
