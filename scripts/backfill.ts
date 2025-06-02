export const dynamic = 'force-dynamic';
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// __dirname shim for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { BaseImageUrl } from "../src/lib/constants.ts";
import { getBlurData } from "../src/lib/blur-data-generator.ts";
import {
  MovieResult,
  TvResult,
} from "../src/types/request-types-snakecase.ts";
import { db } from "../src/db/index.ts";
import {
  listEntries,
  movieDetails,
  movieSummaries,
  tvDetails,
  tvSummaries,
} from "../src/db/schema.ts";
import {
  getTrendingPages,
  getPopular,
  getUpcomingMovies,
  getAllTv,
  getAllMovies,
} from "../src/app/discover/actions.ts";
import { eq, inArray, not } from "drizzle-orm";
import { getMovieDetails, getTvDetails } from "@/app/(media)/actions.ts";
import { Vibrant } from "node-vibrant/node";

dotenv.config({ path: join(__dirname, "../.env.local") });

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  },
} as const;

// Main
export async function backfill() {
  try {
    const { trendingMovies, trendingTv, popularMovies, popularTv, upcoming } = await fetchLists();

    const movies = uniqueBy([
      ...trendingMovies!,
      ...(popularMovies.results ?? []),
      ...(upcoming.results ?? []),
    ]) as MovieResult[];

    const tvShows = uniqueBy([
      ...trendingTv!,
      ...(popularTv.results ?? []),
    ]) as TvResult[];

    await logChanges(movies, tvShows);
    await backfillSummaries(movies, tvShows);
    await backfillDetails(movies, tvShows);
    await backfillPositions(trendingTv, trendingMovies, popularTv.results as TvResult[], popularMovies.results as MovieResult[]);
    await removeOldEntries(movies, tvShows);
    await revalidatePaths(movies, tvShows);
    console.log("Backfill complete.");

  } catch (error) {
    console.error("There was an error completing the backfill " + error);
  }
}

async function fetchLists() {
  console.log("Fetching popular and trending tv series and movies from TMDB...");
  const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN!;
  if (!TMDB_ACCESS_TOKEN) throw new Error("Missing TMDB_ACCESS_TOKEN");
  const [trendingMovies, trendingTv, popularMovies, popularTv, upcoming] =
    await Promise.all([
      getTrendingPages(
        { media_type: "movie", time_window: "day", page: 1 },
        3, false, options
      ) as Promise<MovieResult[]>,
      getTrendingPages(
        { media_type: "tv", time_window: "day", page: 1 },
        3,
        false, options,
      ) as Promise<TvResult[]>,
      getPopular({ page: 1, "vote_average.gte": 6 }, "movie", false, options),
      getPopular({ page: 1, "vote_average.gte": 6 }, "tv", false, options),
      getUpcomingMovies({ page: 1 }, false, options),
    ]);
  return { trendingMovies, trendingTv, popularMovies, popularTv, upcoming };
}

async function backfillSummaries(movies: MovieResult[], tvShows: TvResult[]) {
  console.log(`Backfilling ${movies.length} movie summaries...`);

  for (const m of movies) {
    const posterBlurUrl = m.poster_path
      ? await getBlurData(`${BaseImageUrl.BLUR}${m.poster_path}`)
      : null;
    await pause(50)

    // Movie Summaries
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
        posterBlurDataUrl: posterBlurUrl,
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
          posterBlurDataUrl: posterBlurUrl,
        },
      });
  }

  console.log(`Backfilling ${tvShows.length} TV show summaries...`);

  for (const t of tvShows) {
    const posterBlurUrl = t.poster_path
      ? await getBlurData(`${BaseImageUrl.BLUR}${t.poster_path}`)
      : null;
    await pause(50)

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
        posterBlurDataUrl: posterBlurUrl,
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
          posterBlurDataUrl: posterBlurUrl,
        },
      });
  }

}

