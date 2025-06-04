"server only";
import { headers } from "next/headers";
import { BASE_API_URL, options } from "@/lib/constants";
import {
  DiscoverMovieRequest,
  DiscoverTvRequest,
  TrendingRequest,
  TrendingResponse,
  UpcomingMoviesRequest,
} from "@/types/request-types-snakecase";


import { db } from "@/db";
import { listEntries, movieDetails, movieSummaries, tvDetails } from "@/db/schema";
import { tvSummaries } from "@/db/schema";
import { and, asc, eq, gte, inArray, isNotNull, lte, not, or } from "drizzle-orm";
import camelcaseKeys from "camelcase-keys";
import { MovieResult, TvResult, UpcomingMoviesResponse } from "@/types/request-types-camelcase";
import { unstable_cache } from "next/cache";

export const getTrending = async (
  request: TrendingRequest,
  reqOptions: RequestInit = options,
): Promise<TrendingResponse> => {
  console.log("options: ", options)
  console.log(`${BASE_API_URL}/trending/${request.media_type}/${request.time_window}?&page=${request.page}`)
  const res = await fetch(
    `${BASE_API_URL}/trending/${request.media_type}/${request.time_window}?&page=${request.page}`,
    reqOptions,
  );
  const data = res.json();
  console.log(data)
  return data;
}

export const getTrendingPages = async (
  request: TrendingRequest,
  numberOfPages: number,
  camelcase?: boolean,
  reqOptions: RequestInit = options,
) => {
  const requests = [];
  for (let i = 0; i < numberOfPages; i++) {
    requests.push(
      getTrending(
        {
          media_type: request.media_type,
          time_window: request.time_window,
          page: i + 1,
        },
        reqOptions,
      ),
    );
  }
  const array = await Promise.all(requests);
  const arrays = array.flatMap((page) => page.results);

  if (camelcase) {
    return camelcaseKeys(arrays as any, { deep: true }) as MovieResult[] | TvResult[];
  }
  return arrays;
}

export const getPopular = async (
  request: DiscoverMovieRequest | DiscoverTvRequest,
  mediaType: "movie" | "tv",
  camelcase?: boolean,
  reqOptions: RequestInit = options,
) => {
  const res = await fetch(
    `${BASE_API_URL}/discover/${mediaType}?include_adult=false&language=en-US&region=US&page=${request.page}&sort_by=popularity.desc&vote_average.gte=${request["vote_average.gte"]}&with_original_language=en`,
    reqOptions,
  );
  const data = await res.json();

  if (camelcase) {
    return camelcaseKeys(data, { deep: true })
  }
  return data;
}

export const getPopularPages = async (
  request: DiscoverMovieRequest | DiscoverTvRequest,
  mediaType: "movie" | "tv",
  numberOfPages: number,
  camelcase?: boolean,
  reqOptions: RequestInit = options,
) => {
  const requests = [];
  for (let i = 0; i < numberOfPages; i++) {
    requests.push(
      getPopular({
        page: i + 1,
      }, mediaType, true, reqOptions)
    );
  }
  const array = await Promise.all(requests);
  const arrays = array.flatMap((page) => page.results);

  if (camelcase) {
    console.log("getPopularPages called")
    return camelcaseKeys(arrays as any, { deep: true }) as MovieResult[] | TvResult[];
  }
  return arrays;
}

export const getUpcomingMovies = async (
  request: UpcomingMoviesRequest,
  camelcase?: boolean,
  reqOptions: RequestInit = options,
) => {
  const today = new Date().toISOString().split("T")[0];
  const res = await fetch(
    `${BASE_API_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&region=US&&page=${request.page}&primary_release_date.gte=${today}&release_date.gte=2024-06-26&sort_by=popularity.desc`,
    reqOptions,
  );
  const data = await res.json();

  if (camelcase)
    return camelcaseKeys(data, { deep: true })
  // exclude: [/^[A-Z]{2}$/]
  return data;
}

// export async function getDeviceType(): Promise<string> {
//   const headersList = headers();
//   const userAgent = headersList.get("user-agent") ?? "WPDesktop";
//
//   return userAgent.match(
//     /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
//   )
//     ? "mobile"
//     : "desktop";
// }
export async function getDeviceType() {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");

  return userAgent;
}

