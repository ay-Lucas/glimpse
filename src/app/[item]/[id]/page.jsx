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
import { RecommendedCarousel } from "../_components/recommended-carousel";
const baseUrl = "https://api.themoviedb.org/3";

async function getData(params) {
  const res = await fetch(
    `${baseUrl}/${params.item}/${params.id}?append_to_response=videos,releases&language=en-US`,
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

async function getContentRating(type, id) {
  const res = await fetch(
    `${baseUrl}/${type}/${id}/${type === "tv" ? "content_ratings" : "releases"}`,
    options,
  );
  return res.json();
}

function isUsRating(item) {
  return item.iso_3166_1 === "US" && item !== undefined;
}

async function getRating(type, id) {
  let ratingArray, rating;
  const ratingRes = await getContentRating(type, id);
  if (type === "tv") {
    ratingArray = ratingRes.results.filter(isUsRating);
    rating = ratingArray[0]?.rating;
  } else if (type === "movie") {
    ratingArray = ratingRes.countries.filter(isUsRating);
    rating = ratingArray[0]?.certification;
  }
  return rating;
}

export default async function ItemPage({ params }) {
  const data = await getData(params);
  const reviews = await getReviews(params);
  const youtubeId = data.videos.results[0]?.key;
  const isMobile = getDeviceType() === "mobile";
  const recommendations = await getRecommendations(params);
  const rating = await getRating(params.item, params.id);
  console.log(rating);

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
                    {data.name || data.title}
                  </h2>
                  <div className="flex flex-row space-x-2 items-center justify-center md:justify-start">
                    <div className="inline-flex text-lg">
                      <span className="mr-2">
                        {`${data.vote_average !== null && data.vote_average.toPrecision(2) * 10}%`}
                      </span>
                      <Image
                        src={TmdbLogo}
                        className="w-[30px] h-[30px]"
                        priority
                        alt="tmdb logo"
                      />
                    </div>
                    <span>•</span>
                    <div className="text-lg">
                      {data &&
                        new Date(
                          data.first_air_date || data.release_date,
                        ).toLocaleDateString(dateOptions)}
                    </div>
                  </div>
                  {rating ? (
                    <div>
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
          <h2 className="text-2xl font-semibold px-5 lg:px-40">Recommended</h2>
          {recommendations.results?.length > 0 && (
            <div className="relative container px-0 md:px-0 lg:px-[8rem]">
              <RecommendedCarousel
                data={recommendations.results}
                type={params.item}
                isUserAgentMobile={isMobile}
                // size="small"
                // className="mr-[3.75rem] py-4"
              />
            </div>
          )}
          {reviews.results?.length > 0 && (
            <div className="px-5 lg:px-40">
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
