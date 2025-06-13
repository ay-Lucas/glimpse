"server only";
// import { getWatchlistsAndItems } from "@/lib/actions";
import { BASE_API_URL, options } from "@/lib/constants";
import { FullMovie, FullPerson, FullTv } from "@/types/camel-index";
import {
  MovieContentRatingResponse,
  MovieResponseAppended,
  MovieResultsResponse,
  MovieReviewsResponse,
  ShowContentRatingResponse,
  ShowResponseAppended,
  TvResultsResponse,
  TvReviewsResponse,
  TvSeasonResponse,
} from "@/types/request-types-snakecase";
import {
  MovieResult,
  TvResult,
} from "@/types/request-types-camelcase";
import camelcaseKeys from "camelcase-keys";
import { unstable_cache } from "next/cache";
import { fetchTmdbMovieLists, fetchTmdbTvLists } from "@/app/discover/actions";

export const fetchPersonDetails = unstable_cache(async (
  id: number,
  resOptions: RequestInit = options,
): Promise<FullPerson> => {
  const res = await fetch(`${BASE_API_URL}/person/${id}?append_to_response=combined_credits,images,tagged_images`, resOptions);
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


export async function fetchDiscoverMovieIds() {
  const [
    { trendingMoviesDaily, trendingMoviesWeekly, popularMovies, upcomingMovies },
  ] = await Promise.all([
    fetchTmdbMovieLists(),
  ]);

  function getIds(discoverItemArrays: Array<MovieResult[]>) {
    const discoverItems = discoverItemArrays.flat(1);
    return discoverItems.map(item => ({ id: String(item.id) }));
  }

  return getIds([trendingMoviesDaily, trendingMoviesWeekly, popularMovies, upcomingMovies]);
  ;
}

export async function fetchDiscoverTvIds() {
  const [
    { trendingTvDaily, trendingTvWeekly, popularTv },
  ] = await Promise.all([
    fetchTmdbTvLists(),
  ]);

  function getIds(discoverItemArrays: Array<TvResult[]>) {
    const discoverItems = discoverItemArrays.flat(1);
    return discoverItems.map(item => ({ id: String(item.id) }));
  }

  return getIds([trendingTvDaily, trendingTvWeekly, popularTv]);
  ;
}

