import {
  MovieResult,
  MovieResultsResponse,
  RatingResponse,
  TvResult,
  TvResultsResponse,
} from "@/types/request-types";
import ImageCarousel from "@/components/image-carousel";
import Link from "next/link";
import { Card } from "@/components/card";
import {
  BASE_BLUR_IMAGE_URL,
  BASE_ORIGINAL_IMAGE_URL,
  BASE_POSTER_IMAGE_URL,
} from "@/lib/constants";
import { getBlurData } from "@/lib/blur-data-generator";

export async function Recommended({
  recommendations,
}: {
  recommendations: Array<MovieResult | TvResult>;
}) {
  const itemsWithPlaceholder = await Promise.all(
    recommendations.map(async (item) => {
      let blurDataURL;
      if (item.poster_path) {
        const blurData = await getBlurData(
          `${BASE_BLUR_IMAGE_URL}${item.poster_path}`,
        );
        blurDataURL = blurData.base64;
      } else {
        blurDataURL =
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
      }
      console.log(`${BASE_BLUR_IMAGE_URL}${item.poster_path}`);
      return {
        ...item,
        blurDataURL: blurDataURL,
      };
    }),
  );
  return (
    <>
      {itemsWithPlaceholder?.length > 0 && (
        <>
          <h2 className="text-2xl font-bold -mb-9">Recommended</h2>
          <div className="pt-2 pb-4 pl-8 md:pl-3 -ml-8 md:ml-0 md:w-full w-screen">
            <ImageCarousel
              items={itemsWithPlaceholder.map(
                (item: MovieResult | TvResult, index: number) => {
                  let card: React.ReactNode;
                  switch (item.media_type) {
                    case "movie":
                      card = (
                        <Card
                          title={item.title}
                          overview={item.overview}
                          imagePath={`${BASE_POSTER_IMAGE_URL}${item.poster_path}`}
                          blurDataURL={(item as any).blurDataURL}
                        />
                      );
                      break;
                    case "tv":
                      card = (
                        <Card
                          title={item.name}
                          overview={item.overview}
                          imagePath={`${BASE_POSTER_IMAGE_URL}${item.poster_path}`}
                          blurDataURL={(item as any).blurDataURL}
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
          </div>
        </>
      )}
    </>
  );
}
