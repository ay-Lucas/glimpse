"server only";
import { baseApiUrl, options } from "@/lib/constants";
import {
  FindRequest,
  IdAppendToResponseRequest,
  IdPagedRequestParams,
  MovieResponse,
  MovieResponseAppended,
  MovieResult,
  MovieResultsResponse,
  MovieReviewsResponse,
  Person,
  PersonResult,
  SearchPersonResponse,
  ShowResponse,
  ShowResponseAppended,
  TvResult,
  TvResultsResponse,
  TvReviewsResponse,
} from "@/types/request-types";

export async function getData(
  request: FindRequest,
  type: "tv" | "movie" | "person",
): Promise<TvResult | MovieResult | PersonResult> {
  const res = await fetch(
    `${baseApiUrl}/${type}/${request.id}?append_to_response=videos,releases,content_ratings,credits,aggregate_credits&language=en-US`,
    options,
  );
  return res.json();
}

export async function getPersonData(
  request: IdAppendToResponseRequest,
): Promise<Person> {
  const res = await fetch(`${baseApiUrl}/person/${request.id}`, options);
  return res.json();
}

export async function getShowData(
  request: IdAppendToResponseRequest,
): Promise<ShowResponseAppended> {
  const res = await fetch(
    `${baseApiUrl}/show/${request.id}?append_to_response=content_ratings,credits`,
    options,
  );
  return res.json();
}

export async function getMovieData(
  request: IdAppendToResponseRequest,
): Promise<MovieResponseAppended> {
  const res = await fetch(
    `${baseApiUrl}/movie/${request.id}?append_to_response=releases,credits`,
    options,
  );
  return res.json();
}

export async function getReviews(
  type: "tv" | "movie",
  id: number,
): Promise<MovieReviewsResponse | TvReviewsResponse> {
  const res = await fetch(`${baseApiUrl}/${type}/${id}/reviews`, options);
  return res.json();
}

export async function getRecommendations(
  id: number,
  type: "tv" | "movie",
): Promise<MovieResultsResponse | TvResultsResponse> {
  const res = await fetch(
    `${baseApiUrl}/${type}/${id}/recommendations`,
    options,
  );
  return res.json();
}

// export async function getContentRating(type: "tv" | "movie", id: number) {
//   const res = await fetch(
//     `${baseApiUrl}/${type}/${id}/${type === "tv" ? "content_ratings" : "releases"}`,
//     options,
//   );
//   return res.json();
// }
