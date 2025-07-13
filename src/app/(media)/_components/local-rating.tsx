"use client";
import { RatingResponse, ReleaseDate } from "@/types/request-types-camelcase";
import { useMemo } from "react";
import { pickTvRating } from "../tv/[id]/utils";
import { pickMovieRating } from "../movie/[id]/utils";

export default function LocalRating({
  ratings,
  mediaType,
  initialValue,
}: {
  ratings:
    | RatingResponse[]
    | Array<{
        iso31661: string;
        releaseDates: Array<ReleaseDate>;
      }>;
  mediaType: "tv" | "movie";
  initialValue: string;
}) {
  const userRegion = useUserRegion();

  const rating = useMemo(() => {
    if (ratings) {
      const local =
        mediaType === "tv"
          ? pickTvRating(ratings as RatingResponse[], userRegion, "US")
          : pickMovieRating(
              ratings as Array<{
                iso31661: string;
                releaseDates: Array<ReleaseDate>;
              }>,
              userRegion,
              "US"
            );
      //: pickMovieRating(ratings as ReleasesReleaseDate[], userRegion, "US");

      return local ?? initialValue;
    }
  }, [ratings, mediaType, initialValue, userRegion]);
  return (
    <div className="mt-1 inline-block space-x-1.5 text-sm">
      <span className="border border-gray-200 px-1">{rating}</span>
      <span className="text-gray-400">({userRegion})</span>
    </div>
  );
}

export function useUserRegion() {
  return useMemo(() => {
    // e.g. "en-US" or "fr" or "zh-Hant-HK"

    if (typeof window === "undefined") return;
    const locale = navigator.language || "en-US";
    // Intl.Locale gives you a .region property if present
    try {
      return new Intl.Locale(locale).region || "US";
    } catch {
      // fallback: split on dash
      const parts = locale.split("-");
      return parts[1] || parts[0] || "US";
    }
  }, []);
}
