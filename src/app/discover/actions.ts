"server only";

import { BASE_API_URL, NUM_TMDB_PAGES, options } from "@/lib/constants";
import {
  DiscoverMovieRequest,
  DiscoverTvRequest,
  TrendingRequest,
  TrendingResponse,
  UpcomingMoviesRequest,
} from "@/types/request-types-snakecase";

import camelcaseKeys from "camelcase-keys";
import {
  Cast,
  MovieResult,
  PersonResult,
  TvResult,
  UpcomingMoviesResponse,
} from "@/types/request-types-camelcase";
import { TMDB_TV_GENRES_MAP, TV_GENRES } from "@/lib/title-genres";

export const getTrending = async (
  request: TrendingRequest,
  reqOptions: RequestInit = options
): Promise<TrendingResponse> => {
  const res = await fetch(
    `${BASE_API_URL}/trending/${request.media_type}/${request.time_window}?page=${request.page}&language=en-US`,
    reqOptions
  );
  return res.json();
};

export const getTrendingPages = async (
  request: TrendingRequest,
  numberOfPages: number,
  camelcase?: boolean,
  reqOptions: RequestInit = options
) => {
  const requests = [];
  for (let i = 0; i < numberOfPages; i++) {
    requests.push(
      getTrending(
        {
          media_type: request.media_type,
          time_window: request.time_window,
          page: i + 1,
        },
        reqOptions
      )
    );
  }
  const array = await Promise.all(requests);
  const arrays = array.flatMap((page) => page.results);

  if (camelcase) {
    return camelcaseKeys(arrays as any, { deep: true }) as
      | MovieResult[]
      | TvResult[]
      | PersonResult[];
  }
  return arrays;
};

export const getPopular = async (
  request: DiscoverMovieRequest | DiscoverTvRequest,
  mediaType: "movie" | "tv",
  camelcase?: boolean,
  reqOptions: RequestInit = options
) => {
  const res = await fetch(
    `${BASE_API_URL}/discover/${mediaType}?include_adult=false&language=en-US&region=US&page=${request.page}&sort_by=popularity.desc&vote_average.gte=${request["vote_average.gte"]}&with_original_language=en`,
    reqOptions
  );
  const data = await res.json();

  if (camelcase) {
    return camelcaseKeys(data, { deep: true });
  }
  return data;
};

export const getPopularPages = async (
  request: DiscoverMovieRequest | DiscoverTvRequest,
  mediaType: "movie" | "tv",
  numberOfPages: number,
  camelcase?: boolean,
  reqOptions: RequestInit = options
) => {
  const requests = [];
  for (let i = 0; i < numberOfPages; i++) {
    requests.push(
      getPopular(
        {
          page: i + 1,
        },
        mediaType,
        true,
        reqOptions
      )
    );
  }
  const array = await Promise.all(requests);
  const arrays = array.flatMap((page) => page.results);

  if (camelcase) {
    console.log("getPopularPages called");
    return camelcaseKeys(arrays as any, { deep: true }) as
      | MovieResult[]
      | TvResult[];
  }
  return arrays;
};

export const getUpcomingMovies = async (
  request: UpcomingMoviesRequest,
  camelcase?: boolean,
  reqOptions: RequestInit = options
) => {
  const today = new Date().toISOString().split("T")[0];
  const res = await fetch(
    `${BASE_API_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&region=US&&page=${request.page}&primary_release_date.gte=${today}&release_date.gte=2024-06-26&sort_by=popularity.desc`,
    reqOptions
  );
  const data = await res.json();

  if (camelcase) return camelcaseKeys(data, { deep: true });
  // exclude: [/^[A-Z]{2}$/]
  return data;
};

export async function fetchTmdbMovieLists(reqOptions: RequestInit = options) {
  const [
    { trendingMoviesDaily, trendingMoviesWeekly },
    popularMoviesRes,
    upcomingMoviesRes,
  ] = await Promise.all([
    fetchTrendingMovies(),
    getPopularPages(
      { "vote_average.gte": 6 },
      "movie",
      NUM_TMDB_PAGES,
      true,
      reqOptions
    ) as Promise<MovieResult[]>,
    getUpcomingMovies(
      { page: 1 },
      true,
      reqOptions
    ) as Promise<UpcomingMoviesResponse>,
  ]);

  const upcomingMovies =
    upcomingMoviesRes.results?.filter(
      (item) => item.originalLanguage?.toUpperCase() === "EN"
    ) ?? [];

  const trendingMovieIds = new Set([
    ...trendingMoviesDaily.map((item) => item.id),
    ...trendingMoviesWeekly.map((item) => item.id),
  ]);

  // Dedupe popular from trending
  const popularMovies =
    popularMoviesRes?.filter((item) => !trendingMovieIds.has(item.id)) ?? [];

  return {
    trendingMoviesDaily,
    trendingMoviesWeekly,
    popularMovies,
    upcomingMovies,
  };
}

