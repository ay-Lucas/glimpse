import { BASE_API_URL, options } from "@/lib/constants";
import { hasGenre, hasPoster, isEnglish } from "@/lib/filters";
import {
  TvResult,
  MovieResult,
  TvResultsResponse,
  DiscoverTvResponse,
} from "@/types/request-types-camelcase";
import camelcaseKeys from "camelcase-keys";
import { getTrendingPages } from "../discover/actions";
import { GENRES } from "@/lib/title-genres";
import { uniqueById } from "@/components/title-carousel";
import { DiscoverTvRequest } from "@/types/request-types-snakecase";
const NUM_TV_PAGES = 3;
export const fetchTopRatedTv = async (
  page: number
): Promise<TvResultsResponse> => {
  const res = await fetch(
    `${BASE_API_URL}/tv/top_rated?page=${page}&language=en-US`,
    options
  );
  return res.json();
};

export const fetchOnTheAirTv = async (
  page: number
): Promise<TvResultsResponse> => {
  const res = await fetch(
    `${BASE_API_URL}/tv/on_the_air?page=${page}&language=en-US`,
    options
  );
  return res.json();
};

export const fetchUpcomingTv = async (
  page: number
): Promise<TvResultsResponse> => {
  const url = buildUpcomingTvUrl();
  const res = await fetch(`${url}&page=${page}`, options);
  return res.json();
};

export const getTvPages = async (
  numberOfPages: number,
  fetchFunction: (page: number) => Promise<TvResultsResponse>,
  camelcase?: boolean
) => {
  const requests = [];
  for (let i = 0; i < numberOfPages; i++) {
    requests.push(fetchFunction(i + 1));
  }
  const array = await Promise.all(requests);
  const arrays = array.flatMap((page) => page.results ?? []);

  if (camelcase) {
    return camelcaseKeys(arrays as any, { deep: true }) as TvResult[];
  }
  return arrays;
};

export async function getTopRatedTvList() {
  const res = await getTvPages(NUM_TV_PAGES, fetchTopRatedTv, true);
  const filtered = res.filter(isEnglish);
  return filtered;
}

export async function getOnTheAirTvList() {
  const res = await getTvPages(NUM_TV_PAGES, fetchOnTheAirTv, true);
  const filtered = res.filter(isEnglish);
  return filtered;
}

export async function getUpcomingTvList() {
  const res = await getTvPages(NUM_TV_PAGES, fetchUpcomingTv, true);
  const filtered = res.filter(isEnglish);
  return filtered;
}

export function buildUpcomingTvUrl() {
  const today = new Date().toISOString().slice(0, 10);
  const params = new URLSearchParams({
    "first_air_date.gte": today,
    include_adult: "false",
    include_null_first_air_dates: "false",
    language: "en-US",
    // watch_region: "US",
    // sort_by: "first_air_date.asc",
    // with_status: "1|2|3",
  });

  return `${BASE_API_URL}/discover/tv?${params.toString()}`;
}

export async function fetchDiscoverTv(
  params: DiscoverTvRequest
): Promise<TvResult[]> {
  console.log(`${BASE_API_URL}/discover/tv?${params.toString()}`);
  const discoverParams = new URLSearchParams(Object.entries(params));
  const res = await fetch(
    `${BASE_API_URL}/discover/tv?${discoverParams}`,
    options
  );
  const json = await res.json();
  const camel = camelcaseKeys(json, { deep: true }) as DiscoverTvResponse;
  return camel.results ?? [];
}

export async function getTrendingTvByGenre(
  genreId: number,
  timeWindow: "day" | "week" = "week",
  pages = 1
): Promise<TvResult[]> {
  const res = (await getTrendingPages(
    { media_type: "tv", page: 1, time_window: timeWindow },
    pages,
    true
  )) as TvResult[];
  // de-dupe & filter
  const uniq = uniqueById(res);
  const filtered = uniq.filter(
    (item) => isEnglish(item) && hasGenre(item, genreId) && hasPoster(item)
  );
  return filtered;
}

export async function trendingTvByGenreSmart(
  genreId: number,
  trendingPages: number = 1,
  discoverPages: number = 6,
  keywords: number[] = [],
  limit = 40
): Promise<TvResult[]> {
  const trending = await getTrendingTvByGenre(genreId, "week", trendingPages);

  const discoverTvReq: DiscoverTvRequest = {
    with_genres: String(genreId),
    language: "en-US",
    sort_by: "popularity.desc",
    without_genres: String([GENRES.tv.KIDS, GENRES.tv.FAMILY].join("|")),
    watch_region: "US",
    with_keywords: String(keywords ? keywords.join("|") : ""),
  };

  const requests = [];
  for (let i = 0; i < discoverPages; i++) {
    requests.push(fetchDiscoverTv({ ...discoverTvReq, page: i + 1 }));
  }

  const discover = (await Promise.all(requests)).flatMap((page) => page ?? []);
  console.log(discover);
  const unique = uniqueById([...trending, ...discover]);
  const filteredTitles = unique.filter((t) => isEnglish(t) && hasPoster(t));
  return filteredTitles.slice(0, limit);
  // return unique.sort((a, b) => b.popularity - a.popularity);
}

export async function getSciFiFantasy(pages: number) {
  const requests = [];
  for (let i = 0; i < pages; i++) {
    requests.push(
      fetchDiscoverTv({
        with_genres: String(GENRES.tv.SCI_FI_FANTASY),
        without_genres: String([GENRES.tv.KIDS, GENRES.tv.FAMILY].join("|")),
        page: i + 1,
      })
    );
  }
  const array = await Promise.all(requests);
  const arrays = array.flatMap((page) => page ?? []);
  return camelcaseKeys(arrays as any, { deep: true }) as TvResult[];
}
