"server only";
import { getWatchlistsAndItems } from "@/lib/actions";
import { BASE_API_URL, options } from "@/lib/constants";
import { Item } from "@/types";
import {
  FindRequest,
  IdAppendToResponseRequest,
  MovieContentRatingResponse,
  MovieResponseAppended,
  MovieResultsResponse,
  MovieReviewsResponse,
  Person,
  ShowContentRatingResponse,
  ShowResponseAppended,
  TvResultsResponse,
  TvReviewsResponse,
} from "@/types/request-types";
import { Session } from "next-auth";

export async function getData(
  request: FindRequest,
  type: "tv" | "movie" | "person",
): Promise<MovieResponseAppended | ShowResponseAppended | Person> {
  const res = await fetch(
    `${BASE_API_URL}/${type}/${request.id}?append_to_response=videos,releases,content_ratings,credits,aggregate_credits,episode_groups,watch/providers&language=en-US`,
    options,
  );
  return res.json();
}

export async function getPersonData(
  request: IdAppendToResponseRequest,
): Promise<Person> {
  const res = await fetch(`${BASE_API_URL}/person/${request.id}`, options);
  return res.json();
}

export async function getShowData(
  request: IdAppendToResponseRequest,
): Promise<ShowResponseAppended> {
  const res = await fetch(
    `${BASE_API_URL}/show/${request.id}?append_to_response=content_ratings,credits`,
    options,
  );
  return res.json();
}

export async function getMovieData(
  request: IdAppendToResponseRequest,
): Promise<MovieResponseAppended> {
  const res = await fetch(
    `${BASE_API_URL}/movie/${request.id}?append_to_response=releases,credits`,
    options,
  );
  return res.json();
}

export async function getReviews(
  type: "tv" | "movie",
  id: number,
): Promise<MovieReviewsResponse | TvReviewsResponse> {
  const res = await fetch(`${BASE_API_URL}/${type}/${id}/reviews`, options);
  return res.json();
}

export async function getRecommendations(
  id: number,
  type: "tv" | "movie",
): Promise<MovieResultsResponse | TvResultsResponse | undefined> {
  try {
    const res = await fetch(
      `${BASE_API_URL}/${type}/${id}/recommendations`,
      options,
    );
    return res.json();
  } catch (error) {
    console.error(`Error fetching recommendations for ${type} with id: ${id}`);
  }
}

export async function getContentRating(
  type: "tv" | "movie",
  id: number,
): Promise<ShowContentRatingResponse | MovieContentRatingResponse | undefined> {
  try {
    const res = await fetch(
      `${BASE_API_URL}/${type}/${id}/${type === "tv" ? "content_ratings" : "releases"}`,
      options,
    );
    return res.json();
  } catch (error) {
    console.error("Error fetching content ratings");
  }
}

export async function getSeasonData(id: number, seasonNumber: number) {
  const res = await fetch(
    `${BASE_API_URL}/tv/${id}/season/${seasonNumber}`,
    options,
  );
  return res.json();
}

export async function getWatchlistsWithItem(
  watchlistItem: Item,
  userId: string,
) {
  const watchlists = await getWatchlistsAndItems(userId);
  // const watchlistsWithItem = watchlists.map((watchlist) => {
  //   if (watchlist.items.some((item) => item.tmdbId === watchlistItem.tmdbId)) {
  //     return watchlist;
  //   }
  // });
  const watchlistsWithItem = watchlists.filter((watchlist) =>
    watchlist.items.some((item) => item.tmdbId === watchlistItem.tmdbId),
  );
  if (watchlistsWithItem.length < 1) return undefined;
  return watchlistsWithItem;
}
