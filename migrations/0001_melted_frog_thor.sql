CREATE TABLE "email_verification_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"code" text NOT NULL,
	"verification_token" text,
	"expires_at" timestamp NOT NULL,
	"attempts" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"is_used" boolean DEFAULT false,
	CONSTRAINT "email_verification_codes_verification_token_unique" UNIQUE("verification_token")
);
--> statement-breakpoint
ALTER TABLE "email_verification_codes" ADD CONSTRAINT "email_verification_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;