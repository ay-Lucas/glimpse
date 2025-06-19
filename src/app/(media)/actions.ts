"server only";
// import { getWatchlistsAndItems } from "@/lib/actions";
import { BASE_API_URL, NUM_OF_POPULAR_PEOPLE_PAGES, options } from "@/lib/constants";
import { FullMovie, FullPerson, FullTv } from "@/types/camel-index";
import {
  MovieContentRatingResponse,
  MovieResponseAppended,
  MovieResultsResponse,
  MovieReviewsResponse,
  PersonPopularResponse,
  PersonResult,
  SearchRequest,
  ShowContentRatingResponse,
  ShowResponseAppended,
  TvResultsResponse,
  TvReviewsResponse,
  TvSeasonResponse,
} from "@/types/request-types-snakecase";
import {
  MovieResult,
  TvResult,
  SearchPersonResponse,
} from "@/types/request-types-camelcase";
import camelcaseKeys from "camelcase-keys";
import { unstable_cache } from "next/cache";
import { fetchTmdbMovieLists, fetchTmdbTvLists, getTrendingPages } from "@/app/discover/actions";
import JustWatch from 'justwatch-api-client';

export const fetchPersonDetails = unstable_cache(async (
  id: number,
  resOptions: RequestInit = options,
): Promise<FullPerson> => {
  const res = await fetch(`${BASE_API_URL}/person/${id}?append_to_response=combined_credits,movie_credits,tv_credits,images,tagged_images`, resOptions);
  const data = await res.json();
  const camel = camelcaseKeys(data, {
    deep: true,
  }) as FullPerson;
  console.log(camel)
  return camel;
})

export const fetchTvDetails = unstable_cache(async (
  id: number,
  resOptions: RequestInit = options,
): Promise<FullTv> => {
  try {
    const res = await fetch(
      `${BASE_API_URL}/tv/${id}?append_to_response=videos,releases,content_ratings,credits,aggregate_credits,episode_groups,watch/providers&language=en-US`,
      resOptions,
    );
    const data = await res.json();

    // data.watchProviders = watchProviders;
    let dataFixed = {
      ...data,
      watchProviders: data["watch/providers"]
    };
    delete dataFixed["watch/providers"];
    // camelCase everything else
    const camel = camelcaseKeys<Record<string, unknown>>(dataFixed, {
      deep: true,
      exclude: [/^[A-Z]{2}$/]
    }) as FullTv;

    // fix up dates, etc…
    if (camel.firstAirDate) camel.firstAirDate = new Date(camel.firstAirDate);
    camel.tmdbId = camel.id;
    camel.id = -1;
    return camel as FullTv;
  } catch (err) {
    console.error("fetchTvDetails failed for,", id, err)
    throw err;
  }
}, [],
  {
    revalidate: 36000,  // 10 hours
  }
);

export const fetchMovieDetails = unstable_cache(async (
  id: number,
  resOptions: RequestInit = options,
): Promise<FullMovie> => {
  try {
    const res = await fetch(
      `${BASE_API_URL}/movie/${id}` +
      `?append_to_response=videos,releases,content_ratings,credits,aggregate_credits,` +
      `episode_groups,watch/providers&language=en-US`,
      resOptions,
    );
    const data = await res.json();

    // data.watchProviders = watchProviders;
    let dataFixed = {
      ...data,
      watchProviders: data["watch/providers"]
    };

    delete dataFixed["watch/providers"];

    // camelCase everything else
    const camel = camelcaseKeys<Record<string, unknown>>(dataFixed, {
      deep: true,
      exclude: [/^[A-Z]{2}$/]
    }) as FullMovie;

    // fix up dates, etc…
    if (camel.releaseDate) camel.releaseDate = new Date(camel.releaseDate);
    return camel as FullMovie;
  } catch (err) {
    console.error("fetchMovieDetails failed for,", id, err)
    throw err;
  }
}, [],
  {
    revalidate: 36000,  // 10 hours
  }
)

export async function getReviews(
  type: "tv" | "movie",
  id: number,

  resOptions: RequestInit = options,
): Promise<MovieReviewsResponse | TvReviewsResponse> {
  const res = await fetch(`${BASE_API_URL}/${type}/${id}/reviews`, resOptions);
  return res.json();
}

export async function getRecommendations(
  id: number,
  type: "tv" | "movie",
  resOptions: RequestInit = options,
): Promise<MovieResultsResponse | TvResultsResponse | undefined> {
  try {
    const res = await fetch(
      `${BASE_API_URL}/${type}/${id}/recommendations`,
      resOptions,
    );
    return res.json();
  } catch (error) {
    console.error(`Error fetching recommendations for ${type} with id: ${id}`);
  }
}

export async function getContentRating(
  type: "tv" | "movie",
  id: number,
  resOptions: RequestInit = options,
): Promise<ShowContentRatingResponse | MovieContentRatingResponse | undefined> {
  try {
    const res = await fetch(
      `${BASE_API_URL}/${type}/${id}/${type === "tv" ? "content_ratings" : "releases"}`,
      resOptions,
    );
    return res.json();
  } catch (error) {
    console.error("Error fetching content ratings");
  }
}

export async function getSeasonData(
  id: number,
  seasonNumber: number,
  resOptions: RequestInit = options,
): Promise<TvSeasonResponse> {
  const res = await fetch(
    `${BASE_API_URL}/tv/${id}/season/${seasonNumber}`,
    resOptions,
  );
  return res.json();
}


