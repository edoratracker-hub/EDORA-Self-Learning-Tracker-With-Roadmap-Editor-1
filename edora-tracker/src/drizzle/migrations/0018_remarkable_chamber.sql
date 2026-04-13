ALTER TABLE "student_profile" ADD COLUMN "points" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "student_profile" ADD COLUMN "streak" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "student_profile" ADD COLUMN "previous_rank" integer DEFAULT 0 NOT NULL;