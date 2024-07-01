import Image from "next/image";
import "@/styles/globals.css";
import { dateOptions, options } from "@/lib/constants";
import TmdbLogo from "@/../public/tmdb-logo.svg";
import { Reviews } from "../_components/reviews";
import { Backdrop } from "../_components/backdrop";
import { Poster } from "../_components/poster";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "../_components/video-player";
import { ImageCarousel } from "@/components/image-carousel";
import { getDeviceType } from "@/app/browse/actions";
import Link from "next/link";
const baseUrl = "https://api.themoviedb.org/3";

async function getData(params) {
  const res = await fetch(
    `${baseUrl}/${params.item}/${params.id}?append_to_response=videos&language=en-US`,
    options,
  );
  return res.json();
}

async function getReviews(params) {
  const res = await fetch(
    `${baseUrl}/${params.item}/${params.id}/reviews`,
    options,
  );
  return res.json();
}

async function getRecommendations(params) {
  const res = await fetch(
    `${baseUrl}/${params.item}/${params.id}/recommendations`,
    options,
  );
  return res.json();
}

export default async function ItemPage({ params }) {
  const data = await getData(params);
  const reviews = await getReviews(params);
  const youtubeId = data.videos.results[0]?.key;
  const isMobile = getDeviceType() === "mobile";
  const recommendations = await getRecommendations(params);
  console.log(data);
  return (
    <main>
      <div className="relative h-full w-full overflow-x-hidden">
        <div className="absolute h-full w-full bg-gradient-to-t from-background from-30% via-background/95 via-40% to-transparent">
          <Backdrop
            src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`}
          />
        </div>
        <div className="h-screen relative container items-end px-5 md:px-40 pt-16">
          <div className="md:h-[57%] flex items-end pb-5 md:pt-0 ">
            <div>
              <div className="flex flex-col md:flex-row h-full md:h-3/4 z-10 md:items-center md:space-x-5">
                <Poster
                  src={`https://image.tmdb.org/t/p/original${data.poster_path}`}
                />
                <div className="flex flex-col justify-between space-y-1 items-center md:items-start">
                  <h2 className="text-3xl md:text-5xl font-medium text-center md:text-start">
                    {data.name || data.title}
                  </h2>
                  <div className="flex flex-row items-center justify-center md:justify-start">
                    <span className="mr-2 text-lg">
                      {`${data.vote_average !== null && data.vote_average.toPrecision(2) * 10}%`}
                    </span>
                    <Image
                      src={TmdbLogo}
                      className="w-[30px] h-[30px]"
                      priority
                      alt="tmdb logo"
                    />
                    <div className="text-lg pl-3">
                      {data &&
                        new Date(
                          data.first_air_date || data.release_date,
                        ).toLocaleDateString(dateOptions)}
                    </div>
                  </div>
                  {youtubeId && (
                    <Link
                      className="texV-md z-10"
                      href={`${params.id}/?show=true`}
                    >
                      <Button className="p-2" variant="outline">
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
          {recommendations.results?.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold pb-0">Recommended</h2>
              <div className="overflow-x-hidden">
                <ImageCarousel
                  data={recommendations.results}
                  type={params.item}
                  isMobile={isMobile}
                  size="small"
                  className="mr-[3.75rem] py-4"
                />
              </div>
            </>
          )}
          {reviews.results?.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold pb-5 pr-3 inline-flex">
                Reviews
              </h2>
              <span className="text-2xl font-semibold">
                ({reviews.results.length})
              </span>
              <div className="space-y-3">
                {reviews.results.map((reviews, index) => (
                  <Reviews data={reviews} key={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <VideoPlayer youtubeId={youtubeId} id={params.id} />
    </main>
  );
}
