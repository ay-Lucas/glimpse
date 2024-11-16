import { shuffle } from "@/lib/utils";
import { BASE_API_URL, BASE_IMAGE_URL, options } from "@/lib/constants";
import {
  MovieResult,
  MovieResultsResponse,
  TrendingResponse,
  TvResult,
  TvResultsResponse,
} from "@/types/request-types";

const trendingTvUrl = `${BASE_API_URL}/trending/tv/day?language=en-US`;
const trendingMoviesUrl = `${BASE_API_URL}/trending/movie/day?language=en-US`;
const MIN_POPULARITY = 10;

export async function getBackgrounds() {
  let [res1, res2]: [TvResultsResponse, MovieResultsResponse] =
    await Promise.all([
      fetch(trendingTvUrl, options).then((response) => response.json()),
      fetch(trendingMoviesUrl, options).then((response) => response.json()),
    ]);

  const backdropUrls: string[] = [];

  res1.results?.forEach((item) => {
    if (item.popularity! > MIN_POPULARITY)
      backdropUrls.push(`${BASE_IMAGE_URL}${item.backdrop_path}`);
  });

  res2.results?.forEach((item) => {
    if (item.popularity! > MIN_POPULARITY)
      backdropUrls.push(`${BASE_IMAGE_URL}${item.backdrop_path}`);
  });

  shuffle(backdropUrls);
  return backdropUrls;
}
