"server only";
import { baseApiUrl, options } from "@/lib/constants";
import {
  FindRequest,
  MovieResult,
  MovieReviewsResponse,
  TvResult,
  TvReviewsResponse,
} from "@/types/request-types";

export async function getData(
  request: FindRequest,
  type: "tv" | "movie",
): Promise<MovieResult | TvResult> {
  const res = await fetch(
    `${baseApiUrl}/${type}/${request.id}?append_to_response=videos,releases,content_ratings&language=en-US`,
    options,
  );
  return res.json();
}

export async function getReviews(
  request: FindRequest,
  type: "tv" | "movie",
): Promise<MovieReviewsResponse | TvReviewsResponse> {
  const res = await fetch(
    `${baseApiUrl}/${type}/${request.id}/reviews`,
    options,
  );
  return res.json();
}

export async function getRecommendations(id: number, type: "tv" | "movie") {
  const res = await fetch(
    `${baseApiUrl}/${type}/${id}/recommendations`,
    options,
  );
  return res.json();
}

export async function getContentRating(type: "tv" | "movie", id: number) {
  const res = await fetch(
    `${baseApiUrl}/${type}/${id}/${type === "tv" ? "content_ratings" : "releases"}`,
    options,
  );
  return res.json();
}
