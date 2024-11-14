import { shuffle } from "@/lib/utils";
import { baseApiUrl, baseImageUrl, options } from "@/lib/constants";
import {
  MovieResult,
  MovieResultsResponse,
  TrendingResponse,
  TvResult,
  TvResultsResponse,
} from "@/types/request-types";

const trendingTvUrl = `${baseApiUrl}/trending/tv/day?language=en-US`;
const trendingMoviesUrl = `${baseApiUrl}/trending/movie/day?language=en-US`;
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
      backdropUrls.push(`${baseImageUrl}${item.backdrop_path}`);
  });

  res2.results?.forEach((item) => {
    if (item.popularity! > MIN_POPULARITY)
      backdropUrls.push(`${baseImageUrl}${item.backdrop_path}`);
  });

  // shuffle(backdropUrls);
  return backdropUrls;
}
