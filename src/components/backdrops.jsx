"use server";
import { shuffle } from "@/lib/utils";
const baseImageUrl = "https://image.tmdb.org/t/p/original";
const trendingTvUrl =
  "https://api.themoviedb.org/3/trending/tv/day?language=en-US";
const trendingMoviesUrl =
  "https://api.themoviedb.org/3/trending/movie/day?language=en-US";
const MAX_POPULARITY = 250;
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
  },
  cache: "force-cache",
};

export async function getBackgrounds() {
  let [res1, res2] = await Promise.all([
    fetch(trendingTvUrl, options).then((response) => response.json()),
    fetch(trendingMoviesUrl, options).then((response) => response.json()),
  ]);

  const backdropUrls = [];
  for (let i in res1.results) {
    if (
      res1.results[i].popularity > MAX_POPULARITY &&
      res2.results[i].popularity > MAX_POPULARITY
    )
      backdropUrls.push(
        `https://image.tmdb.org/t/p/original${res1.results[i].backdrop_path}`,
        `https://image.tmdb.org/t/p/original${res2.results[i].backdrop_path}`,
      );
  }

  shuffle(backdropUrls);
  return backdropUrls;
}
