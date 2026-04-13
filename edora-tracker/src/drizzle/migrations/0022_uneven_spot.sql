CREATE TYPE "public"."classroom_member_role" AS ENUM('head', 'student');--> statement-breakpoint
CREATE TABLE "classroom_members" (
	"id" text PRIMARY KEY NOT NULL,
	"classroom_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" "classroom_member_role" DEFAULT 'student' NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classrooms" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"subject" text NOT NULL,
	"description" text,
	"head_id" text NOT NULL,
	"color" text DEFAULT 'blue' NOT NULL,
	"member_count" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "classroom_members" ADD CONSTRAINT "classroom_members_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom_members" ADD CONSTRAINT "classroom_members_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_head_id_user_id_fk" FOREIGN KEY ("head_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;