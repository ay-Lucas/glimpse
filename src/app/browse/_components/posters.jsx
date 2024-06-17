"use server";
import { options, shuffle } from "@/lib/utils";
const baseImageUrl = "https://image.tmdb.org/t/p/original";
const trendingTvUrl =
  "https://api.themoviedb.org/3/trending/tv/day?language=en-US";
const trendingMoviesUrl =
  "https://api.themoviedb.org/3/trending/movie/day?language=en-US";
const MAX_POPULARITY = 150;

const posters = {
  tv: [],
  movies: [],
  both: [],
};

export async function getBackgrounds() {
  let [tvRes, movieRes] = await Promise.all([
    fetch(trendingTvUrl, options).then((response) => response.json()),
    fetch(trendingMoviesUrl, options).then((response) => response.json()),
  ]);

  for (let i in tvRes.results) {
    const tv = tvRes.results[i];
    const movie = movieRes.results[i];
    if (tv.popularity > MAX_POPULARITY && movie.popularity > MAX_POPULARITY) {
      posters.movies.push(`${baseImageUrl}${movie.poster_path}`);
      posters.tv.push(`${baseImageUrl}${tv.poster_path}`);
      posters.both.push(
        `${baseImageUrl}${tv.poster_path}`,
        `${baseImageUrl}${movie.poster_path}`,
      );
    }
  }
  console.log(tvRes);
  // shuffle(backdropUrls);
  // return backdropUrls;
  return posters;
}
