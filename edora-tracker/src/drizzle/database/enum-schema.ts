import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "recruiter",
  "student",
  "mentor",
  "professional",
]);

export const appledJobEnum = pgEnum("applied_job_enum", [
  "applied",
  "accept",
  "reject",
  "scheduled",
  "rescheduled",
  "selected",
  "hired",
]);