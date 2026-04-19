import { pgTable, text, timestamp, integer, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema";

export const classroomMemberRoleEnum = pgEnum("classroom_member_role", [
    "head",
    "student",
    "mentor",
]);

export const classrooms = pgTable("classrooms", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    subject: text("subject").notNull(),
    description: text("description"),
    headId: text("head_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    color: text("color").notNull().default("blue"),
    memberCount: integer("member_count").notNull().default(1),
    content: jsonb("content"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const classroomMembers = pgTable("classroom_members", {
    id: text("id").primaryKey(),
    classroomId: text("classroom_id")
        .notNull()
        .references(() => classrooms.id, { onDelete: "cascade" }),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    role: classroomMemberRoleEnum("role").notNull().default("student"),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// Relations
export const classroomsRelations = relations(classrooms, ({ one, many }) => ({
    head: one(user, {
        fields: [classrooms.headId],
        references: [user.id],
    }),
    members: many(classroomMembers),
}));

export const classroomMembersRelations = relations(classroomMembers, ({ one }) => ({
    classroom: one(classrooms, {
        fields: [classroomMembers.classroomId],
        references: [classrooms.id],
    }),
    user: one(user, {
        fields: [classroomMembers.userId],
        references: [user.id],
    }),
}));

export const classroomMessages = pgTable("classroom_messages", {
    id: text("id").primaryKey(),
    classroomId: text("classroom_id")
        .notNull()
        .references(() => classrooms.id, { onDelete: "cascade" }),
    senderId: text("sender_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    text: text("text").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const classroomMessagesRelations = relations(classroomMessages, ({ one }) => ({
    classroom: one(classrooms, {
        fields: [classroomMessages.classroomId],
        references: [classrooms.id],
    }),
    sender: one(user, {
        fields: [classroomMessages.senderId],
        references: [user.id],
    }),
}));