// src/app/discover/actions.ts
export type DiscoverItem = {
  tmdbId: number;
  title: string;
  posterPath?: string;
  backdropPath?: string;
  posterBlurDataUrl?: string;
  overview?: string;
};

// top N trending series by popularity
export async function getTrendingSeries(limit = 10): Promise<DiscoverItem[]> {
  const rows = await db
    .select({
      tmdbId: tvSummaries.tmdbId,
      title: tvSummaries.name,
      overview: tvSummaries.overview,
      posterPath: tvSummaries.posterPath,
      backdropPath: tvSummaries.backdropPath,
      posterBlurDataUrl: tvSummaries.posterBlurDataUrl,
      releaseDate: tvSummaries.firstAirDate,
    })
    .from(tvSummaries)
    .leftJoin(
      tvDetails,
      eq(tvDetails.summaryId, tvSummaries.id),
    )
    .innerJoin(
      listEntries,
      and(
        eq(listEntries.tmdbId, tvSummaries.tmdbId),
        eq(listEntries.listName, "trending_tv"),
        or(eq(tvDetails.originalLanguage, "en"), eq(tvDetails.originalLanguage, "ja"))
      ),
    )
    .orderBy(asc(listEntries.position))
    .limit(limit);

  return rows.map((r) => ({
    tmdbId: r.tmdbId,
    mediaType: "tv",
    title: r.title,
    overview: r.overview ?? undefined,
    posterPath: r.posterPath ?? undefined,
    backdropPath: r.backdropPath ?? undefined,
    posterBlurDataUrl: r.posterBlurDataUrl ?? undefined,
    releaseDate: r.releaseDate ?? undefined,
  }));
}

export async function getTrendingMovies(limit = 10): Promise<DiscoverItem[]> {
  const today = new Date().toISOString().split('T')[0];
  const rows = await db
    .select({
      tmdbId: movieSummaries.tmdbId,
      title: movieSummaries.title,
      overview: movieSummaries.overview,
      posterPath: movieSummaries.posterPath,
      backdropPath: movieSummaries.backdropPath,
      posterBlurDataUrl: movieSummaries.posterBlurDataUrl,
      releaseDate: movieSummaries.releaseDate,
    })
    .from(movieSummaries)
    .leftJoin(
      movieDetails,
      eq(movieDetails.summaryId, movieSummaries.id),
    )
    .innerJoin(
      listEntries,
      and(
        eq(listEntries.tmdbId, movieSummaries.tmdbId),
        eq(listEntries.listName, "trending_movies"),
      ),
    )
    .where(
      and(
        isNotNull(movieSummaries.releaseDate),
        // <= today
        lte(movieSummaries.releaseDate, today!), // no unreleased movies
        eq(movieDetails.originalLanguage, "en")
        // other filters…
        // gt(movieSummaries.popularity, MIN_POPULARITY),
        // movieSummaries.voteAverage.gte(MIN_RATING),
      )
    )
    .orderBy(asc(listEntries.position))
    .limit(limit);

  return rows.map((r) => ({
    tmdbId: r.tmdbId,
    mediaType: "movie",
    title: r.title,
    overview: r.overview ?? undefined,
    posterPath: r.posterPath ?? undefined,
    backdropPath: r.backdropPath ?? undefined,
    posterBlurDataUrl: r.posterBlurDataUrl ?? undefined,
    releaseDate: r.releaseDate ?? undefined,
  }));
}
// upcoming movies: releaseDate ≥ today, earliest first
export async function getUpcomingMovieSummaries(
  limit = 10,
): Promise<DiscoverItem[]> {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const rows = await db
    .select({
      tmdbId: movieSummaries.tmdbId,
      title: movieSummaries.title,
      posterPath: movieSummaries.posterPath,
      backdropPath: movieSummaries.backdropPath,
      posterBlurUrl: movieSummaries.posterBlurDataUrl,
      overview: movieSummaries.overview,
    })
    .from(movieSummaries)
    .where(gte(movieSummaries.releaseDate, today))
    .orderBy(asc(movieSummaries.releaseDate))
    .limit(limit);

  return rows.map((r) => ({
    tmdbId: r.tmdbId,
    title: r.title,
    posterPath: r.posterPath ?? undefined,
    backdropPath: r.backdropPath ?? undefined,
    posterBlurUrl: r.posterBlurUrl,
    overview: r.overview,
  }));
}