async function backfillDetails(movies: MovieResult[], tvShows: TvResult[]) {
  const movieIdMap = new Map<number, number>();
  await db
    .select({ tmdbId: movieSummaries.tmdbId, id: movieSummaries.id })
    .from(movieSummaries)
    .where(
      inArray(
        movieSummaries.tmdbId,
        movies.map((m) => m.id),
      ),
    )
    .then((rows) => rows.forEach((r) => movieIdMap.set(r.tmdbId, r.id)));

  const tvIdMap = new Map<number, number>();
  await db
    .select({ tmdbId: tvSummaries.tmdbId, id: tvSummaries.id })
    .from(tvSummaries)
    .where(
      inArray(
        tvSummaries.tmdbId,
        tvShows.map((t) => t.id),
      ),
    )
    .then((rows) => rows.forEach((r) => tvIdMap.set(r.tmdbId, r.id)));

  // 3) Backfill movie_details
  console.log(`Backfilling Movie Details...`);

  for (const m of movies) {
    const summaryId = movieIdMap.get(m.id);

    if (!summaryId) continue;

    const backdropBlurUrl = m.backdrop_path
      ? await getBlurData(`${BaseImageUrl.BLUR}${m.backdrop_path}`)
      : null;
    const details = await getMovieDetails(m.id, options);
    await db
      .insert(movieDetails)
      .values({
        summaryId: summaryId,
        genres: details.genres,
        budget: details.budget,
        credits: details.credits,
        runtime: details.runtime,
        revenue: details.revenue,
        spokenLanguages: details.spokenLanguages,
        status: details.status,
        videos: details.videos,
        tagline: details.tagline,
        homepage: details.homepage,
        adult: details.adult,
        belongsToCollection: details.belongsToCollection,
        imdbId: details.imdbId,
        originalLanguage: details.originalLanguage,
        originalTitle: details.originalTitle,
        originCountry: details.originCountry,
        popularity: details.popularity,
        productionCountries: details.productionCountries,
        productionCompanies: details.productionCompanies,
        releases: details.releases,
        video: details.video,
        voteAverage: details.voteAverage,
        voteCount: details.voteCount,
        backdropBlurDataUrl: backdropBlurUrl,
        watchProviders: details.watchProviders,
      })
      .onConflictDoUpdate({
        target: movieDetails.summaryId,
        set: {
          genres: details.genres,
          budget: details.budget,
          credits: details.credits,
          runtime: details.runtime,
          revenue: details.revenue,
          spokenLanguages: details.spokenLanguages,
          status: details.status,
          videos: details.videos,
          tagline: details.tagline,
          homepage: details.homepage,
          adult: details.adult,
          belongsToCollection: details.belongsToCollection,
          imdbId: details.imdbId,
          originalLanguage: details.originalLanguage,
          originalTitle: details.originalTitle,
          originCountry: details.originCountry,
          popularity: details.popularity,
          productionCountries: details.productionCountries,
          productionCompanies: details.productionCompanies,
          releases: details.releases,
          video: details.video,
          voteAverage: details.voteAverage,
          voteCount: details.voteCount,
          backdropBlurDataUrl: backdropBlurUrl,
          watchProviders: details.watchProviders,
        },
      });
    await pause(50)
  }

  // 4) Backfill tv_details
  console.log(`Backfilling TV Details...`);
  for (const t of tvShows) {
    const summaryId = tvIdMap.get(t.id);
    if (!summaryId) continue;

    const backdropBlurUrl = t.backdrop_path
      ? await getBlurData(`${BaseImageUrl.BLUR}${t.backdrop_path}`)
      : null;

    let darkVibrantBackdropHex: string | null = null;
    if (t.backdrop_path) {
      const palette = await Vibrant.from(
        `${BaseImageUrl.ORIGINAL}${t.backdrop_path}`
      ).getPalette();
      darkVibrantBackdropHex =
        palette?.DarkVibrant?.hex ?? palette?.Vibrant?.hex ?? null;
    }

    const details = await getTvDetails(t.id, options);

    await db
      .insert(tvDetails)
      .values({
        summaryId: summaryId,
        adult: details.adult,
        originalLanguage: details.originalLanguage,
        originalName: details.originalName,
        originCountry: details.originCountry,
        homepage: details.homepage,
        status: details.status,
        tagline: details.tagline,
        type: details.type,
        lastAirDate: details.lastAirDate
          ? details.lastAirDate.toString()
          : null,
        numberOfSeasons: details.numberOfSeasons,
        numberOfEpisodes: details.numberOfEpisodes,
        genres: details.genres,
        createdBy: details.createdBy,
        episodeRunTime: details.episodeRunTime,
        languages: details.languages,
        spokenLanguages: details.spokenLanguages,
        networks: details.networks,
        seasons: details.seasons,
        videos: details.videos,
        credits: details.credits,
        aggregateCredits: details.aggregateCredits,
        watchProviders: details.watchProviders,
        contentRatings: details.contentRatings,
        backdropBlurDataUrl: backdropBlurUrl,
        productionCompanies: details.productionCompanies,
        productionCountries: details.productionCountries,
        darkVibrantBackdropHex: darkVibrantBackdropHex
      })
      .onConflictDoUpdate({
        target: tvDetails.summaryId,
        set: {
          adult: details.adult,
          originalLanguage: details.originalLanguage,
          originalName: details.originalName,
          originCountry: details.originCountry,
          homepage: details.homepage,
          status: details.status,
          tagline: details.tagline,
          type: details.type,
          lastAirDate: details.lastAirDate
            ? details.lastAirDate.toString()
            : null,
          numberOfSeasons: details.numberOfSeasons,
          numberOfEpisodes: details.numberOfEpisodes,
          genres: details.genres,
          createdBy: details.createdBy,
          episodeRunTime: details.episodeRunTime,
          languages: details.languages,
          spokenLanguages: details.spokenLanguages,
          networks: details.networks,
          seasons: details.seasons,
          videos: details.videos,
          credits: details.credits,
          aggregateCredits: details.aggregateCredits,
          watchProviders: details.watchProviders,
          contentRatings: details.contentRatings,
          backdropBlurDataUrl: backdropBlurUrl,
          productionCompanies: details.productionCompanies,
          productionCountries: details.productionCountries,
          darkVibrantBackdropHex: darkVibrantBackdropHex
        },
      });
    await pause(50)
  }
}