export async function fetchSearchPerson(request: SearchRequest, reqOptions: RequestInit = options) {
  try {
    const res = await fetch(
      `${BASE_API_URL}/search/person?query=${request.query}&include_adult=true&language=en-US&page=${request.page}`,
      reqOptions,
    );
    const data = await res.json();
    const camel = camelcaseKeys(data, { deep: true })
    return camel as Promise<SearchPersonResponse>;
  } catch (error) {
    console.error("Error fetching search person");
  }
}

// export async function getWatchlistsWithItem(
//   watchlistItem: ShowResponseAppended | MovieResponseAppended,
//   userId: string,
// ) {
//   const watchlists = await getWatchlistsAndItems(userId);
//   // const watchlistsWithItem = watchlists.map((watchlist) => {
//   //   if (watchlist.items.some((item) => item.tmdbId === watchlistItem.tmdbId)) {
//   //     return watchlist;
//   //   }
//   // });
//   const watchlistsWithItem = watchlists.filter((watchlist) =>
//     watchlist.items.some((item) => item.tmdbId === watchlistItem.id),
//   );
//   if (watchlistsWithItem.length < 1) return undefined;
//   return watchlistsWithItem;
// }


export async function fetchDiscoverMovieIds(reqOptions: RequestInit = options) {
  const [
    { trendingMoviesDaily, trendingMoviesWeekly, popularMovies, upcomingMovies },
  ] = await Promise.all([
    fetchTmdbMovieLists(reqOptions),
  ]);

  function getIds(discoverItemArrays: Array<MovieResult[]>) {
    const discoverItems = discoverItemArrays.flat(1);
    return discoverItems.map(item => ({ id: String(item.id) }));
  }

  return getIds([trendingMoviesDaily, trendingMoviesWeekly, popularMovies, upcomingMovies]);
}

export async function fetchDiscoverTvIds(reqOptions: RequestInit = options) {
  const [
    { trendingTvDaily, trendingTvWeekly, popularTv },
  ] = await Promise.all([
    fetchTmdbTvLists(reqOptions),
  ]);

  function getIds(discoverItemArrays: Array<TvResult[]>) {
    const discoverItems = discoverItemArrays.flat(1);
    return discoverItems.map(item => ({ id: String(item.id) }));
  }

  return getIds([trendingTvDaily, trendingTvWeekly, popularTv]);
}

export async function fetchTopPeopleIds(reqOptions: RequestInit = options) {
  const trendingPeople = await getTrendingPages({ media_type: "person", time_window: "day", page: 1 },
    6, true, reqOptions
  ) as PersonResult[];

  const trendingPeopleIds = trendingPeople.map(item => ({ id: String(item.id) }))

  return trendingPeopleIds;
}

export const getPersonPopularityStats = unstable_cache(
  async (pages = NUM_OF_POPULAR_PEOPLE_PAGES): Promise<{ sortedScores: number[] }> => {
    const requests: Promise<PersonPopularResponse>[] = Array.from({ length: pages }, (_, i) =>
      fetch(`${BASE_API_URL}/person/popular?page=${i + 1}`, options).then(r => r.json())
    );
    const results = (await Promise.all(requests))
      .flatMap((page) => page.results ?? []);
    const sortedScores = results
      .map(p => p?.popularity)
      .sort((a, b) => a - b);
    return { sortedScores };
  },
  [], // no args
  { revalidate: 60 * 60 * 12 } // cache for 12h
);

export async function getPersonRank(targetPopularity: number) {
  const { sortedScores } = await getPersonPopularityStats();
  // make a copy sorted from high→low
  const sortedDesc = [...sortedScores].sort((a, b) => b - a);
  // find your position: first entry that’s ≤ your score
  const idx = sortedDesc.findIndex((s) => s <= targetPopularity);
  if (idx === -1) return null; // not in top list
  // +1 because index 0 → rank #1
  return idx + 1;
}

export async function getPersonPercentile(targetPopularity: number) {
  const { sortedScores } = await getPersonPopularityStats();
  const sortedDesc = [...sortedScores].sort((a, b) => b - a);
  const idx = sortedDesc.findIndex((s) => s <= targetPopularity);
  if (idx === -1) return null; // not in top list
  const total = sortedDesc.length;
  // idx 0 → top: 100%, idx = total-1 → bottom: 0%
  return Math.round((1 - idx / (total - 1)) * 100);
}


export const fetchDirectOffers = unstable_cache(async (tmdbTitle: string, type: 'movie' | 'show', releaseDate?: Date | null,) => {
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : null;
  // 1) Search JustWatch for your title
  const justwatch = new JustWatch(5000);
  // Search for a movie/show (with optional country code, default is "IN")
  const searchResults = await justwatch.searchByQuery(tmdbTitle, "US")
  const matches = searchResults.filter(item => item.title?.toLowerCase() === tmdbTitle.toLowerCase()
    && item.fullPath
    && (releaseYear ? item.originalReleaseYear === releaseYear : true))
  const firstMatch = matches[0];
  // console.log(searchResults)
  // console.log(firstMatch)
  const data = firstMatch?.fullPath && await justwatch.getData(firstMatch.fullPath, "US")
  return data
})
