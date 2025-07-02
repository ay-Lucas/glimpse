export const dynamic = "force-dynamic";
import {
  BaseImageUrl,
  DEFAULT_BLUR_DATA_URL,
  NUM_OF_POPULAR_PEOPLE_PAGES,
} from "@/lib/constants.ts";
import { getBlurData } from "@/lib/blur-data-generator.ts";
import { MovieResult, TvResult } from "@/types/request-types-camelcase.ts";
import { movieSummaries, tvSummaries } from "@/db/schema.ts";
import { fetchAllMovies, fetchAllTv } from "@/app/discover/actions.ts";
import { inArray } from "drizzle-orm";
import { getAllMovies, getAllTv } from "@/lib/actions";
import { db } from "@/db/index";
import { DiscoverItem } from "@/types/camel-index";
import { redis, writePopularPeopleScores } from "@/services/cache";
import { getJustWatchInfo } from "@/app/(media)/actions";
import { revalidate } from "./revalidate";
import { fetchPopularPeopleScores } from "@/app/(media)/person/[id]/actions";

async function backfillAndRevalidate() {
  const backfillSuccessful = await backfill();

  if (!backfillSuccessful) console.log("exiting...");

  console.log("revalidating..");
  const revalidateSuccessful = await revalidate();

  if (!revalidateSuccessful) console.log("revalidate failed");
}

// Main
export async function backfill() {
  try {
    // directly from TMDB
    const newMovies = await fetchAllMovies();
    const newTvShows = await fetchAllTv();

    // Supabase Entries
    const currentTvShows = await getAllTv();
    const currentMovies = await getAllMovies();

    // Compare lists
    const { addedMovies, removedMovies, addedTvShows, removedTvShows } =
      await computeChanges(
        currentMovies ?? [],
        currentTvShows ?? [],
        newMovies,
        newTvShows
      );
    logChanges(addedMovies, removedMovies, addedTvShows, removedTvShows);
    await insertLQIP(addedMovies, addedTvShows);
    await removeLQIPKeys(removedMovies, removedTvShows);
    console.log("Redis LQIP backfill complete.");

    // Supabase Entries
    await insertSummaries(addedMovies, addedTvShows);
    await removeSummaries(
      removedMovies.map((item) => item.tmdbId),
      removedTvShows.map((item) => item.tmdbId)
    );

    await insertPopularPeopleScores();

    console.log("Database backfill complete.");

    return true;
  } catch (error) {
    console.error("There was an error completing the backfill " + error);
  }
}

