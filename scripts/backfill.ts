export const dynamic = 'force-dynamic';
import { BaseImageUrl } from "@/lib/constants.ts";
import { getBlurData } from "@/lib/blur-data-generator.ts";
import {
  MovieResult,
  TvResult,
} from "@/types/request-types-camelcase.ts";
import {
  movieSummaries,
  tvSummaries,
} from "@/db/schema.ts";
import {
  fetchAllMovies,
  fetchAllTv,
} from "@/app/discover/actions.ts";
import { inArray } from "drizzle-orm";
import { getAllMovies, getAllTv } from "@/lib/actions";
import { db } from "@/db/index"
import { DiscoverItem } from "@/types/camel-index";

// Main
export async function backfill() {
  try {
    const newMovies = await fetchAllMovies();
    const newTvShows = await fetchAllTv();
    const currentTvShows = await getAllTv();
    const currentMovies = await getAllMovies();
    const { addedMovies, removedMovies, addedTvShows, removedTvShows } = await computeChanges(currentMovies, currentTvShows, newMovies, newTvShows)
    logChanges(addedMovies, removedMovies, addedTvShows, removedTvShows);
    await backfillSummaries(addedMovies, addedTvShows);
    const removedMovieIds = removedMovies.map(item => item.tmdbId);
    const removedTvShowIds = removedTvShows.map(item => item.tmdbId);
    await removeEntries(removedMovieIds, removedTvShowIds);
    console.log("Backfill complete.");

  } catch (error) {
    console.error("There was an error completing the backfill " + error);
  }
}

async function backfillSummaries(movies: MovieResult[], tvShows: TvResult[]) {
  try {
    if (movies.length > 0) {
      console.log(`Backfilling ${movies.length} movie summaries...`);
      for (const m of movies) {
        const posterBlurUrl = m.posterPath
          ? await getBlurData(`${BaseImageUrl.BLUR}${m.posterPath}`)
          : null;
        await pause(50)

        // Movie Summaries
        const releaseDate = m.releaseDate?.trim() || undefined;
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
            releaseDate: releaseDate,
            posterBlurDataUrl: posterBlurUrl,
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
              releaseDate: releaseDate,
              posterBlurDataUrl: posterBlurUrl,
            },
          });
      }

      console.log(`${movies.length} Movies added to DB: `, movies.map(item => item.id))
    }

    if (tvShows.length > 0) {
      console.log(`Backfilling ${tvShows.length} TV show summaries...`);
      for (const t of tvShows) {
        const posterBlurUrl = t.posterPath
          ? await getBlurData(`${BaseImageUrl.BLUR}${t.posterPath}`)
          : null;
        await pause(50)

        const firstAirDate = t.firstAirDate?.trim() || undefined;

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
            firstAirDate: firstAirDate,
            posterBlurDataUrl: posterBlurUrl,
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
              firstAirDate: firstAirDate,
              posterBlurDataUrl: posterBlurUrl,
            },
          });
      }

      console.log(`${tvShows.length} TV Shows added to DB:\n`, tvShows.map(item => item.id))
    }
  }
  catch (err) {
    console.error("Error backfilling TV Shows and Movies" + err);
  }
}

async function removeEntries(movieIds: number[], tvShowIds: number[]) {
  if (movieIds.length > 0) {
    console.log(`Removing ${movieIds.length} Movie summaries`)
    await db
      .delete(movieSummaries)
      .where(inArray(movieSummaries.tmdbId, movieIds))
    console.log(`${movieIds.length} Movies removed from DB: `, movieIds)
  }

  if (tvShowIds.length > 0) {
    console.log(`Removing ${tvShowIds.length} TV Show summaries`)
    await db
      .delete(tvSummaries)
      .where(inArray(tvSummaries.tmdbId, tvShowIds))
    console.log(`${tvShowIds.length} TV Shows removed from DB: `, tvShowIds)
  }
}

async function computeChanges(currentMovies: DiscoverItem[], currentTvShows: DiscoverItem[], newMovies: MovieResult[], newTvShows: TvResult[]) {
  // --- MOVIES ---
  const currentMovieIds = new Set(currentMovies.map(m => m.tmdbId));
  const newMovieIds = new Set(newMovies.map(m => m.id));

  const addedMovies = newMovies.filter(m => !currentMovieIds.has(m.id));
  const removedMovies = currentMovies.filter(m => !newMovieIds.has(m.tmdbId));

  // --- TV SHOWS ---
  const currentTvIds = new Set(currentTvShows.map(t => t.tmdbId));
  const newTvIds = new Set(newTvShows.map(t => t.id));

  const addedTvShows = newTvShows.filter(t => !currentTvIds.has(t.id));
  const removedTvShows = currentTvShows.filter(t => !newTvIds.has(t.tmdbId));

  return { addedMovies, removedMovies, addedTvShows, removedTvShows }
}

function logChanges(
  addedMovies: MovieResult[], removedMovies: DiscoverItem[], addedTvShows: TvResult[], removedTvShows: DiscoverItem[]
) {
  if (addedMovies.length) {
    console.log(
      `${addedMovies.length} Movies added since last run:`,
      addedMovies.map(item => `${item.title}: ${item.id}`)
    );
  }

  if (removedMovies.length) {
    console.log(
      `${removedMovies.length} Movies removed since last run:`,
      removedMovies.map(item => `${item.title}: ${item.tmdbId}`)
    );
  }

  if (addedTvShows.length) {
    console.log(
      `${addedTvShows.length} Tv Shows added since last run:`,
      addedTvShows.map(item => `${item.name}: ${item.id}`)
    );
  }

  if (removedTvShows.length) {
    console.log(
      `${removedTvShows.length} Tv Shows removed since last run:`,
      removedTvShows.map(item => `${item.title}: ${item.tmdbId}`)
    );
  }

  if (!(removedTvShows.length || addedMovies.length || addedTvShows.length || removedTvShows.length)) {
    console.log("No changes in TMDB lists")
  }
}

function pause(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

backfill().then(() => {
  console.log("Script finished")
  process.exit()
}).catch(err => console.error(err))
