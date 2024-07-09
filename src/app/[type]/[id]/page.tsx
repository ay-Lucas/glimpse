import Image from "next/image";
import "@/styles/globals.css";
import { dateOptions } from "@/lib/constants";
import { getData, getReviews } from "./actions";
import { isUsRating } from "@/lib/utils";
import TmdbLogo from "@/../public/tmdb-logo.svg";
import { Reviews } from "../_components/reviews";
import { Backdrop } from "../_components/backdrop";
import { Poster } from "../_components/poster";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "../_components/video-player";
import Link from "next/link";
import { Recommended } from "../_components/recommended";
import { MovieResult, Review, TvResult } from "@/types/request-types";

async function getRating(result: MovieResult | TvResult, type: string) {
  let ratingArray, rating;
  const item = result as any;
  if (type === "tv") {
    ratingArray = item.content_ratings.results.filter(isUsRating);
    rating = ratingArray[0]?.rating;
  } else if (type === "movie") {
    ratingArray = item.releases.countries.filter(isUsRating);
    rating = ratingArray[0]?.certification;
  }
  return rating;
}

export default async function ItemPage({
  params,
}: {
  params: { type: "movie" | "tv"; id: number };
}) {
  const data = await getData({ id: params.id }, params.type);
  const rating = await getRating(data, params.type);
  const reviews = await getReviews({ id: params.id }, params.type);
  const youtubeId = data.videos?.results[0]?.key;
  const releaseDate = new Date(
    (data as any).first_air_date || (data as any).release_date,
  );
  console.log(releaseDate.valueOf());
  // console.log((data as any).first_air_date, (data as any).release_date);
  const isReleased = releaseDate ? releaseDate.valueOf() < Date.now() : false;
  return (
    <main>
      <div className="h-full w-full overflow-x-hidden">
        <div className="absolute top-0 left-0 mb-10 w-screen h-screen">
          <div className="h-full w-full bg-gradient-to-t from-background from-30% via-background/95 via-40% to-transparent">
            <Backdrop
              src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`}
            />
          </div>
        </div>
        <div className="h-[5vh] md:h-[25vh]"></div>
        <div className="relative container items-end pt-16">
          <div className="flex items-end pb-5 md:pt-0 px-5 lg:px-40">
            <div>
              <div className="flex flex-col md:flex-row h-full md:h-3/4 z-10 md:items-center md:space-x-5">
                <Poster
                  src={`https://image.tmdb.org/t/p/original${data.poster_path}`}
                />
                <div className="flex flex-col justify-between space-y-1 items-center md:items-start">
                  <h2 className="text-3xl md:text-5xl font-medium text-center md:text-start">
                    {(data as any).name || (data as any).title}
                  </h2>
                  <div className="flex flex-row space-x-2 items-center justify-center md:justify-start">
                    {isReleased && (
                      <>
                        <div className="inline-flex items-center">
                          <span className="mr-2">
                            {((data?.vote_average ?? 0) * 10).toFixed(0)}%
                          </span>
                          <Image
                            src={TmdbLogo}
                            className="w-[30px] h-[30px]"
                            priority
                            alt="tmdb logo"
                          />
                        </div>
                        <span>•</span>
                      </>
                    )}
                    <div className="">
                      {isReleased
                        ? `${new Intl.DateTimeFormat("us", {
                            // dayPeriod: "long",
                            timeZone: "UTC",
                            month: "short",
                            year: "numeric",
                            day: "numeric",
                          }).format(releaseDate)}`
                        : "Date Unavailable"}
                    </div>
                  </div>
                  {rating ? (
                    <div className="">
                      Rated <span className="font-semibold">{rating}</span>
                    </div>
                  ) : (
                    <div>Rating Unavailable</div>
                  )}
                  {youtubeId && (
                    <Link
                      className="text-md z-10"
                      href={`${params.id}/?show=true`}
                    >
                      <Button className="p-2 mt-1" variant="outline">
                        <Play size={22} className="mr-2" />
                        Play Trailer
                      </Button>
                    </Link>
                  )}
                  <div className="text-md md:text-lg font-medium">
                    {data.overview}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <>
            <Recommended type={params.type} id={params.id} rating={rating} />
          </>
          {(reviews.results?.length ?? -1 > 0) && (
            <div className="px-5 lg:px-40">
              <h2 className="text-2xl font-semibold pb-5 pr-3 inline-flex">
                Reviews
              </h2>
              <span className="text-2xl font-semibold">
                ({reviews.results?.length})
              </span>
              <div className="space-y-3">
                {reviews.results?.map((reviews: Review, index: number) => (
                  <Reviews data={reviews} key={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <VideoPlayer youtubeId={youtubeId ?? ""} id={params.id} />
    </main>
  );
}
