import { MovieResult, TvResult } from "@/types/request-types-snakecase";
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
          <div className="pt-2 pb-4">
            <ImageCarousel
              title={<h2 className={`text-2xl font-bold`}>Recommended</h2>}
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
              loading="lazy"
              breakpoints="page"
            />
          </div>
        </>
      )}
    </>
  );
}
