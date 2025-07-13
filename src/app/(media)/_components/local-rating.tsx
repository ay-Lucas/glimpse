"use client";
import { RatingResponse, ReleaseDate } from "@/types/request-types-camelcase";
import { useEffect, useMemo, useState } from "react";
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
          ? pickTvRating(
              ratings as RatingResponse[],
              userRegion ?? undefined,
              "US"
            )
          : pickMovieRating(
              ratings as Array<{
                iso31661: string;
                releaseDates: Array<ReleaseDate>;
              }>,
              userRegion ?? undefined,
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
  const [region, setRegion] = useState<string | null>("US");

  useEffect(() => {
    const locale = navigator.language || "en-US";
    let r: string;
    try {
      r = new Intl.Locale(locale).region || locale.split("-")[1] || "US";
    } catch {
      r = locale.split("-")[1] || locale.split("-")[0] || "US";
    }
    setRegion(r);
  }, []);

  return region;
}
