import { Recommended } from "./recommended";
import { getContentRating, getRecommendations } from "@/app/(media)/actions";
import { isUsRating } from "@/lib/utils";
import { genres } from "@/lib/constants";
import { MovieResult, TvResult } from "@/types/request-types-snakecase";

function validateRecommended(
  type: "movie" | "tv",
  recommendedRating: string,
  rating: string,
  item: MovieResult | TvResult | undefined,
) {
  let isValid;
  const tvRatings = ["TV-Y", "TV-Y7", "TV-G", "TV-PG", "TV-14", "TV-MA"];
  const movieRatings = ["G", "PG", "PG-13", "R"];
  const safeRatings = ["TV-Y", "TV-Y7", "TV-G", "TV-PG", "G", "PG", "PG-13"];

  if (rating === recommendedRating) isValid = true;
  else if (type === "movie") {
    const ratingIndex = movieRatings.findIndex((element) => element === rating);
    const recommendedIndex = movieRatings.findIndex(
      (element) => element === recommendedRating,
    );
    isValid = Math.abs(ratingIndex - recommendedIndex) <= 1;
  } else if (type === "tv") {
    const ratingIndex = tvRatings.findIndex((element) => element === rating);
    const recommendedIndex = tvRatings.findIndex(
      (element) => element === recommendedRating,
    );
    isValid = Math.abs(ratingIndex - recommendedIndex) <= 1;
  }
  if (
    safeRatings.includes(rating) &&
    item?.genre_ids?.includes(genres.get("Horror") ?? 0)
  )
    isValid = false;
  return isValid;
}

async function getValidRecommendations(
  type: "movie" | "tv",
  rating: string,
  itemArray: Array<TvResult | MovieResult>,
) {
  const result = [];
  for (let i = 0; i < itemArray.length; i++) {
    const item = itemArray[i] as any;
    if (validateRecommended(type, rating, rating, item)) {
      result.push(item);
    }
  }
  return result;
}

export async function RecommededSection({
  isReleased,
  tmdbId: tmdbId,
  mediaType,
  rating,
}: {
  isReleased: boolean;
  tmdbId: number;
  mediaType: "movie" | "tv";
  rating: string;
}) {
  if (!isReleased) return;
  const recommendationsRes = await getRecommendations(tmdbId, mediaType);
  if (!recommendationsRes?.results || recommendationsRes.results?.length < 1)
    return;

  const contentRatings = await Promise.all(
    recommendationsRes.results?.map(async (item: MovieResult | TvResult) => {
      const res = await getContentRating(item.media_type, item.id);
      if (!res) return;
      res.media_type = item.media_type;
      return res;
    }),
  );

  if (
    !contentRatings ||
    contentRatings.length < 1 ||
    contentRatings.length !== recommendationsRes.results.length
  )
    return;

  const recommendations: Array<MovieResult | TvResult> = [];

  recommendationsRes.results.forEach((item, index) => {
    const rating = contentRatings.at(index);
    if (item.id !== rating?.id) return;

    let ratingArray;

    if (rating.media_type === "tv") {
      ratingArray = rating.results?.filter(isUsRating);
      (item as any).rating = ratingArray?.[0]?.rating;
    } else if (rating.media_type === "movie") {
      ratingArray = rating.countries?.filter(isUsRating);
      (item as any).rating = ratingArray?.[0]?.certification;
    }

    recommendations.push(item);
  });

  if (!recommendations || recommendations.length < 1) return;
  const filteredRecommendations = await getValidRecommendations(
    mediaType,
    rating,
    recommendations,
  );

  return (
    <Recommended recommendations={filteredRecommendations} />
  );
}
