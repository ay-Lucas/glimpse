BEGIN;

-- 1) Tables
ALTER TABLE IF EXISTS "watchlistItems"   RENAME TO watchlist_items;
ALTER TABLE IF EXISTS "watchlist"        RENAME TO watchlist;
ALTER TABLE IF EXISTS "movieSummaries"   RENAME TO movie_summaries;
ALTER TABLE IF EXISTS "tv_summaries"     RENAME TO tv_summaries;
-- (…and so on for any others…)

-- 2) Columns on watchlist
ALTER TABLE watchlist RENAME COLUMN "watchlistName"   TO watchlist_name;
ALTER TABLE watchlist RENAME COLUMN "createdAt"       TO created_at;
ALTER TABLE watchlist RENAME COLUMN "default"         TO is_default;

-- 3) Columns on watchlist_items
ALTER TABLE watchlist_items RENAME COLUMN "watchlistId"        TO watchlist_id;
ALTER TABLE watchlist_items RENAME COLUMN "itemId"             TO item_id;
ALTER TABLE watchlist_items RENAME COLUMN "tmdbId"             TO tmdb_id;
ALTER TABLE watchlist_items RENAME COLUMN "numberOfSeasons"    TO number_of_seasons;
ALTER TABLE watchlist_items RENAME COLUMN "numberOfEpisodes"   TO number_of_episodes;
ALTER TABLE watchlist_items RENAME COLUMN "posterPath"         TO poster_path;
ALTER TABLE watchlist_items RENAME COLUMN "backdropPath"       TO backdrop_path;

-- 4) Drop & recreate FKs if needed (adjust names as needed)
ALTER TABLE watchlist_items DROP CONSTRAINT IF EXISTS "watchlistItems_watchlistId_watchlist_id_fk";
ALTER TABLE watchlist_items
  ADD CONSTRAINT watchlist_items_watchlist_id_fkey
  FOREIGN KEY (watchlist_id)
  REFERENCES watchlist(id)
  ON DELETE CASCADE;

COMMIT;
