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

export async function Recommended({
  recommendations,
}: {
  recommendations: Array<MovieResult | TvResult>;
}) {
  return (
    <>
      {recommendations?.length > 0 && (
        <>
          <h2 className="text-2xl font-bold -mb-9">Recommended</h2>
          <div className="pt-2 pb-4 pl-8 md:pl-3 -ml-8 md:ml-0 md:w-full w-screen">
            <ImageCarousel
              items={recommendations.map(
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
          </div>
        </>
      )}
    </>
  );
}