async function insertSummaries(movies: MovieResult[], tvShows: TvResult[]) {
  if (movies.length > 0) {
    console.log(`Backfilling ${movies.length} movie summaries...`);
    for (const m of movies) {
      try {
        // const posterBlurUrl = m.posterPath
        //   ? await getBlurData(`${BaseImageUrl.BLUR}${m.posterPath}`)
        //   : null;
        const releaseDateStr = m.releaseDate?.trim() || undefined;
        const releaseDate = releaseDateStr ? new Date(releaseDateStr) : null;
        const justWatchInfo = await getJustWatchInfo(
          m.title,
          "movie",
          m.id,
          releaseDate
        );

        // Movie Summaries
        await db
          .insert(movieSummaries)
          .values({
            tmdbId: m.id,
            title: m.title,
            overview: m.overview ?? "",
            posterPath: m.posterPath,
            backdropPath: m.backdropPath,
            popularity: m.popularity,
            voteAverage: m.voteAverage,
            voteCount: m.voteCount,
            releaseDate: releaseDateStr,
            justWatchInfo: justWatchInfo,
            // posterBlurDataUrl: posterBlurUrl,
          })
          .onConflictDoUpdate({
            target: movieSummaries.tmdbId,
            set: {
              title: m.title,
              overview: m.overview ?? "",
              posterPath: m.posterPath,
              backdropPath: m.backdropPath,
              popularity: m.popularity,
              voteAverage: m.voteAverage,
              voteCount: m.voteCount,
              releaseDate: releaseDateStr,
              justWatchInfo: justWatchInfo,
              // posterBlurDataUrl: posterBlurUrl,
            },
          });
        await pause(100);
      } catch (err) {
        console.error(
          `⚠️  Error inserting Movie Summary for "${m.title}" (ID ${m.id}):`,
          err
        );
      }
    }

    console.log(
      `${movies.length} Movies added to DB: `,
      movies.map((item) => item.id)
    );
  }

  if (tvShows.length > 0) {
    console.log(`Backfilling ${tvShows.length} TV show summaries...`);
    for (const t of tvShows) {
      try {
        // const posterBlurUrl = t.posterPath
        //   ? await getBlurData(`${BaseImageUrl.BLUR}${t.posterPath}`)
        //   : null;
        const firstAirDateStr = t.firstAirDate?.trim() || undefined;
        const firstAirDate = firstAirDateStr ? new Date(firstAirDateStr) : null;
        const justWatchInfo = await getJustWatchInfo(
          t.name,
          "tv",
          t.id,
          firstAirDate
        );

        await db
          .insert(tvSummaries)
          .values({
            tmdbId: t.id,
            name: t.name,
            overview: t.overview ?? "",
            posterPath: t.posterPath,
            backdropPath: t.backdropPath,
            popularity: t.popularity,
            voteAverage: t.voteAverage,
            voteCount: t.voteCount,
            firstAirDate: firstAirDateStr,
            justWatchInfo: justWatchInfo,
            // posterBlurDataUrl: posterBlurUrl,
          })
          .onConflictDoUpdate({
            target: tvSummaries.tmdbId,
            set: {
              name: t.name,
              overview: t.overview ?? "",
              posterPath: t.posterPath,
              backdropPath: t.backdropPath,
              popularity: t.popularity,
              voteAverage: t.voteAverage,
              voteCount: t.voteCount,
              firstAirDate: firstAirDateStr,
              justWatchInfo: justWatchInfo,
              // posterBlurDataUrl: posterBlurUrl,
            },
          });
        await pause(100);
      } catch (err) {
        console.error(
          `⚠️  Error inserting TV Summary for "${t.name}" (ID ${t.id}):`,
          err
        );
      }
    }

    console.log(
      `${tvShows.length} TV Shows added to DB:\n`,
      tvShows.map((item) => item.id)
    );
  }
}

async function removeSummaries(movieIds: number[], tvShowIds: number[]) {
  if (movieIds.length > 0) {
    console.log(`Removing ${movieIds.length} Movie summaries`);
    await db
      .delete(movieSummaries)
      .where(inArray(movieSummaries.tmdbId, movieIds));
    console.log(`${movieIds.length} Movies removed from DB: `, movieIds);
  }

  if (tvShowIds.length > 0) {
    console.log(`Removing ${tvShowIds.length} TV Show summaries`);
    await db.delete(tvSummaries).where(inArray(tvSummaries.tmdbId, tvShowIds));
    console.log(`${tvShowIds.length} TV Shows removed from DB: `, tvShowIds);
  }
}

async function computeChanges(
  currentMovies: DiscoverItem[],
  currentTvShows: DiscoverItem[],
  newMovies: MovieResult[],
  newTvShows: TvResult[]
) {
  // --- MOVIES ---
  const currentMovieIds = new Set(currentMovies.map((m) => m.tmdbId));
  const newMovieIds = new Set(newMovies.map((m) => m.id));

  const addedMovies = newMovies.filter((m) => !currentMovieIds.has(m.id));
  const removedMovies = currentMovies.filter((m) => !newMovieIds.has(m.tmdbId));

  // --- TV SHOWS ---
  const currentTvIds = new Set(currentTvShows.map((t) => t.tmdbId));
  const newTvIds = new Set(newTvShows.map((t) => t.id));

  const addedTvShows = newTvShows.filter((t) => !currentTvIds.has(t.id));
  const removedTvShows = currentTvShows.filter((t) => !newTvIds.has(t.tmdbId));

  return { addedMovies, removedMovies, addedTvShows, removedTvShows };
}

function logChanges(
  addedMovies: MovieResult[],
  removedMovies: DiscoverItem[],
  addedTvShows: TvResult[],
  removedTvShows: DiscoverItem[]
) {
  if (addedMovies.length) {
    console.log(
      `${addedMovies.length} Movies added since last run:`,
      addedMovies.map((item) => `${item.title}: ${item.id}`)
    );
  }

  if (removedMovies.length) {
    console.log(
      `${removedMovies.length} Movies removed since last run:`,
      removedMovies.map((item) => `${item.title}: ${item.tmdbId}`)
    );
  }

  if (addedTvShows.length) {
    console.log(
      `${addedTvShows.length} Tv Shows added since last run:`,
      addedTvShows.map((item) => `${item.name}: ${item.id}`)
    );
  }

  if (removedTvShows.length) {
    console.log(
      `${removedTvShows.length} Tv Shows removed since last run:`,
      removedTvShows.map((item) => `${item.title}: ${item.tmdbId}`)
    );
  }

  if (
    !(
      removedTvShows.length ||
      addedMovies.length ||
      addedTvShows.length ||
      removedTvShows.length
    )
  ) {
    console.log("No changes in TMDB lists");
  }
}

