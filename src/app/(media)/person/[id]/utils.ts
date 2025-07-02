import { PersonCombinedCreditsResponse } from "@/types/request-types-camelcase";

export function getTopPopularCredits(
  limit: number,
  credits: PersonCombinedCreditsResponse
) {
  const prominent = credits.cast?.filter((c) => {
    if (c.mediaType === "movie") {
      // order is TMDB’s cast index: 0 is the lead, 1–7 are your co-stars, 8+ tends to be day players & cameos
      return typeof c.order === "number" && c.order < 5;
    }

    if (c.mediaType === "tv") {
      return (
        (typeof c.order === "number" && c.order < 5) ||
        (typeof (c as any).episodeCount === "number" &&
          (c as any).episodeCount >= 10)
      );
    }

    return false;
  });
  const sorted = prominent?.sort((a, b) => {
    // primary: billing order (lower = more starred)
    const oa = typeof a.order === "number" ? a.order : Infinity;
    const ob = typeof b.order === "number" ? b.order : Infinity;
    if (oa !== ob) return oa - ob;
    // secondary: popularity (higher first)
    return (b.popularity ?? 0) - (a.popularity ?? 0);
  });

  return sorted?.slice(0, limit);
}
