"use client";

import React, { createContext, useContext, useMemo, ReactNode } from "react";
import {
  ContentRating,
  mapMovieReleaseDatesToContentRatings,
  mapTvRatingsToContentRatings,
} from "@/lib/contentRating";
import { pickMediaContentRating } from "@/lib/contentRating";
import {
  RatingResponse,
  ReleaseDateResponse,
} from "@/types/request-types-camelcase";
import { useUserRegion } from "@/lib/user-region";

interface ContentRatingContextValue {
  /** All raw ratings from TMDB */
  allRatings: ContentRating[];
  /** The single rating picked for this media + region (or null) */
  contentRating: ContentRating | null;
}

const ContentRatingContext = createContext<ContentRatingContextValue | null>(
  null
);

export interface ContentRatingProviderProps {
  /** Raw array from TMDB */
  ratings: RatingResponse[] | ReleaseDateResponse[];
  /** mediaType passed into your picker */
  mediaType: "tv" | "movie";
  /** e.g. "US" or undefined */
  children: ReactNode;
}

export function ContentRatingProvider({
  ratings,
  mediaType,
  children,
}: ContentRatingProviderProps) {
  const userRegion = useUserRegion();
  const contentRating = useMemo(
    () =>
      ratings
        ? pickMediaContentRating(ratings, mediaType, userRegion ?? "US")
        : null,
    [ratings, mediaType, userRegion]
  );

  const allRatings =
    mediaType === "tv"
      ? mapTvRatingsToContentRatings(ratings as RatingResponse[])
      : mapMovieReleaseDatesToContentRatings(ratings as ReleaseDateResponse[]);
  const allValidRatings = allRatings.filter((r) => r.rating.trim());
  const allRatingsSorted = allValidRatings.sort((a, b) =>
    a.region.localeCompare(b.region)
  );
  const value = useMemo<ContentRatingContextValue>(
    () => ({ allRatings: allRatingsSorted, contentRating }),
    [ratings, contentRating]
  );

  return (
    <ContentRatingContext.Provider value={value}>
      {children}
    </ContentRatingContext.Provider>
  );
}

/** Hook to consume the context */
export function useContentRating() {
  const ctx = useContext(ContentRatingContext);
  if (!ctx) {
    throw new Error(
      "useContentRating must be used within a <ContentRatingProvider>"
    );
  }
  return ctx;
}
