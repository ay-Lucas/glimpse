ALTER TABLE IF EXISTS "watchlistItems"
  RENAME TO watchlist_items;
-- ALTER TABLE "watchlistItems" RENAME TO "watchlist_items";--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
      FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name   = 'watchlist'
       AND column_name  = 'watchlistName'
  ) THEN
    ALTER TABLE public.watchlist
      RENAME COLUMN "watchlistName" TO watchlist_name;
  END IF;
END
$$;
-- ALTER TABLE "watchlist" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
      FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name   = 'watchlist'
       AND column_name  = 'createdAt'
  ) THEN
    ALTER TABLE public.watchlist
      RENAME COLUMN "createdAt" TO created_at;
  END IF;
END
$$;
-- ALTER TABLE "watchlist" RENAME COLUMN "default" TO "is_default";--> statement-breakpoint
-- ALTER TABLE "watchlist_items" RENAME COLUMN "watchlistId" TO "watchlist_id";--> statement-breakpoint
-- ALTER TABLE "watchlist_items" RENAME COLUMN "itemId" TO "item_id";--> statement-breakpoint
-- ALTER TABLE "watchlist_items" RENAME COLUMN "tmdbId" TO "tmdb_id";--> statement-breakpoint
-- ALTER TABLE "watchlist_items" RENAME COLUMN "numberOfSeasons" TO "number_of_seasons";--> statement-breakpoint
-- ALTER TABLE "watchlist_items" RENAME COLUMN "numberOfEpisodes" TO "number_of_episodes";--> statement-breakpoint
-- ALTER TABLE "watchlist_items" RENAME COLUMN "posterPath" TO "poster_path";--> statement-breakpoint
-- ALTER TABLE "watchlist_items" RENAME COLUMN "backdropPath" TO "backdrop_path";--> statement-breakpoint
-- ALTER TABLE "tv_details" DROP CONSTRAINT "tv_details_summary_id_unique";--> statement-breakpoint
-- ALTER TABLE "tv_details" DROP CONSTRAINT "tv_details_summary_uk";--> statement-breakpoint
-- ALTER TABLE "watchlist_items" DROP CONSTRAINT "watchlistItems_watchlistId_watchlist_id_fk";
-- --> statement-breakpoint
-- ALTER TABLE "profiles" ADD COLUMN "email_confirmation_sent_at" timestamp;--> statement-breakpoint
-- DO $$ BEGIN
--  ALTER TABLE "watchlist_items" ADD CONSTRAINT "watchlist_items_watchlist_id_watchlist_id_fk" FOREIGN KEY ("watchlist_id") REFERENCES "public"."watchlist"("id") ON DELETE cascade ON UPDATE no action;
-- EXCEPTION
--  WHEN duplicate_object THEN null;
-- END $$;
-- 1) Drop any legacy constraints (no‐ops if already gone)
ALTER TABLE tv_details
  DROP CONSTRAINT IF EXISTS tv_details_summary_id_unique;
ALTER TABLE tv_details
  DROP CONSTRAINT IF EXISTS tv_details_summary_uk;
ALTER TABLE watchlist_items
  DROP CONSTRAINT IF EXISTS watchlistItems_watchlistId_watchlist_id_fk;

-- 2) Add the new timestamp column (only if missing)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS email_confirmation_sent_at timestamptz;

-- 3) Re‐create the watchlist_items → watchlist FK if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
      FROM pg_constraint
     WHERE conname = 'watchlist_items_watchlist_id_watchlist_id_fk'
  ) THEN
    ALTER TABLE watchlist_items
      ADD CONSTRAINT watchlist_items_watchlist_id_watchlist_id_fk
      FOREIGN KEY (watchlist_id)
      REFERENCES watchlist(id)
      ON DELETE CASCADE;
  END IF;
END
$$;
