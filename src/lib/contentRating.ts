export interface ContentRating {
  region: string;
  rating: string;
  descriptors: String[];
}

export const FALLBACK_REGION = "US" as const;

import { pickMovieRating } from "@/app/(media)/movie/[id]/utils";
import { pickTvRating } from "@/app/(media)/tv/[id]/utils";
import {
  RatingResponse,
  ReleaseDateResponse,
} from "@/types/request-types-camelcase";
export function pickMediaContentRating(
  ratings: RatingResponse[] | ReleaseDateResponse[],
  mediaType: "tv" | "movie",
  userRegion?: string
): ContentRating | null {
  if (mediaType === "movie") {
    const res = pickMovieRating(
      ratings as ReleaseDateResponse[],
      userRegion,
      FALLBACK_REGION
    );
    console.log(res);
    const first = res?.releaseDates[0];
    const region = res?.iso31661;

    if (!first || !region) return null;

    return {
      region: region,
      rating: first.certification,
      descriptors: first.descriptors,
    };
  } else if (mediaType === "tv") {
    const res = pickTvRating(
      ratings as RatingResponse[],
      userRegion,
      FALLBACK_REGION
    );
    console.log(res);

    if (!res) return null;

    return {
      region: res.iso31661,
      rating: res.rating,
      descriptors: res.descriptors,
    };
  }
  return null;
}
