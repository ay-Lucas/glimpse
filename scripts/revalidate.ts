import { fetchTmdbLists } from "@/app/discover/[slug]/actions";
import { getBaseUrl } from "@/lib/utils";
import { MovieResult, TvResult } from "@/types/request-types-camelcase";

import dotenv from "dotenv";
import { join } from "path";

dotenv.config({ path: join(__dirname, "../.env.local") });

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  },
} as const;

export async function revalidate() {
  const { trendingMoviesDaily, trendingMoviesWeekly, trendingTvDaily, trendingTvWeekly, popularMovies, popularTv, upcomingMovies } = await fetchTmdbLists(options);
  const tvShows = [...trendingTvWeekly, ...trendingTvDaily, ...popularTv]
  const movies = [...trendingMoviesDaily, ...trendingMoviesWeekly, ...popularMovies, ...upcomingMovies]
  await revalidatePaths(movies, tvShows);
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
