import { getDeviceType } from "@/app/discover/actions";
import { getRecommendations, getContentRating } from "../[id]/actions";
import { isUsRating } from "@/lib/utils";
import { genres } from "@/lib/constants";
import { MovieResult, RatingResponse, TvResult } from "@/types/request-types";
import { ImageCarousel } from "@/components/image-carousel";
import { SwiperOptions } from "swiper/types";

const customBreakPoints: SwiperOptions = {
  breakpoints: {
    350: {
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: 10,
      cssMode: true,
    },
    500: {
      slidesPerView: 3,
      slidesPerGroup: 3,
      spaceBetween: 10,
      cssMode: true,
    },
    1200: {
      slidesPerView: 4,
      slidesPerGroup: 4,
      spaceBetween: 10,
    },
  },
};
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
    } else {
      // console.log(
      //   (item?.name || item?.title) + " is removed. Rated " + item.rating,
      // );
    }
  }
  return result;
}

export async function Recommended({
  type,
  id,
  rating,
}: {
  type: "movie" | "tv";
  id: number;
  rating: string;
}) {
  const isMobile = (await getDeviceType()) === "mobile";
  const recommendationsRes = await getRecommendations(id, type);
  const recommendations = await Promise.all(
    recommendationsRes.results?.map(async (item: MovieResult | TvResult) => {
      const itemRating = await getContentRating(item.media_type, item.id ?? 0);
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
            data={filteredRecommendations}
            type={type}
            customBreakPoints={customBreakPoints.breakpoints}
            className="md:-ml-11"
            loading="lazy"
          />
        </>
      )}
    </>
  );
}
