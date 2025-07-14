"use client";
import {
  RatingResponse,
  ReleaseDateResponse,
} from "@/types/request-types-camelcase";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ContentRating, pickMediaContentRating } from "@/lib/contentRating";

export default function LocalRating({
  ratings,
  mediaType,
  initialValue,
}: {
  ratings: RatingResponse[] | ReleaseDateResponse[] | null;
  mediaType: "tv" | "movie";
  initialValue: ContentRating | null;
}) {
  const userRegion = useUserRegion();

  const ratingRes = ratings
    ? useMemo(
        () =>
          pickMediaContentRating(ratings, mediaType, userRegion ?? undefined),
        [ratings, mediaType, initialValue, userRegion]
      )
    : null;

  const contentRating = ratingRes ?? initialValue;

  if (!contentRating) return <Badge variant="default">NR</Badge>;

  return (
    <div className="space-x-0.5 text-sm">
      <Badge variant="default">{contentRating.rating}</Badge>
      <Badge variant="default">{contentRating.region}</Badge>
      {contentRating.descriptors.map((item) => (
        <span>{item}</span>
      ))}
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
