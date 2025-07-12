"server only";
// import { getWatchlistsAndItems } from "@/lib/actions";
import { BASE_API_URL, options } from "@/lib/constants";
import {
  FullMovie,
  FullPerson,
  FullTv,
  GroupedProvider,
} from "@/types/camel-index";
import {
  MovieReviewsResponse,
  PersonResult,
  ReleaseDate,
  SearchRequest,
  TvReviewsResponse,
  TvSeasonResponse,
} from "@/types/request-types-snakecase";
import {
  MovieResult,
  TvResult,
  SearchPersonResponse,
  MovieResultsResponse,
  TvResultsResponse,
  ShowContentRatingResponse,
  MovieReleaseDatesResponse,
} from "@/types/request-types-camelcase";
import camelcaseKeys from "camelcase-keys";
import { unstable_cache } from "next/cache";
import {
  fetchTmdbMovieLists,
  fetchTmdbTvLists,
  getTrendingPages,
} from "@/app/discover/actions";
import { scrubByMaxRes } from "@/lib/scrub-streams";
import { getJustWatchInfoFromDb } from "@/lib/actions";
import {
  TmdbMovieDetailsResponseAppended,
  TmdbPersonDetailsAppended,
  TmdbTvDetailsResponseAppended,
} from "@/types/tmdb-camel";
// Don't import React cache: /scripts/revalidate.ts throws error

export const fetchPersonDetails = unstable_cache(
  async (
    id: number,
    resOptions: RequestInit = options
  ): Promise<TmdbPersonDetailsAppended> => {
    const res = await fetch(
      `${BASE_API_URL}/person/${id}?append_to_response=combined_credits,movie_credits,tv_credits,images,tagged_images,external_ids`,
      resOptions
    );
    const data = await res.json();
    const camel = camelcaseKeys(data, {
      deep: true,
    }) as TmdbPersonDetailsAppended;
    return camel;
  }
);

export const fetchTvDetails = unstable_cache(
  async (
    id: number,
    resOptions: RequestInit = options
  ): Promise<TmdbTvDetailsResponseAppended> => {
    try {
      const res = await fetch(
        `${BASE_API_URL}/tv/${id}?append_to_response=videos,images,releases,content_ratings,credits,aggregate_credits,episode_groups,watch/providers,external_ids,similar&language=en`,
        resOptions
      );
      const data = await res.json();

      // data.watchProviders = watchProviders;
      let dataFixed = {
        ...data,
        watchProviders: data["watch/providers"],
      };
      delete dataFixed["watch/providers"];
      // camelCase everything else
      const camel = camelcaseKeys(dataFixed, {
        deep: true,
        exclude: [/^[A-Z]{2}$/],
      });
      // fix up dates, etc…
      if (camel.firstAirDate) camel.firstAirDate = new Date(camel.firstAirDate);
      camel.tmdbId = camel.id;
      return camel as TmdbTvDetailsResponseAppended;
    } catch (err) {
      console.error("fetchTvDetails failed for,", id, err);
      throw err;
    }
  },
  [],
  {
    revalidate: 36000, // 10 hours
  }
);

export const fetchMovieDetails = unstable_cache(
  async (
    id: number,
    resOptions: RequestInit = options
  ): Promise<TmdbMovieDetailsResponseAppended> => {
    try {
      const res = await fetch(
        `${BASE_API_URL}/movie/${id}` +
          `?append_to_response=videos,images,releases,release_dates,credits,aggregate_credits,` +
          `watch/providers,external_ids,similar&language=en`,
        resOptions
      );
      const data = await res.json();

      // data.watchProviders = watchProviders;
      let dataFixed = {
        ...data,
        watchProviders: data["watch/providers"],
      };

      delete dataFixed["watch/providers"];

      // camelCase everything else
      const camel = camelcaseKeys(dataFixed, {
        deep: true,
        exclude: [/^[A-Z]{2}$/],
      });

      // fix up dates, etc…
      if (camel.releaseDate) camel.releaseDate = new Date(camel.releaseDate);
      camel.tmdbId = camel.id;
      return camel as TmdbMovieDetailsResponseAppended;
    } catch (err) {
      console.error("fetchMovieDetails failed for,", id, err);
      throw err;
    }
  },
  [],
  {
    revalidate: 36000, // 10 hours
  }
);

export async function getReviews(
  type: "tv" | "movie",
  id: number,

  resOptions: RequestInit = options
): Promise<MovieReviewsResponse | TvReviewsResponse> {
  const res = await fetch(`${BASE_API_URL}/${type}/${id}/reviews`, resOptions);
  return res.json();
}

