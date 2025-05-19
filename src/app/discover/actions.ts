"use server";
import { headers } from "next/headers";
import { BASE_API_URL, options } from "@/lib/constants";
import {
  DiscoverMovieRequest,
  DiscoverMovieResponse,
  DiscoverTvRequest,
  DiscoverTvResponse,
  TrendingRequest,
  TrendingResponse,
  UpcomingMoviesRequest,
  UpcomingMoviesResponse,
} from "@/types/request-types";

import { db } from "@/db";
import { listEntries, movieSummaries } from "@/db/schema";
import { tvSummaries } from "@/db/schema";
import { and, asc, desc, eq, gte } from "drizzle-orm";

export async function getTrending(
  request: TrendingRequest,
  reqOptions: RequestInit = options,
): Promise<TrendingResponse> {
  const res = await fetch(
    `${BASE_API_URL}/trending/${request.media_type}/${request.time_window}?&page=${request.page}`,
    reqOptions,
  );
  return res.json();
}

export async function getTrendingPages(
  request: TrendingRequest,
  numberOfPages: number,
  reqOptions: RequestInit = options,
) {
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
  return arrays;
}

export async function getPopular(
  request: DiscoverMovieRequest | DiscoverTvRequest,
  mediaType: "movie" | "tv",
  reqOptions: RequestInit = options,
): Promise<DiscoverTvResponse | DiscoverMovieResponse> {
  const res = await fetch(
    `${BASE_API_URL}/discover/${mediaType}?include_adult=false&language=en-US&region=US&page=${request.page}&sort_by=popularity.desc&vote_average.gte=${request["vote_average.gte"]}&with_original_language=en`,
    reqOptions,
  );
  return res.json();
}

export async function getUpcomingMovies(
  request: UpcomingMoviesRequest,
  reqOptions: RequestInit = options,
): Promise<UpcomingMoviesResponse> {
  const today = new Date().toISOString().split("T")[0];
  const res = await fetch(
    `${BASE_API_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&region=US&&page=${request.page}&primary_release_date.gte=${today}&release_date.gte=2024-06-26&sort_by=popularity.desc`,
    reqOptions,
  );
  return res.json();
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
  blurDataUrl?: string;
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
      blurDataUrl: tvSummaries.blurDataUrl,
      releaseDate: tvSummaries.firstAirDate,
    })
    .from(tvSummaries)
    .innerJoin(
      listEntries,
      and(
        eq(listEntries.tmdbId, tvSummaries.tmdbId),
        eq(listEntries.listName, "trending_series"),
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
    blurDataUrl: r.blurDataUrl ?? undefined,
    releaseDate: r.releaseDate ?? undefined,
  }));
}

export async function getTrendingMovies(limit = 10): Promise<DiscoverItem[]> {
  const rows = await db
    .select({
      tmdbId: movieSummaries.tmdbId,
      title: movieSummaries.title,
      overview: movieSummaries.overview,
      posterPath: movieSummaries.posterPath,
      backdropPath: movieSummaries.backdropPath,
      blurDataUrl: movieSummaries.blurDataUrl,
      releaseDate: movieSummaries.releaseDate,
    })
    .from(movieSummaries)
    .innerJoin(
      listEntries,
      and(
        eq(listEntries.tmdbId, movieSummaries.tmdbId),
        eq(listEntries.listName, "trending_movies"),
      ),
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
    blurDataUrl: r.blurDataUrl ?? undefined,
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
      blurDataUrl: movieSummaries.blurDataUrl,
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
    blurDataUrl: r.blurDataUrl ?? undefined,
    overview: r.overview,
  }));
}

export async function getPopularSeries(limit = 10): Promise<DiscoverItem[]> {
  const rows = await db
    .select({
      tmdbId: tvSummaries.tmdbId,
      title: tvSummaries.name,
      overview: tvSummaries.overview,
      posterPath: tvSummaries.posterPath,
      backdropPath: tvSummaries.backdropPath,
      blurDataUrl: tvSummaries.blurDataUrl,
      popularity: tvSummaries.popularity,
      voteAverage: tvSummaries.voteAverage,
      voteCount: tvSummaries.voteCount,
    })
    .from(tvSummaries)
    .orderBy(desc(tvSummaries.voteCount), desc(tvSummaries.popularity))
    .limit(limit);

  return rows.map((r) => ({
    tmdbId: r.tmdbId,
    title: r.title,
    overview: r.overview ?? undefined,
    posterPath: r.posterPath ?? undefined,
    backdropPath: r.backdropPath ?? undefined,
    blurDataUrl: r.blurDataUrl ?? undefined,
    popularity: r.popularity ?? undefined,
    voteAverage: r.voteAverage ?? undefined,
    voteCount: r.voteCount ?? undefined,
  }));
}

/**
 * Top N movies by vote count (then fallback to popularity)
 */
export async function getPopularMovies(limit = 10): Promise<DiscoverItem[]> {
  const rows = await db
    .select({
      tmdbId: movieSummaries.tmdbId,
      title: movieSummaries.title,
      overview: movieSummaries.overview,
      posterPath: movieSummaries.posterPath,
      backdropPath: movieSummaries.backdropPath,
      blurDataUrl: movieSummaries.blurDataUrl,
      popularity: movieSummaries.popularity,
      voteAverage: movieSummaries.voteAverage,
      voteCount: movieSummaries.voteCount,
    })
    .from(movieSummaries)
    .orderBy(desc(movieSummaries.voteCount), desc(movieSummaries.popularity))
    .limit(limit);

  return rows.map((r) => ({
    tmdbId: r.tmdbId,
    title: r.title,
    overview: r.overview ?? undefined,
    posterPath: r.posterPath ?? undefined,
    backdropPath: r.backdropPath ?? undefined,
    blurDataUrl: r.blurDataUrl ?? undefined,
    popularity: r.popularity ?? undefined,
    voteAverage: r.voteAverage ?? undefined,
    voteCount: r.voteCount ?? undefined,
  }));
}
