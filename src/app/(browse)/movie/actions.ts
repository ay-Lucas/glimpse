import { BASE_API_URL, options } from "@/lib/constants";
import { hasGenre, hasPoster, isEnglish } from "@/lib/filters";
import {
  MovieResult,
  MovieResultsResponse,
  DiscoverMovieResponse,
} from "@/types/request-types-camelcase";
import camelcaseKeys from "camelcase-keys";
import { getTrendingPages } from "../discover/actions";
import { GENRES } from "@/lib/title-genres";
import { uniqueById } from "@/components/title-carousel";
import { DiscoverMovieRequest } from "@/types/request-types-snakecase";

const NUM_MOVIE_PAGES = 3;

export const fetchTopRatedMovies = async (
  page: number
): Promise<MovieResultsResponse> => {
  const res = await fetch(
    `${BASE_API_URL}/movie/top_rated?page=${page}&language=en-US`,
    options
  );
  return res.json();
};

export const fetchNowPlayingMovies = async (
  page: number
): Promise<MovieResultsResponse> => {
  const res = await fetch(
    `${BASE_API_URL}/movie/now_playing?page=${page}&language=en-US&region=US`,
    options
  );
  return res.json();
};

export const fetchUpcomingMovies = async (
  page: number
): Promise<MovieResultsResponse> => {
  const res = await fetch(
    `${BASE_API_URL}/movie/upcoming?page=${page}&language=en-US&region=US`,
    options
  );
  return res.json();
};

export const getMoviePages = async (
  numberOfPages: number,
  fetchFunction: (page: number) => Promise<MovieResultsResponse>,
  camelcase?: boolean
) => {
  const requests = [] as Promise<MovieResultsResponse>[];
  for (let i = 0; i < numberOfPages; i++) {
    requests.push(fetchFunction(i + 1));
  }
  const array = await Promise.all(requests);
  const arrays = array.flatMap((page) => page.results ?? []);

  if (camelcase) {
    return camelcaseKeys(arrays as any, { deep: true }) as MovieResult[];
  }
  return arrays;
};

export async function getTopRatedMovieList() {
  const res = await getMoviePages(NUM_MOVIE_PAGES, fetchTopRatedMovies, true);
  const filtered = res.filter(isEnglish);
  return filtered;
}

export async function getNowPlayingMovieList() {
  const res = await getMoviePages(NUM_MOVIE_PAGES, fetchNowPlayingMovies, true);
  const filtered = res.filter(isEnglish);
  return filtered;
}

export async function getUpcomingMovieList() {
  const res = await getMoviePages(NUM_MOVIE_PAGES, fetchUpcomingMovies, true);
  const filtered = res.filter(isEnglish);
  return filtered;
}

export async function fetchDiscoverMovie(
  params: DiscoverMovieRequest
): Promise<MovieResult[]> {
  const discoverParams = new URLSearchParams(Object.entries(params));
  const res = await fetch(
    `${BASE_API_URL}/discover/movie?${discoverParams}`,
    options
  );
  const json = await res.json();
  const camel = camelcaseKeys(json, { deep: true }) as DiscoverMovieResponse;
  return camel.results ?? [];
}

export async function getTrendingMoviesByGenre(
  genreId: number,
  timeWindow: "day" | "week" = "week",
  pages = 1
): Promise<MovieResult[]> {
  const res = (await getTrendingPages(
    { media_type: "movie", page: 1, time_window: timeWindow },
    pages
  )) as MovieResult[];
  const uniq = uniqueById(res);
  const filtered = uniq.filter(
    (item) => isEnglish(item) && hasGenre(item, genreId) && hasPoster(item)
  );
  return filtered;
}

export async function trendingMoviesByGenreSmart(
  genreId: number,
  trendingPages: number = 1,
  discoverPages: number = 6,
  keywords: number[] = [],
  limit = 40,
  withoutGenres: number[] = []
): Promise<MovieResult[]> {
  const trending = await getTrendingMoviesByGenre(genreId, "week", trendingPages);

  const discoverReq: DiscoverMovieRequest = {
    with_genres: String(genreId),
    language: "en-US",
    sort_by: "popularity.desc",
    watch_region: "US",
    with_keywords: String(keywords ? keywords.join("|") : ""),
    without_genres: String(withoutGenres.join("|")),
  } as DiscoverMovieRequest;

  const requests: Promise<MovieResult[]>[] = [];
  for (let i = 0; i < discoverPages; i++) {
    requests.push(fetchDiscoverMovie({ ...discoverReq, page: i + 1 }));
  }

  const discover = (await Promise.all(requests)).flatMap((page) => page ?? []);
  const unique = uniqueById([...trending, ...discover]);
  const filteredTitles = unique.filter((t) => isEnglish(t) && hasPoster(t));
  return filteredTitles.slice(0, limit);
}

