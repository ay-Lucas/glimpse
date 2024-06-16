"use server";
import { options, shuffle } from "@/lib/utils";
const baseImageUrl = "https://image.tmdb.org/t/p/original";
const trendingTvUrl =
  "https://api.themoviedb.org/3/trending/tv/day?language=en-US";
const trendingMoviesUrl =
  "https://api.themoviedb.org/3/trending/movie/day?language=en-US";
const MAX_POPULARITY = 250;

export async function getBackgrounds() {
  let [res1, res2] = await Promise.all([
    fetch(trendingTvUrl, options).then((response) => response.json()),
    fetch(trendingMoviesUrl, options).then((response) => response.json()),
  ]);

  const backdropUrls = [];
  for (let i in res1.results) {
    // if (
    //   // res1.results[i].popularity > MAX_POPULARITY &&
    //   // res2.results[i].popularity > MAX_POPULARITY
    // )
    backdropUrls.push(
      `https://image.tmdb.org/t/p/original${res1.results[i].poster_path}`,
      `https://image.tmdb.org/t/p/original${res2.results[i].poster_path}`,
    );
  }
  console.log(res1);
  shuffle(backdropUrls);
  return backdropUrls;
}