export async function fetchSimilarMovies(
  id: number,
  resOptions: RequestInit = options
): Promise<MovieResultsResponse | undefined> {
  try {
    const res = await fetch(`${BASE_API_URL}/movie/${id}/similar`, resOptions);
    const data = await res.json();
    const camel = camelcaseKeys(data, {
      deep: true,
    });
    return camel;
  } catch (error) {
    console.error(`Error fetching similar movies with id: ${id}`);
  }
}

export async function getRecommendations(
  id: number,
  type: "tv" | "movie",
  resOptions: RequestInit = options
): Promise<MovieResultsResponse | TvResultsResponse | undefined> {
  try {
    const res = await fetch(
      `${BASE_API_URL}/${type}/${id}/recommendations`,
      resOptions
    );
    const data = await res.json();
    const camel = camelcaseKeys(data, {
      deep: true,
    });
    // const camel = camelcaseKeys<Record<string, unknown>>(data, {
    //   deep: true,
    // });
    return camel;
  } catch (error) {
    console.error(`Error fetching recommendations for ${type} with id: ${id}`);
  }
}

export async function fetchTvContentRatings(
  id: number,
  resOptions: RequestInit = options
): Promise<ShowContentRatingResponse | undefined> {
  try {
    const res = await fetch(
      `${BASE_API_URL}/tv/${id}/content_ratings`,
      resOptions
    );

    const data = await res.json();
    const camel = camelcaseKeys(data, {
      deep: true,
    });
    return camel;
  } catch (error) {
    console.error("Error fetching content ratings");
  }
}

export async function fetchMovieReleaseDates(
  id: number,
  resOptions: RequestInit = options
): Promise<ShowContentRatingResponse | MovieReleaseDatesResponse | undefined> {
  try {
    const res = await fetch(
      `${BASE_API_URL}/movie/${id}/release_dates`,
      resOptions
    );

    const data = await res.json();
    const camel = camelcaseKeys(data, {
      deep: true,
    });
    return camel;
  } catch (error) {
    console.error("Error fetching content ratings");
  }
}

export async function getSeasonData(
  id: number,
  seasonNumber: number,
  resOptions: RequestInit = options
): Promise<TvSeasonResponse> {
  const res = await fetch(
    `${BASE_API_URL}/tv/${id}/season/${seasonNumber}`,
    resOptions
  );
  return res.json();
}

export async function fetchNetworkDetails(id: number) {
  const res = await fetch(`${BASE_API_URL}/network/${id}`);
  if (!res.ok) throw new Error("Failed to fetch network");
  return res.json(); // has .homepage
}

export async function fetchCompanyDetails(id: number) {
  const res = await fetch(`${BASE_API_URL}/company/${id}`);
  if (!res.ok) throw new Error("Failed to fetch company");
  return res.json(); // has .homepage
}

export async function fetchSearchPerson(
  request: SearchRequest,
  reqOptions: RequestInit = options
) {
  try {
    const res = await fetch(
      `${BASE_API_URL}/search/person?query=${request.query}&include_adult=true&language=en-US&page=${request.page}`,
      reqOptions
    );
    const data = await res.json();
    const camel = camelcaseKeys(data, { deep: true });
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
    {
      trendingMoviesDaily,
      trendingMoviesWeekly,
      popularMovies,
      upcomingMovies,
    },
  ] = await Promise.all([fetchTmdbMovieLists(reqOptions)]);

  function getIds(discoverItemArrays: Array<MovieResult[]>) {
    const discoverItems = discoverItemArrays.flat(1);
    return discoverItems.map((item) => ({ id: String(item.id) }));
  }

  return getIds([
    trendingMoviesDaily,
    trendingMoviesWeekly,
    popularMovies,
    upcomingMovies,
  ]);
}

export async function fetchDiscoverTvIds(reqOptions: RequestInit = options) {
  const [{ trendingTvDaily, trendingTvWeekly, popularTv }] = await Promise.all([
    fetchTmdbTvLists(reqOptions),
  ]);

  function getIds(discoverItemArrays: Array<TvResult[]>) {
    const discoverItems = discoverItemArrays.flat(1);
    return discoverItems.map((item) => ({ id: String(item.id) }));
  }

  return getIds([trendingTvDaily, trendingTvWeekly, popularTv]);
}

export async function fetchTopPeopleIds(reqOptions: RequestInit = options) {
  const trendingPeople = (await getTrendingPages(
    { media_type: "person", time_window: "day", page: 1 },
    6,
    true,
    reqOptions
  )) as PersonResult[];

  const trendingPeopleIds = trendingPeople.map((item) => ({
    id: String(item.id),
  }));

  return trendingPeopleIds;
}
