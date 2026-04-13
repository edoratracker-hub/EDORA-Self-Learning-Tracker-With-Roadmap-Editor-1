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

export const mentorProfile = pgTable("mentor_profile", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .references(() => user.id, { onDelete: "cascade" })
        .notNull()
        .unique(),

    // ===== BASIC INFORMATION (Same level as student) =====
    fullName: text("full_name").notNull(),
    email: text("email"),
    phone: text("phone"),
    profileImage: text("profile_image"),
    location: text("location"),
    bio: text("bio"),

    // ===== PROFESSIONAL BACKGROUND (Beyond student level) =====
    title: text("title"), // e.g., "Senior Software Engineer"
    company: text("company"),
    industry: text("industry"), // e.g., "Technology", "Finance", "Healthcare"
    yearsOfExperience: integer("years_of_experience"),
    currentRole: text("current_role"),
    previousRoles: jsonb("previous_roles").$type<string[]>(),

    // ===== EDUCATION & QUALIFICATIONS =====
    highestDegree: text("highest_degree"), // e.g., "PhD", "Master's", "Bachelor's"
    university: text("university"),
    fieldOfStudy: text("field_of_study"),
    certifications: jsonb("certifications").$type<string[]>(),

    // ===== EXPERTISE & SKILLS (Professional) =====
    expertise: jsonb("expertise").$type<string[]>(), // Core expertise areas
    technicalSkills: jsonb("technical_skills").$type<string[]>(),
    softSkills: jsonb("soft_skills").$type<string[]>(),
    toolsAndTechnologies: jsonb("tools_and_technologies").$type<string[]>(),

    // ===== MENTORSHIP DETAILS (Mentor-specific) =====
    mentorshipTopics: jsonb("mentorship_topics").$type<string[]>(),
    mentorshipStyle: text("mentorship_style"), // "hands-on", "advisory", "coaching", "career-guidance"
    preferredMenteeLevel: text("preferred_mentee_level"), // "beginner", "intermediate", "advanced", "any"
    maxMentees: integer("max_mentees"),
    sessionDurationMinutes: integer("session_duration_minutes"),
    availability: jsonb("availability"), // { "Monday": ["10:00-12:00"], ... }
    hourlyRate: integer("hourly_rate"),
    currency: text("currency").default("INR"),
    isFreeForStudents: boolean("is_free_for_students").default(true),

    // ===== PROFESSIONAL LINKS =====
    linkedinUrl: text("linkedin_url"),
    websiteUrl: text("website_url"),
    githubUrl: text("github_url"),
    twitterUrl: text("twitter_url"),
    portfolioUrl: text("portfolio_url"),

    // ===== MOTIVATION & GOALS =====
    whyMentor: text("why_mentor"), // Why do you want to be a mentor?
    mentorshipGoals: text("mentorship_goals"), // What do you hope to achieve?
    successStory: text("success_story"), // A success story from mentoring
    teachingApproach: text("teaching_approach"), // How do you approach teaching?

    // ===== VERIFICATION & STATUS =====
    verificationStatus: text("verification_status").default("pending"), // "pending", "submitted", "verified", "rejected"
    verificationToken: text("verification_token"),
    verificationSubmittedAt: timestamp("verification_submitted_at"),
    verifiedAt: timestamp("verified_at"),
    rejectionReason: text("rejection_reason"),
    isVerified: boolean("is_verified").default(false),
    professionalQuestionsCompleted: boolean("professional_questions_completed").default(false),

    // ===== ANALYTICS =====
    rating: integer("rating").default(0),
    reviewCount: integer("review_count").default(0),
    totalSessions: integer("total_sessions").default(0),

    // ===== METADATA =====
    initialSetupCompleted: boolean("initial_setup_completed").default(false),
    onboardingCompleted: boolean("onboarding_completed").default(false),
    completionPercentage: integer("completion_percentage").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const mentorProfileRelations = relations(mentorProfile, ({ one }) => ({
    user: one(user, {
        fields: [mentorProfile.userId],
        references: [user.id],
    }),
}));
