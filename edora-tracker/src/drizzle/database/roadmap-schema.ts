import {
    pgTable,
    text,
    timestamp,
    uuid,
    integer,
    boolean,
    jsonb,
} from "drizzle-orm/pg-core";
import { userRoleEnum } from "./enum-schema";
import { user } from "./auth-schema";

import { relations } from "drizzle-orm";

export const roadmaps = pgTable("roadmaps", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    role: userRoleEnum("role").notNull(),
    goal: text("goal").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const milestones = pgTable("milestones", {
    id: uuid("id").primaryKey().defaultRandom(),
    roadmapId: uuid("roadmap_id").references(() => roadmaps.id, { onDelete: "cascade" }),
    category: text("category").notNull(), // academic, skills, career
    title: text("title").notNull(),
    description: text("description").notNull(),
    status: text("status").notNull(), // completed, in-progress, upcoming
    date: text("date").notNull(),
    progress: integer("progress").default(0),
    videoId: text("video_id"),
    order: integer("order").notNull(),
});

export const milestoneTasks = pgTable("milestone_tasks", {
    id: uuid("id").primaryKey().defaultRandom(),
    milestoneId: uuid("milestone_id").references(() => milestones.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    completed: boolean("completed").default(false),
});

export const exams = pgTable("exams", {
    id: uuid("id").primaryKey().defaultRandom(),
    milestoneId: uuid("milestone_id").references(() => milestones.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    pointsPossible: integer("points_possible").default(100),
});

export const examQuestions = pgTable("exam_questions", {
    id: uuid("id").primaryKey().defaultRandom(),
    examId: uuid("exam_id").references(() => exams.id, { onDelete: "cascade" }),
    questionText: text("question_text").notNull(),
    options: jsonb("options").notNull(), // string array
    correctAnswer: text("correct_answer").notNull(),
});

export const examAttempts = pgTable("exam_attempts", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    examId: uuid("exam_id").references(() => exams.id, { onDelete: "cascade" }),
    score: integer("score").notNull(),
    answers: jsonb("answers").notNull(), // Array of user's selection
    completedAt: timestamp("completed_at").defaultNow().notNull(),
});

// Relations
export const roadmapRelations = relations(roadmaps, ({ many }) => ({
    milestones: many(milestones),
}));

export const milestoneRelations = relations(milestones, ({ one, many }) => ({
    roadmap: one(roadmaps, { fields: [milestones.roadmapId], references: [roadmaps.id] }),
    tasks: many(milestoneTasks),
    exam: one(exams, { fields: [milestones.id], references: [exams.milestoneId] }),
}));

export const milestoneTaskRelations = relations(milestoneTasks, ({ one }) => ({
    milestone: one(milestones, { fields: [milestoneTasks.milestoneId], references: [milestones.id] }),
}));

export const examRelations = relations(exams, ({ one, many }) => ({
    milestone: one(milestones, { fields: [exams.milestoneId], references: [milestones.id] }),
    questions: many(examQuestions),
}));

export const examQuestionRelations = relations(examQuestions, ({ one }) => ({
    exam: one(exams, { fields: [examQuestions.examId], references: [exams.id] }),
}));
