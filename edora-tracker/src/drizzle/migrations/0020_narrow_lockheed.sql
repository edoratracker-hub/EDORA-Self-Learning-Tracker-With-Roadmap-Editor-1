CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" text,
	"payment_id" text,
	"user_id" text,
	"amount" integer,
	"status" text,
	"created_at" timestamp DEFAULT now()
);