export async function getPopularSeries(limit = 10): Promise<DiscoverItem[]> {
  // build a sub-query of all the trending IDs
  const trendingIdsQ = db
    .select({ id: listEntries.tmdbId })
    .from(listEntries)
    .where(eq(listEntries.listName, "trending_tv"));

  const rows = await db
    .select({
      tmdbId: tvSummaries.tmdbId,
      title: tvSummaries.name,
      overview: tvSummaries.overview,
      posterPath: tvSummaries.posterPath,
      backdropPath: tvSummaries.backdropPath,
      posterBlurUrl: tvSummaries.posterBlurDataUrl,
      popularity: tvSummaries.popularity,
      voteAverage: tvSummaries.voteAverage,
      voteCount: tvSummaries.voteCount,
    })
    .from(tvSummaries)
    .innerJoin(
      listEntries,
      and(
        eq(listEntries.listName, "popular_tv"),
        eq(listEntries.tmdbId, tvSummaries.tmdbId),
      ),
    )
    .where(not(inArray(tvSummaries.tmdbId, trendingIdsQ))) // prevent duplicates from trending series
    // .orderBy(asc(listEntries.position))
    // .orderBy()
    .limit(limit);

  return rows.map((r) => ({
    tmdbId: r.tmdbId,
    title: r.title,
    overview: r.overview ?? undefined,
    posterPath: r.posterPath ?? undefined,
    backdropPath: r.backdropPath ?? undefined,
    posterBlurUrl: r.posterBlurUrl,
    popularity: r.popularity ?? undefined,
    voteAverage: r.voteAverage ?? undefined,
    voteCount: r.voteCount ?? undefined,
  }));
}

export async function getPopularMovies(limit = 10): Promise<DiscoverItem[]> {
  // build a sub-query of all the trending IDs
  const trendingIdsQ = db
    .select({ id: listEntries.tmdbId })
    .from(listEntries)
    .where(eq(listEntries.listName, "trending_movies"));

  const rows = await db
    .select({
      tmdbId: movieSummaries.tmdbId,
      title: movieSummaries.title,
      overview: movieSummaries.overview,
      posterPath: movieSummaries.posterPath,
      backdropPath: movieSummaries.backdropPath,
      posterBlurUrl: movieSummaries.posterBlurDataUrl,
      popularity: movieSummaries.popularity,
      voteAverage: movieSummaries.voteAverage,
      voteCount: movieSummaries.voteCount,
    })
    .from(movieSummaries)
    .innerJoin(
      listEntries,
      and(
        eq(listEntries.listName, "popular_movies"),
        eq(listEntries.tmdbId, movieSummaries.tmdbId),
      ),
    )
    .where(not(inArray(movieSummaries.tmdbId, trendingIdsQ))) // prevent dupliactes from trending series
    .orderBy(asc(listEntries.position))
    .limit(limit);

  return rows.map((r) => ({
    tmdbId: r.tmdbId,
    title: r.title,
    overview: r.overview ?? undefined,
    posterPath: r.posterPath ?? undefined,
    backdropPath: r.backdropPath ?? undefined,
    posterBlurUrl: r.posterBlurUrl ?? undefined,
    popularity: r.popularity ?? undefined,
    voteAverage: r.voteAverage ?? undefined,
    voteCount: r.voteCount ?? undefined,
  }));
}

export async function getAllTv(): Promise<DiscoverItem[]> {
  const rows = await db
    .select({
      tmdbId: tvSummaries.tmdbId,
      title: tvSummaries.name,
    })
    .from(tvSummaries)
    .leftJoin(
      tvDetails,
      eq(tvDetails.summaryId, tvSummaries.id),
    )

  return rows.map((r) => ({
    tmdbId: r.tmdbId,
    mediaType: "tv",
    title: r.title,
  }));
}

