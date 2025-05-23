import { MovieResult, TvResult } from "@/types/request-types";
import ImageCarousel from "@/components/image-carousel";
import Link from "next/link";
import { Card } from "@/components/card";
import { BASE_POSTER_IMAGE_URL, BaseImageUrl } from "@/lib/constants";
import { appendBlurDataToMediaArray } from "@/lib/blur-data-generator";

export async function Recommended({
  recommendations,
}: {
  recommendations: Array<MovieResult | TvResult>;
}) {
  const posterPaths = recommendations.map((item) => item.poster_path);
  const items = (await appendBlurDataToMediaArray(
    recommendations,
    BaseImageUrl.BLUR,
    posterPaths,
  )) as Array<MovieResult | TvResult>;

  return (
    <>
      {items?.length > 0 && (
        <>
          <h2 className="text-2xl font-bold -mb-9">Recommended</h2>
          <div className="pt-2 pb-4 pl-8 md:pl-3 -ml-8 md:ml-0 md:w-full w-screen">
            <ImageCarousel
              items={items.map(
                (item: MovieResult | TvResult, index: number) => {
                  if (!item.poster_path) return;
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
