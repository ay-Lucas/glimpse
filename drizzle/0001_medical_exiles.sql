CREATE TABLE IF NOT EXISTS "episode_details" (
	"summary_id" integer NOT NULL,
	"season_number" integer NOT NULL,
	"episode_number" integer NOT NULL,
	"air_date" date,
	"name" text,
	"overview" text,
	"production_code" text,
	"runtime" integer,
	"still_path" text,
	"vote_average" double precision,
	"vote_count" integer,
	"crew" jsonb,
	"guest_stars" jsonb,
	CONSTRAINT "episode_details_summary_id_season_number_episode_number_pk" PRIMARY KEY("summary_id","season_number","episode_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "list_entries" (
	"list_name" text NOT NULL,
	"tmdb_id" integer NOT NULL,
	"media_type" text NOT NULL,
	"position" integer NOT NULL,
	"fetched_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "list_entries_list_name_tmdb_id_pk" PRIMARY KEY("list_name","tmdb_id"),
	CONSTRAINT "list_entries_position_unique" UNIQUE("list_name","position")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "movie_details" (
	"summary_id" integer PRIMARY KEY NOT NULL,
	"adult" boolean DEFAULT true NOT NULL,
	"video" boolean DEFAULT true NOT NULL,
	"backdrop_blur_data_url" text,
	"belongs_to_collection" text,
	"imdb_id" text,
	"original_language" text,
	"original_title" text,
	"origin_country" text[],
	"budget" bigint,
	"revenue" bigint,
	"runtime" integer,
	"popularity" double precision,
	"vote_average" double precision,
	"vote_count" integer,
	"status" text,
	"tagline" text,
	"homepage" text,
	"genres" jsonb NOT NULL,
	"production_companies" jsonb,
	"production_countries" jsonb,
	"spoken_languages" jsonb,
	"watch_providers" jsonb,
	"videos" jsonb,
	"credits" jsonb,
	"releases" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "movie_summaries" (
	"id" serial PRIMARY KEY NOT NULL,
	"tmdb_id" integer NOT NULL,
	"title" text NOT NULL,
	"overview" text NOT NULL,
	"poster_path" text,
	"backdrop_path" text,
	"popularity" double precision,
	"vote_average" double precision,
	"vote_count" integer,
	"release_date" date,
	"poster_blur_data_url" text,
	"justwatch_info" jsonb,
	CONSTRAINT "movie_summaries_tmdb_id_unique" UNIQUE("tmdb_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "person_details" (
	"summary_id" integer PRIMARY KEY NOT NULL,
	"biography" text,
	"birthday" date,
	"place_of_birth" text,
	"combined_credits" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "person_summaries" (
	"id" serial PRIMARY KEY NOT NULL,
	"tmdb_id" integer NOT NULL,
	"name" text NOT NULL,
	"profile_path" text,
	"blur_data_url" text,
	CONSTRAINT "person_summaries_tmdb_id_unique" UNIQUE("tmdb_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"avatar_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tv_details" (
	"summary_id" integer PRIMARY KEY NOT NULL,
	"adult" boolean DEFAULT true NOT NULL,
	"original_language" text,
	"original_name" text,
	"origin_country" text[],
	"homepage" text,
	"status" text,
	"tagline" text,
	"type" text,
	"backdrop_blur_data_url" text,
	"dark_vibrant_backdrop_hex" text,
	"last_air_date" date,
	"number_of_seasons" integer,
	"number_of_episodes" integer,
	"genres" jsonb NOT NULL,
	"created_by" jsonb,
	"episode_run_time" jsonb,
	"languages" jsonb,
	"networks" jsonb,
	"seasons" jsonb,
	"videos" jsonb,
	"credits" jsonb,
	"aggregate_credits" jsonb,
	"watch_providers" jsonb,
	"content_ratings" jsonb,
	"production_companies" jsonb,
	"production_countries" jsonb,
	"spoken_languages" jsonb,
	CONSTRAINT "tv_details_summary_id_unique" UNIQUE("summary_id"),
	CONSTRAINT "tv_details_summary_uk" UNIQUE("summary_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tv_summaries" (
	"id" serial PRIMARY KEY NOT NULL,
	"tmdb_id" integer NOT NULL,
	"name" text NOT NULL,
	"overview" text NOT NULL,
	"poster_path" text,
	"backdrop_path" text,
	"popularity" double precision,
	"vote_average" double precision,
	"vote_count" integer,
	"first_air_date" date,
	"poster_blur_data_url" text,
	"justwatch_info" jsonb,
	CONSTRAINT "tv_summaries_tmdb_id_unique" UNIQUE("tmdb_id")
);
--> statement-breakpoint
DROP TABLE "account";--> statement-breakpoint
DROP TABLE "session";--> statement-breakpoint
DROP TABLE "user";--> statement-breakpoint
DROP TABLE "verificationToken";--> statement-breakpoint

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'watchlist'
      AND column_name = 'userId'
  ) THEN
    EXECUTE 'ALTER TABLE "watchlist" RENAME COLUMN "userId" TO "user_id"';
  END IF;
END
$$ LANGUAGE plpgsql;
--> statement-breakpoint
-- ALTER TABLE "watchlist" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
-- ALTER TABLE "watchlist" DROP CONSTRAINT "watchlist_userId_user_id_fk";
-- --> statement-breakpoint
-- ALTER TABLE "watchlist" ALTER COLUMN "user_id" SET DATA TYPE uuid; USING user_id::uuid--> statement-breakpoint
-- ALTER TABLE "watchlist" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "episode_details" ADD CONSTRAINT "episode_details_summary_id_tv_summaries_id_fk" FOREIGN KEY ("summary_id") REFERENCES "public"."tv_summaries"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "movie_details" ADD CONSTRAINT "movie_details_summary_id_movie_summaries_id_fk" FOREIGN KEY ("summary_id") REFERENCES "public"."movie_summaries"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "person_details" ADD CONSTRAINT "person_details_summary_id_person_summaries_id_fk" FOREIGN KEY ("summary_id") REFERENCES "public"."person_summaries"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tv_details" ADD CONSTRAINT "tv_details_summary_id_tv_summaries_id_fk" FOREIGN KEY ("summary_id") REFERENCES "public"."tv_summaries"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
