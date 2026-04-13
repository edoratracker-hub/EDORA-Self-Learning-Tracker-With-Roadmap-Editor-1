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

export const professionalProfile = pgTable("professional_profile", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .references(() => user.id, { onDelete: "cascade" })
        .notNull()
        .unique(),

    // ===== BASIC INFORMATION =====
    fullName: text("full_name").notNull(),
    email: text("email"),
    phone: text("phone"),
    profileImage: text("profile_image"),
    location: text("location"),
    bio: text("bio"),

    // ===== PROFESSIONAL BACKGROUND =====
    title: text("title"),
    company: text("company"),
    industry: text("industry"),
    yearsOfExperience: integer("years_of_experience"),
    currentRole: text("current_role"),
    previousRoles: jsonb("previous_roles").$type<string[]>(),

    // ===== EDUCATION & QUALIFICATIONS =====
    highestDegree: text("highest_degree"),
    university: text("university"),
    fieldOfStudy: text("field_of_study"),
    certifications: jsonb("certifications").$type<string[]>(),

    // ===== EXPERTISE & SKILLS =====
    expertise: jsonb("expertise").$type<string[]>(),
    technicalSkills: jsonb("technical_skills").$type<string[]>(),
    softSkills: jsonb("soft_skills").$type<string[]>(),
    toolsAndTechnologies: jsonb("tools_and_technologies").$type<string[]>(),

    // ===== LINKS =====
    linkedinUrl: text("linkedin_url"),
    websiteUrl: text("website_url"),
    githubUrl: text("github_url"),
    portfolioUrl: text("portfolio_url"),

    // ===== MOTIVATION & GOALS =====
    whyJoin: text("why_join"),
    goals: text("goals"),

    // ===== VERIFICATION & STATUS =====
    verificationStatus: text("verification_status").default("pending"), // "pending", "submitted", "verified", "rejected"
    verificationToken: text("verification_token"),
    verificationSubmittedAt: timestamp("verification_submitted_at"),
    verifiedAt: timestamp("verified_at"),
    rejectionReason: text("rejection_reason"),
    isVerified: boolean("is_verified").default(false),
    professionalQuestionsCompleted: boolean("professional_questions_completed").default(false),
    // ===== METADATA =====
    initialSetupCompleted: boolean("initial_setup_completed").default(false),
    onboardingCompleted: boolean("onboarding_completed").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const professionalProfileRelations = relations(professionalProfile, ({ one }) => ({
    user: one(user, {
        fields: [professionalProfile.userId],
        references: [user.id],
    }),
}));
