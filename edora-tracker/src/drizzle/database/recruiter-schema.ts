import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  jsonb,
  boolean,
  integer,
  real,
  index,
  primaryKey,
  foreignKey,
  unique,
  check,
  date,
  pgEnum,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm";
import { user } from "./auth-schema";
import { appledJobEnum } from "./enum-schema";


export const recruiterOrganization = pgTable("recruiter_organization", {
  id: text("id").primaryKey(),
  companyName: text("companyName"),
  website: text("website"),
  phoneNumber: text("phone_number"),
  location: text("location"),
  companyLogo: text("company_logo"),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  verified: boolean("verified").default(false),
})

export const jobOpportunities = pgTable(
  "job_opportunities",
  {
    id: text("id").primaryKey(),

    recruiterId: text("recruiter_id")
      .references(() => user.id, { onDelete: "cascade" }),

    title: varchar("title", { length: 255 }).notNull(),
    company: text("company").references(() => recruiterOrganization.id, { onDelete: "cascade" }),

    description: text("description"),
    responsibilities: text("responsibilities"),
    benefits: text("benefits"),

    requiredSkills: jsonb("required_skills"),
    niceToHaveSkills: jsonb("nice_to_have_skills"),

    experienceMin: integer("experience_min"),
    experienceMax: integer("experience_max"),
    educationRequired: varchar("education_required", { length: 255 }),

    salaryMin: integer("salary_min"),
    salaryMax: integer("salary_max"),
    currency: varchar("currency", { length: 10 }).default("INR"),
    salaryType: varchar("salary_type", { length: 50 }),

    jobType: varchar("job_type", { length: 50 }),
    workMode: varchar("work_mode", { length: 50 }),

    location: varchar("location", { length: 255 }),
    country: varchar("country", { length: 100 }),

    applicationDeadline: timestamp("application_deadline"),
    status: varchar("status", { length: 50 }).default("open"),

    totalApplicants: integer("total_applicants").default(0),
    views: integer("views").default(0),

    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("idx_job_opportunities_recruiter_id").on(table.recruiterId),
  ]
);

export const appliedJobs = pgTable("applied_jobs", {
  id: text("id").primaryKey(),
  studentId: text("student_id").references(() => user.id, { onDelete: "cascade" }),
  jobAppliedId: text("job_applied_id").references(() => jobOpportunities.id, { onDelete: "cascade" }),
  status: appledJobEnum("status").default("applied"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const scheduledInterviews = pgTable("scheduled_interviews", {
  id: text("id").primaryKey(),
  studentId: text("student_id").references(() => user.id, { onDelete: "cascade" }),
  jobAppliedId: text("job_applied_id").references(() => jobOpportunities.id, { onDelete: "cascade" }),
  time: timestamp("time"),
  date: timestamp("date"),
  googleCalendarEventId: text("google_calendar_event_id"),
  meetingLink: text("meeting_link"),
  emailSent: boolean("email_sent").default(false),
  reminderSent: timestamp("reminder_sent"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const interviewRescheduleHistory = pgTable("interview_reschedule_history", {
  id: text("id").primaryKey(),
  interviewId: text("interview_id").references(() => scheduledInterviews.id, { onDelete: "cascade" }),
  oldDate: timestamp("old_date"),
  oldTime: timestamp("old_time"),
  newDate: timestamp("new_date"),
  newTime: timestamp("new_time"),
  reason: text("reason"),
  rescheduledBy: text("rescheduled_by").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const recruiterOrganizationRelations = relations(recruiterOrganization, ({ one, many }) => ({
  user: one(user, {
    fields: [recruiterOrganization.userId],
    references: [user.id],
  }),
  jobOpportunities: many(jobOpportunities),
}));

export const jobOpportunitiesRelations = relations(jobOpportunities, ({ one, many }) => ({
  recruiter: one(user, {
    fields: [jobOpportunities.recruiterId],
    references: [user.id],
  }),
  organization: one(recruiterOrganization, {
    fields: [jobOpportunities.company],
    references: [recruiterOrganization.id],
  }),
  applications: many(appliedJobs),
}));

export const appliedJobsRelations = relations(appliedJobs, ({ one }) => ({
  student: one(user, {
    fields: [appliedJobs.studentId],
    references: [user.id],
  }),
  job: one(jobOpportunities, {
    fields: [appliedJobs.jobAppliedId],
    references: [jobOpportunities.id],
  }),
}));

export const scheduledInterviewsRelations = relations(scheduledInterviews, ({ one, many }) => ({
  student: one(user, {
    fields: [scheduledInterviews.studentId],
    references: [user.id],
  }),
  job: one(jobOpportunities, {
    fields: [scheduledInterviews.jobAppliedId],
    references: [jobOpportunities.id],
  }),
  rescheduleHistory: many(interviewRescheduleHistory),
}));

export const interviewRescheduleHistoryRelations = relations(interviewRescheduleHistory, ({ one }) => ({
  interview: one(scheduledInterviews, {
    fields: [interviewRescheduleHistory.interviewId],
    references: [scheduledInterviews.id],
  }),
  rescheduler: one(user, {
    fields: [interviewRescheduleHistory.rescheduledBy],
    references: [user.id],
  }),
}));
