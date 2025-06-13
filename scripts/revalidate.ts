import { fetchTmdbMovieLists, fetchTmdbTvLists } from "@/app/discover/actions";
import { getBaseUrl } from "@/lib/utils";
import { MovieResult, TvResult } from "@/types/request-types-camelcase";
import { fileURLToPath } from "url";

// __dirname shim for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import dotenv from "dotenv";
import { join, dirname } from "path";

dotenv.config({ path: join(__dirname, "../.env.local") });

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  },
} as const;

export async function revalidate() {
  const { trendingMoviesDaily, trendingMoviesWeekly, popularMovies, upcomingMovies } = await fetchTmdbMovieLists(options);
  const { trendingTvWeekly, trendingTvDaily, popularTv } = await fetchTmdbTvLists(options);

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
    const allPaths = [...tvPaths, ...tvSeasonPaths, ...moviePaths, "/discover", "/"];
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

    const json: { revalidated: string[] } | undefined = await response.json();
    if (!json) throw new Error("revalidatePaths failed, 0 paths revalidated")

    let tvPathsNum = 0, tvSeasonPathsNum = 0, moviePathsNum = 0;
    let unmatchedPaths: string[] = [];

    json?.revalidated.forEach(path => {
      if (isTvPath(path) && !isTvSeasonPath(path))
        tvPathsNum++;
      else if (isTvSeasonPath(path))
        tvSeasonPathsNum++;
      else if (isMoviePath(path))
        moviePathsNum++;
      else
        unmatchedPaths.push(path)
    })

    console.log("Revalidate response:\n" + JSON.stringify(json, null, 2));
    console.log(`Revalidated: \n${tvPathsNum} TV Paths\n${tvSeasonPathsNum} TV Season Paths\n${moviePathsNum} Movie Paths\n${unmatchedPaths.length} Unmatched Paths`)
    console.log(`\nRevalidated ${unmatchedPaths.length} Unmatched Paths: \n` + JSON.stringify(unmatchedPaths, null, 2));
  } catch (error) {
    console.error("Backfill + revalidate failed: ", error)
  }
}

function isTvPath(str: string) {
  return str.startsWith("/tv")
}

function isTvSeasonPath(str: string) {
  return str.startsWith("/tv") && str.endsWith("/seasons")
}

function isMoviePath(str: string) {
  return str.startsWith("/movie")
}

revalidate().then(res => console.log(`Script completed`)).catch(error => console.error(error))
