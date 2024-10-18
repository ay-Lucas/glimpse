import { shuffle } from "@/lib/utils";
import { baseApiUrl, options } from "@/lib/constants";

const trendingTvUrl = `${baseApiUrl}/trending/tv/day?language=en-US`;
const trendingMoviesUrl = `${baseApiUrl}/trending/movie/day?language=en-US`;
const MIN_POPULARITY = 10;

export async function getBackgrounds() {
  let [res1, res2] = await Promise.all([
    fetch(trendingTvUrl, options).then((response) => response.json()),
    fetch(trendingMoviesUrl, options).then((response) => response.json()),
  ]);

  const backdropUrls = [];
  for (let i in res1.results) {
    if (
      res1.results[i].popularity > MIN_POPULARITY &&
      res2.results[i].popularity > MIN_POPULARITY
    )
      backdropUrls.push(
        `https://image.tmdb.org/t/p/original${res1.results[i].backdrop_path}`,
        `https://image.tmdb.org/t/p/original${res2.results[i].backdrop_path}`,
      );
  }

  shuffle(backdropUrls);
  return backdropUrls;
}