export async function fetchTmdbTvLists(reqOptions: RequestInit = options) {
  const [{ trendingTvDaily, trendingTvWeekly }, popularTvRes] =
    await Promise.all([
      fetchTrendingTv(),
      getPopularPages(
        { "vote_average.gte": 6 },
        "tv",
        NUM_TMDB_PAGES,
        true,
        reqOptions
      ) as Promise<TvResult[]>,
    ]);

  const trendingTvIds = new Set([
    ...trendingTvDaily.map((item) => item.id),
    ...trendingTvWeekly.map((item) => item.id),
  ]);

  // Dedupe popular from trending
  const popularTv =
    popularTvRes?.filter((item) => !trendingTvIds.has(item.id)) ?? [];

  return { trendingTvDaily, trendingTvWeekly, popularTv };
}

export async function fetchTrendingTv(reqOptions: RequestInit = options) {
  const [trendingTvDailyRes, trendingTvWeeklyRes] = await Promise.all([
    getTrendingPages(
      { media_type: "tv", time_window: "day", page: 1 },
      NUM_TMDB_PAGES,
      true,
      reqOptions
    ) as Promise<TvResult[]>,
    getTrendingPages(
      { media_type: "tv", time_window: "week", page: 1 },
      NUM_TMDB_PAGES,
      true,
      reqOptions
    ) as Promise<TvResult[]>,
  ]);

  const trendingTvWeekly = trendingTvWeeklyRes.filter(
    (item) =>
      item.originalLanguage?.toUpperCase() === "EN" &&
      new Date(item.firstAirDate ?? Date.now()).valueOf() < new Date().valueOf()
  );

  const trendingTvDaily = trendingTvDailyRes.filter(
    (item) =>
      item.originalLanguage?.toUpperCase() === "EN" &&
      new Date(item.firstAirDate ?? Date.now()).valueOf() < new Date().valueOf()
  );

  return { trendingTvDaily, trendingTvWeekly };
}

export async function fetchTrendingMovies(reqOptions: RequestInit = options) {
  const [trendingMoviesDailyRes, trendingMoviesWeeklyRes] = await Promise.all([
    getTrendingPages(
      { media_type: "movie", time_window: "day", page: 1 },
      NUM_TMDB_PAGES,
      true,
      reqOptions
    ) as Promise<MovieResult[]>,
    getTrendingPages(
      { media_type: "movie", time_window: "week", page: 1 },
      NUM_TMDB_PAGES,
      true,
      reqOptions
    ) as Promise<MovieResult[]>,
  ]);

  const trendingMoviesWeekly = trendingMoviesWeeklyRes.filter(
    (item) =>
      item.originalLanguage?.toUpperCase() === "EN" &&
      new Date(item.releaseDate ?? Date.now()).valueOf() < new Date().valueOf()
  );
  const trendingMoviesDaily = trendingMoviesDailyRes.filter(
    (item) =>
      item.originalLanguage?.toUpperCase() === "EN" &&
      new Date(item.releaseDate ?? Date.now()).valueOf() < new Date().valueOf()
  );

  return { trendingMoviesDaily, trendingMoviesWeekly };
}

export async function fetchAllMovies(reqOptions?: RequestInit) {
  const lists = await fetchTmdbMovieLists(reqOptions);
  const combined = [
    ...lists.trendingMoviesDaily,
    ...lists.trendingMoviesWeekly,
    ...lists.popularMovies,
    ...lists.upcomingMovies,
  ];

  // Dedupe (weekly and daily trending)
  const seen = new Set<number>();
  return combined.filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });
}

export async function fetchAllTv(reqOptions?: RequestInit) {
  const lists = await fetchTmdbTvLists(reqOptions);
  const combined = [
    ...lists.popularTv,
    ...lists.trendingTvWeekly,
    ...lists.trendingTvDaily,
  ];
  // Dedupe (weekly and daily trending)
  const seen = new Set<number>();
  return combined.filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });
}

export async function fetchDiscoverTitles(reqOptions?: RequestInit) {
  const movies = await fetchAllMovies(reqOptions);
  const tvShows = await fetchAllTv(reqOptions);
  return [...movies, ...tvShows];
}

// export async function getDiscoverCast(reqOptions?: RequestInit) {
//   const discoverTitles = await fetchDiscoverTitles(reqOptions);
//   // const cast = discoverTitles.map(item => item.credits?.cast).filter((item): item is Cast[] => item != null)
//   return cast;
// }
//
// export const fetchTmdbListsCached = unstable_cache(fetchTmdbLists, [], { revalidate: 43200 }) // 12 hours