async function writeLQIPKey(
  media: "movie" | "tv",
  tmdbId: number,
  title: string,
  posterPath: string | null,
  backdropPath: string | null
) {
  try {
    const posterUrl = posterPath ? `${BaseImageUrl.POSTER}${posterPath}` : null;
    const backdropUrl = backdropPath
      ? `${BaseImageUrl.ORIGINAL}${backdropPath}`
      : null;

    const posterPromise = posterUrl
      ? getBlurData(posterUrl)
      : Promise.resolve(DEFAULT_BLUR_DATA_URL);
    const backdropPromise = backdropUrl
      ? getBlurData(backdropUrl)
      : Promise.resolve(DEFAULT_BLUR_DATA_URL);

    const [posterBlur, backdropBlur] = await Promise.all([
      posterPromise,
      backdropPromise,
    ]);

    const key = `lqip:${media}:${tmdbId}`;
    const payload = JSON.stringify({ posterBlur, backdropBlur });

    // store in Redis, no TTL so it lives until you explicitly delete or override
    await redis.set(key, payload);
  } catch (err) {
    console.error(
      `⚠️  Failed to write LQIP for ${media} "${title}" (ID ${tmdbId}):`,
      err
    );
  }
}

async function removeLQIPKeys(
  removedMovies: DiscoverItem[],
  removedTvShows: DiscoverItem[]
) {
  try {
    const total = removedMovies.length + removedTvShows.length;
    if (total === 0) {
      console.log("No old LQIP keys to remove");
      return;
    }

    const deleteTasks = await Promise.allSettled([
      ...removedMovies.map((m) => redis.del(`lqip:movie:${m.tmdbId}`)),
      ...removedTvShows.map((t) => redis.del(`lqip:tv:${t.tmdbId}`)),
    ]);

    deleteTasks.forEach((r, i) => {
      if (r.status === "rejected") {
        console.error(`Failed to delete LQIP key #${i}:`, r.reason);
      }
    });

    const fulfilledLength = deleteTasks.filter(
      (item) => item.status === "fulfilled"
    ).length;
    console.log(`${fulfilledLength} Removed from Redis`);
  } catch (err) {
    console.error(`⚠️ Error removing LQIP keys`, err);
  }
}

async function insertLQIP(
  addedMovies: MovieResult[],
  addedTvShows: TvResult[]
) {
  try {
    const total = addedMovies.length + addedTvShows.length;
    if (total === 0) {
      console.log("No new LQIP keys to insert");
      return;
    }

    const writeTasks = await Promise.allSettled([
      ...addedMovies.map((m) =>
        writeLQIPKey(
          "movie",
          m.id,
          m.title,
          m.posterPath ?? null,
          m.backdropPath ?? null
        )
      ),
      ...addedTvShows.map((t) =>
        writeLQIPKey(
          "tv",
          t.id,
          t.name,
          t.posterPath ?? null,
          t.backdropPath ?? null
        )
      ),
    ]);

    writeTasks.forEach((r, i) => {
      if (r.status === "rejected") {
        console.error(`Failed to write LQIP key #${i}:`, r.reason);
      }
    });

    const fulfilledLength = writeTasks.filter(
      (item) => item.status === "fulfilled"
    ).length;
    console.log(`${fulfilledLength} Added to Redis`);
  } catch (err) {
    console.error(`⚠️ Error inserting LQIP keys`, err);
  }
}

async function insertPopularPeopleScores() {
  const popularPeople = await fetchPopularPeopleScores(); // top 10000 people popularity scores
  const scores = popularPeople?.sortedScores;

  // Check for equal length
  if (scores?.length === NUM_OF_POPULAR_PEOPLE_PAGES * 10) {
    await writePopularPeopleScores(scores);
  } else {
    console.error("Error calling getPopularPeopleScores");
  }
}

function pause(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

backfillAndRevalidate()
  .then(() => {
    console.log("Backfill and revalidate complete");
    process.exit();
  })
  .catch((err) => console.error(err));
