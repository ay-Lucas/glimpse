import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// __dirname shim for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { BaseImageUrl, DISCOVER_LIMIT } from "../src/lib/constants.ts";
import { getBlurData } from "../src/lib/blur-data-generator.ts";
import { MovieResult, TvResult } from "../src/types/request-types.ts";
import { db } from "../src/db/index.ts";
import { listEntries, movieSummaries, tvSummaries } from "../src/db/schema.ts";
import {
  getTrendingPages,
  getPopular,
  getUpcomingMovies,
} from "../src/app/discover/actions.ts";
import { eq } from "drizzle-orm";

// now load your .env.local
dotenv.config({ path: join(__dirname, "../.env.local") });

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  },
} as const;

// Utility to dedupe by tmdbId
function uniqueBy<T extends { id: number }>(arr: T[]): T[] {
  const seen = new Set<number>();
  return arr.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

async function backfillSummaries() {
  console.log("Fetching TMDB lists...");
  const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN!;
  if (!TMDB_ACCESS_TOKEN) throw new Error("Missing TMDB_ACCESS_TOKEN");
  const [trendingMovies, trendingTv, popularMovies, popularTv, upcoming] =
    await Promise.all([
      getTrendingPages(
        { media_type: "movie", time_window: "day", page: 1 },
        2,
        options,
      ) as Promise<MovieResult[]>,
      getTrendingPages(
        { media_type: "tv", time_window: "day", page: 1 },
        2,
        options,
      ) as Promise<TvResult[]>,
      getPopular({ page: 1, "vote_average.gte": 6 }, "movie", options),
      getPopular({ page: 1, "vote_average.gte": 6 }, "tv", options),
      getUpcomingMovies({ page: 1 }, options),
    ]);

  // Combine and dedupe
  const movies = uniqueBy([
    ...trendingMovies!,
    ...(popularMovies.results ?? []),
    ...(upcoming.results ?? []),
  ]) as MovieResult[];
  const tvShows = uniqueBy([
    ...trendingTv!,
    ...(popularTv.results ?? []),
  ]) as TvResult[];

  console.log(`Backfilling ${movies.length} movies...`);
  for (const m of movies) {
    const blur = m.poster_path
      ? await getBlurData(`${BaseImageUrl.BLUR}${m.poster_path}`)
      : null;

    const releaseDate = m.release_date?.trim() || undefined;
    await db
      .insert(movieSummaries)
      .values({
        tmdbId: m.id,
        title: m.title,
        overview: m.overview ?? "",
        posterPath: m.poster_path,
        backdropPath: m.backdrop_path,
        popularity: m.popularity,
        voteAverage: m.vote_average,
        voteCount: m.vote_count,
        releaseDate: releaseDate,
        blurDataUrl: blur,
      })
      .onConflictDoUpdate({
        target: movieSummaries.tmdbId,
        set: {
          title: m.title,
          posterPath: m.poster_path,
          backdropPath: m.backdrop_path,
          popularity: m.popularity,
          voteAverage: m.vote_average,
          voteCount: m.vote_count,
          releaseDate: releaseDate,
          blurDataUrl: blur,
        },
      });
  }

  console.log(`Backfilling ${tvShows.length} TV shows...`);
  for (const t of tvShows) {
    const blur = t.poster_path
      ? await getBlurData(`${BaseImageUrl.BLUR}${t.poster_path}`)
      : null;
    console.log(t);

    const firstAirDate = t.first_air_date?.trim() || undefined;

    await db
      .insert(tvSummaries)
      .values({
        tmdbId: t.id,
        name: t.name,
        overview: t.overview ?? "",
        posterPath: t.poster_path,
        backdropPath: t.backdrop_path,
        popularity: t.popularity,
        voteAverage: t.vote_average,
        voteCount: t.vote_count,
        firstAirDate: firstAirDate,
        blurDataUrl: blur,
      })
      .onConflictDoUpdate({
        target: tvSummaries.tmdbId,
        set: {
          name: t.name,
          posterPath: t.poster_path,
          backdropPath: t.backdrop_path,
          popularity: t.popularity,
          voteAverage: t.vote_average,
          voteCount: t.vote_count,
          firstAirDate: firstAirDate,
          blurDataUrl: blur,
        },
      });
  }

  console.log(`Backfilling Trending TV shows positions...`);
  await db.transaction(async (tx) => {
    // clear old entries for this list
    await tx
      .delete(listEntries)
      .where(eq(listEntries.listName, "trending_series"));

    // upsert each ID+pos
    await Promise.all(
      trendingTv.map((item, idx) =>
        tx
          .insert(listEntries)
          .values({
            listName: "trending_series",
            tmdbId: item.id,
            mediaType: "tv",
            position: idx,
          })
          .onConflictDoNothing(),
      ),
    );
  });

  console.log(`Backfilling Trending Movies positions...`);
  await db.transaction(async (tx) => {
    // clear old entries for this list
    await tx
      .delete(listEntries)
      .where(eq(listEntries.listName, "trending_movies"));

    // upsert each ID+pos
    await Promise.all(
      trendingMovies.map((item, idx) =>
        tx
          .insert(listEntries)
          .values({
            listName: "trending_movies",
            tmdbId: item.id,
            mediaType: "movie",
            position: idx,
          })
          .onConflictDoNothing(),
      ),
    );
  });

  console.log("Backfill complete.");
}

backfillSummaries().catch((err) => {
  console.error(err);
  process.exit(1);
});