async function backfillPositions(trendingTv: TvResult[], trendingMovies: MovieResult[], popularTv: TvResult[], popularMovies: MovieResult[]) {
  console.log(`Backfilling Trending TV shows positions...`);
  await db.transaction(async (tx) => {
    // clear old entries for this list
    await tx
      .delete(listEntries)
      .where(eq(listEntries.listName, "trending_tv"));

    // upsert each ID+pos
    await Promise.all(
      trendingTv.map((item, idx) =>
        tx
          .insert(listEntries)
          .values({
            listName: "trending_tv",
            tmdbId: item.id,
            mediaType: "tv",
            position: idx,
          }).onConflictDoNothing()
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

  console.log(`Backfilling Popular TV Shows positions...`);
  await db.transaction(async (tx) => {
    // clear old entries for this list
    await tx
      .delete(listEntries)
      .where(eq(listEntries.listName, "popular_tv"));

    // upsert each ID+pos
    await Promise.all(
      popularTv.map((item, idx) =>
        tx
          .insert(listEntries)
          .values({
            listName: "popular_tv",
            tmdbId: item.id,
            mediaType: "tv",
            position: idx,
          })
          .onConflictDoNothing(),
      ),
    );
  });

  console.log(`Backfilling Popular Movies positions...`);
  await db.transaction(async (tx) => {
    // clear old entries for this list
    await tx
      .delete(listEntries)
      .where(eq(listEntries.listName, "popular_movies"));

    // upsert each ID+pos
    await Promise.all(
      popularMovies.map((item, idx) =>
        tx
          .insert(listEntries)
          .values({
            listName: "popular_movies",
            tmdbId: item.id,
            mediaType: "movie",
            position: idx,
          })
          .onConflictDoNothing(),
      ),
    );
  });

}

async function removeOldEntries(movies: MovieResult[], tvShows: TvResult[]) {
  const currentMovieIds = movies.map(m => m.id);
  const currentTvIds = tvShows.map(t => t.id);

  console.log("Removing old entries...");
  // remove old summaries & cascades details

  await db
    .delete(movieSummaries)
    .where(not(inArray(movieSummaries.tmdbId, currentMovieIds)));

  await db
    .delete(tvSummaries)
    .where(not(inArray(tvSummaries.tmdbId, currentTvIds)));

}

async function revalidatePaths(movies: MovieResult[], tvShows: TvResult[]) {
  try {
    console.log("Revalidating paths...")

    const tvPaths = tvShows.map(item => `/tv/${item.id}`)
    const tvSeasonPaths = tvPaths.map(tvPath => `${tvPath}/seasons`)
    const moviePaths = movies.map(item => `/movie/${item.id}`)
    const allPaths = [...tvPaths, ...tvSeasonPaths, ...moviePaths, "/discover"];
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/revalidate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: process.env.REVALIDATE_SECRET,
          paths: allPaths,
        }),
      }
    );

    const json = await response.json();
    console.log("Revalidate response: ", json);
  } catch (error) {
    console.error("Backfill + revalidate failed: ", error)
  }
}

// TODO:Fix inaccurate logging
async function logChanges(movies: MovieResult[], tvShows: TvResult[]) {

  const currentTvItems = await getAllTv();
  const currentMovieItems = await getAllMovies();
  const currentMovieIds = new Set(currentMovieItems.map((m) => m.tmdbId));
  const currentTvIds = new Set(currentTvItems.map((t) => t.tmdbId));

  const newMovieIds = new Set(movies.map((m) => m.id));
  const newTvIds = new Set(tvShows.map((t) => t.id));

  const addedMovies = movies.filter((m) => !currentMovieIds.has(m.id));
  const removedMovies = currentMovieItems.filter((m) => !newMovieIds.has(m.tmdbId));

  const addedTv = tvShows.filter((t) => !currentTvIds.has(t.id));
  const removedTv = currentTvItems.filter((t) => !newTvIds.has(t.tmdbId));

  // Inaccurate
  console.log("Movies added since last run:", addedMovies.map(m => m.title));
  console.log("Movies removed since last run:", removedMovies.map(m => m.title));
  console.log("TV shows added since last run:", addedTv.map(t => t.name));
  console.log("TV shows removed since last run:", removedTv.map(t => t.title));

}

function pause(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Utility to dedupe by tmdbId
function uniqueBy<T extends { id: number }>(arr: T[]): T[] {
  const seen = new Set<number>();
  return arr.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function getBaseUrl() {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';
}
