import { getContentRating, getRecommendations } from "../[id]/actions";
import { isUsRating } from "@/lib/utils";
import { genres } from "@/lib/constants";
import { MovieResult, RatingResponse, TvResult } from "@/types/request-types";
import { ImageCarousel } from "@/components/image-carousel";
import Link from "next/link";
import { Card } from "@/components/card";

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
    if (validateRecommended(type, item.rating, rating, item)) {
      result.push(item);
    }
  }
  return result;
}

export async function Recommended({
  rating,
  type,
  id,
}: {
  rating: string;
  type: "tv" | "movie";
  id: number;
}) {
  const data = await getRecommendations(id, type);

  if (!data.results || data.results?.length < 1) return;

  const recommendations = await Promise.all(
    data.results?.map(async (item: MovieResult | TvResult) => {
      // Make exception for undefined id
      if (item.id === undefined) return item;
      const itemRating = await getContentRating(item.media_type, item.id);
      if (item.media_type === "tv") {
        const ratingArray = itemRating.results?.filter(isUsRating) ?? [];
        (item as any).rating = ratingArray[0]?.rating;
      } else if (item.media_type === "movie") {
        const ratingArray = itemRating.countries.filter(
          (item: RatingResponse) => isUsRating(item),
        );
        (item as any).rating = ratingArray[0]?.certification;
      }
      return item;
    }),
  );

  const filteredRecommendations = await getValidRecommendations(
    type,
    rating,
    recommendations,
  );
  return (
    <>
      {filteredRecommendations?.length > 0 && (
        <>
          <ImageCarousel
            items={filteredRecommendations.map(
              (item: MovieResult | TvResult, index: number) => {
                let card: React.ReactNode;
                switch (item.media_type) {
                  case "movie":
                    card = (
                      <Card
                        title={item.title}
                        overview={item.overview}
                        imagePath={item.poster_path}
                      />
                    );
                    break;
                  case "tv":
                    card = (
                      <Card
                        title={item.name}
                        overview={item.overview}
                        imagePath={item.poster_path}
                      />
                    );
                    break;
                }
                return (
                  <Link href={`/${item.media_type}/${item.id}`} key={index}>
                    {card}
                  </Link>
                );
              },
            )}
            className="md:-ml-11"
            loading="lazy"
            breakpoints="page"
          />
        </>
      )}
    </>
  );
}
