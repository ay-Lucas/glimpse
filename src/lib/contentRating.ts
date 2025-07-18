export interface UniqueRegionContentRating {
  countryCode: string;
  country: string;
  rating: string[];
  descriptors: String[];
}
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
  ReleaseDate,
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

    if (!res) return null;

    return {
      region: res.iso31661,
      rating: res.rating,
      descriptors: res.descriptors,
    };
  }
  return null;
}
/**
 * Turn TMDB’s TV content_ratings into ContentRating[]
 */
export function mapTvRatingsToContentRatings(
  tvRatings: RatingResponse[] | undefined
): ContentRating[] {
  if (!tvRatings) return [];
  return tvRatings.map((r) => ({
    region: r.iso31661,
    rating: r.rating,
    descriptors: r.descriptors,
  }));
}

/**
 * Turn TMDB’s Movie release_dates into ContentRating[]
 */
export function mapMovieReleaseDatesToContentRatings(
  movieDates: ReleaseDateResponse[] | undefined
): ContentRating[] {
  if (!movieDates) return [];

  return movieDates.flatMap((regionEntry) =>
    regionEntry.releaseDates.map((rd: ReleaseDate) => ({
      region: regionEntry.iso31661,
      rating: rd.certification,
      descriptors: rd.descriptors,
    }))
  );
}
