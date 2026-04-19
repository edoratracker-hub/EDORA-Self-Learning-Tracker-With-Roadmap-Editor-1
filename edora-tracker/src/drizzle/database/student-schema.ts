import {
  pgTable,
  text,
  timestamp,
  jsonb,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema";

export const studentProfile = pgTable("student_profile", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull()
    .unique(),

  // Basic Information (Mandatory)
  name: text("name"),
  currentEducation: text("current_education"), // Class/Year/Course
  studyGoal: text("study_goal"), // What they need to study
  experienceLevel: text("experience_level"), // No experience, Internship, etc.

  // 1) Self-Discovery
  favoriteSubjects: jsonb("favorite_subjects").$type<string[]>(),
  topicsThatEngageYou: text("topics_that_engage_you"),
  learningPreference: text("learning_preference"), // theory, problem-solving, creativity, working with people
  workPreference: text("work_preference"), // alone or team
  hobbies: text("hobbies"),
  confidenceActivities: text("confidence_activities"),

  // 2) Strength & Weakness Mapping
  goodAtSubjects: jsonb("good_at_subjects").$type<string[]>(),
  struggleWithSubjects: jsonb("struggle_with_subjects").$type<string[]>(),
  learningStyle: text("learning_style"), // reading, watching, doing
  communicationSkills: text("communication_skills"), // good/average/needs improvement
  thinkingStyle: text("thinking_style"), // logical thinking or memorization

  // 3) Exposure & Career Awareness
  knownCareers: jsonb("known_careers").$type<string[]>(),
  careerSkillsKnowledge: text("career_skills_knowledge"),
  hasSpokenToProfessionals: boolean("has_spoken_to_professionals"),
  followsCareerContent: boolean("follows_career_content"),
  careerContentSources: text("career_content_sources"),

  // 4) Career Interest Identification
  dreamJob: text("dream_job"), // what they'd do even with low salary
  moneyMotivatedJob: text("money_motivated_job"),
  jobTypePreference: text("job_type_preference"), // government, private, business, freelancing
  fieldOfInterest: text("field_of_interest"), // IT, medical, commerce, arts, teaching, design, etc.
  workLocationPreference: text("work_location_preference"), // India or abroad

  // 5) Academic Status
  currentMarksOrCGPA: text("current_marks_or_cgpa"),
  preparingForExams: text("preparing_for_exams"),
  completedCertifications: jsonb("completed_certifications").$type<string[]>(),
  extraCourses: text("extra_courses"),

  // 6) Skill Status
  computerSkills: jsonb("computer_skills").$type<string[]>(),
  programmingLanguages: jsonb("programming_languages").$type<string[]>(),
  knowsProgramming: boolean("knows_programming"),
  knowsOfficeTools: boolean("knows_office_tools"),
  officeTools: jsonb("office_tools").$type<string[]>(),
  completedProjects: text("completed_projects"),
  hasPortfolio: boolean("has_portfolio"),
  portfolioLink: text("portfolio_link"),
  githubLink: text("github_link"),
  hasResume: boolean("has_resume"),
  resumeUrl: text("resume_url"),
  phoneNumber: text("phone_number"),
  address: text("address"),

  // 7) Time, Habits & Discipline
  dailyStudyHours: integer("daily_study_hours"),
  hasStudySchedule: boolean("has_study_schedule"),
  procrastinates: boolean("procrastinates"),
  mainDistractions: text("main_distractions"),

  // 8) Dream & Lifestyle Vision
  lifeVisionAt30: text("life_vision_at_30"),
  careerPriority: text("career_priority"), // high salary, work-life balance, passion-driven
  jobStabilityPreference: text("job_stability_preference"), // stable or high-growth

  // 9) Mindset Check
  readyForContinuousLearning: boolean("ready_for_continuous_learning"),
  failureHandling: text("failure_handling"),
  hasQuitLearning: boolean("has_quit_learning"),
  quitReason: text("quit_reason"),

  // Gamification / Leaderboard
  points: integer("points").default(0).notNull(),
  streak: integer("streak").default(0).notNull(),
  previousRank: integer("previous_rank").default(0).notNull(),

  // Metadata
  initialSetupCompleted: boolean("initial_setup_completed").default(false),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  completionPercentage: integer("completion_percentage").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const studentProfileRelations = relations(studentProfile, ({ one }) => ({
  user: one(user, {
    fields: [studentProfile.userId],
    references: [user.id],
  }),
}));

export const userActivity = pgTable("user_activity", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  type: text("type").notNull(), // 'todo_complete', 'roadmap_start', etc.
  description: text("description"),
  points: integer("points").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userActivityRelations = relations(userActivity, ({ one }) => ({
  user: one(user, {
    fields: [userActivity.userId],
    references: [user.id],
  }),
}));