export async function getAllMovies(): Promise<DiscoverItem[]> {
  const rows = await db
    .select({
      tmdbId: movieSummaries.tmdbId,
      title: movieSummaries.title,
    })
    .from(movieSummaries)
    .leftJoin(
      movieDetails,
      eq(movieDetails.summaryId, movieSummaries.id),
    )

  return rows.map((r) => ({
    tmdbId: r.tmdbId,
    mediaType: "movie",
    title: r.title,
  }));
}


export async function fetchTmdbLists(
  reqOptions: RequestInit = options,
) {
  const NUM_PAGES = 2;

  function isAnime(item: TvResult) {
    return item.originalLanguage?.toUpperCase() === "JA" && item.originCountry?.some(country => country.toUpperCase() === "JP")
  }

  const [trendingMoviesDailyRes, trendingMoviesWeeklyRes, trendingTvDailyRes, trendingTvWeeklyRes, popularMoviesRes, popularTvRes, upcomingMoviesRes] =
    await Promise.all([
      getTrendingPages(
        { media_type: "movie", time_window: "day", page: 1 },
        NUM_PAGES, true, reqOptions
      ) as Promise<MovieResult[]>,
      getTrendingPages(
        { media_type: "movie", time_window: "week", page: 1 },
        NUM_PAGES, true, reqOptions
      ) as Promise<MovieResult[]>,
      getTrendingPages(
        { media_type: "tv", time_window: "day", page: 1 },
        NUM_PAGES, true, reqOptions
      ) as Promise<TvResult[]>,
      getTrendingPages(
        { media_type: "tv", time_window: "week", page: 1 },
        NUM_PAGES, true, reqOptions
      ) as Promise<TvResult[]>,
      getPopularPages({ "vote_average.gte": 6 }, "movie", NUM_PAGES, true, reqOptions) as Promise<MovieResult[]>,
      getPopularPages({ "vote_average.gte": 6 }, "tv", NUM_PAGES, true, reqOptions) as Promise<TvResult[]>,
      getUpcomingMovies({ page: 1 }, true, reqOptions) as Promise<UpcomingMoviesResponse>,
    ]);

  const trendingTvWeekly = trendingTvWeeklyRes.filter(
    (item) =>
      (isAnime(item) || item.originalLanguage?.toUpperCase() === "EN") &&
      new Date(item.firstAirDate ?? Date.now()).valueOf() < new Date().valueOf(),
  );

  const trendingTvDaily = trendingTvDailyRes.filter(
    (item) =>
      (isAnime(item) || item.originalLanguage?.toUpperCase() === "EN") &&
      new Date(item.firstAirDate ?? Date.now()).valueOf() < new Date().valueOf(),
  );

  const trendingMoviesWeekly = trendingMoviesWeeklyRes.filter(
    (item) =>
      item.originalLanguage?.toUpperCase() === "EN" &&
      new Date(item.releaseDate ?? Date.now()).valueOf() < new Date().valueOf(),
  );
  const trendingMoviesDaily = trendingMoviesDailyRes.filter(
    (item) =>
      item.originalLanguage?.toUpperCase() === "EN" &&
      new Date(item.releaseDate ?? Date.now()).valueOf() < new Date().valueOf(),
  );

  const upcomingMovies = upcomingMoviesRes.results?.filter(item => item.originalLanguage?.toUpperCase() === "EN") ?? []

  const trendingTvIds = new Set([...trendingTvDaily.map(item => item.id), ...trendingTvWeekly.map(item => item.id)])
  const popularTv = popularTvRes?.filter(item => !trendingTvIds.has(item.id)) ?? []

  const trendingMovieIds = new Set([
    ...trendingMoviesDaily.map(item => item.id), ...trendingMoviesWeekly.map(item => item.id)
  ])
  const popularMovies = popularMoviesRes?.filter(item => !trendingMovieIds.has(item.id)) ?? []

  return { trendingMoviesDaily, trendingMoviesWeekly, trendingTvDaily, trendingTvWeekly, popularMovies, popularTv, upcomingMovies }
}

export const fetchTmdbListsCached = unstable_cache(fetchTmdbLists)
