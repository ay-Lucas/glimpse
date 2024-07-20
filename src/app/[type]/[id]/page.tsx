import Image from "next/image";
import "@/styles/globals.css";
import {
  getData,
  getMovieData,
  getPersonData,
  getRecommendations,
  getReviews,
} from "./actions";
import { isUsRating } from "@/lib/utils";
import { Reviews } from "../_components/reviews";
import { Backdrop } from "../_components/backdrop";
import { Poster } from "../_components/poster";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "../_components/video-player";
import Link from "next/link";
import { Recommended } from "../_components/recommended";
import {
  Cast,
  CreditsResponse,
  MovieResponseAppended,
  MovieResult,
  MovieResultsResponse,
  MovieReviewsResponse,
  PersonResult,
  Review,
  ShowResponseAppended,
  TvResult,
  TvResultsResponse,
  TvReviewsResponse,
  Video,
} from "@/types/request-types";
import { ImageCarousel } from "@/components/image-carousel";
import { Card } from "@/components/card";
import { CastCard } from "@/components/cast-card";
import { MediaDetails } from "@/components/media-details";

async function getRating(
  result: MovieResponseAppended | ShowResponseAppended,
  type: string,
) {
  let ratingArray, rating;
  if (type === "tv") {
    ratingArray = result.content_ratings.results.filter(isUsRating);
    rating = ratingArray[0]?.rating;
  } else if (type === "movie") {
    ratingArray = item.releases.countries.filter(isUsRating);
    rating = ratingArray[0]?.certification;
  }
  return rating;
}

function getTrailer(videoArray: Array<Video>) {
  const trailer: Array<Video> = videoArray.filter(
    (video) => video.type === "Trailer",
  );
  if (trailer?.length !== 0) {
    return trailer[0];
  } else {
    const teaser: Array<Video> = videoArray.filter(
      (video) => video.type === "Teaser",
    );
    return teaser[0];
  }
}

interface Item {
  title?: string;
  credits?: CreditsResponse;
  videos?: Array<Video>;
  backdropPath?: string;
  posterPath?: string;
  trailerPath?: string;
  recommendations?: MovieResultsResponse | TvResultsResponse;
  reviews?: MovieReviewsResponse | TvReviewsResponse;
  rating?: string;
}

export default async function ItemPage({
  params,
}: {
  params: { type: "movie" | "tv" | "person"; id: number };
}) {
  let details: React.ReactNode;
  let pageItem: Item = {};
  switch (params.type) {
    case "movie":
      const movie = await getMovieData({ id: params.id });
      const ratingArray = movie.releases.countries.filter(
        (item) => item.iso_3166_1 === "US" && item.certification !== "",
      );
      pageItem.rating = ratingArray[0]?.certification;
      pageItem.reviews = await getReviews(params.type, params.id);
      pageItem.backdropPath = movie.backdrop_path;
      pageItem.recommendations = await getRecommendations(
        params.id,
        params.type,
      );
      // rating = ratingArray[0]?.rating;
      details = (
        <MediaDetails
          title={movie.title!}
          genres={movie.genres ?? []}
          rating={pageItem.rating ?? ""}
          releaseDate={movie.release_date!}
          overview={movie.overview ?? ""}
          videoArray={movie.videos.results ?? []}
          voteAverage={movie.vote_average ?? 0}
        />
      );
      break;
    case "tv":
      break;
    case "person":
      const data = await getPersonData({ id: params.id });
      break;
  }
  const data = await getData({ id: params.id }, params.type);
  // const rating = await getRating(data, params.type);
  // const reviews = await getReviews(params.type, params.id);
  const releaseDate = new Date(
    (data as any).first_air_date || (data as any).release_date,
  );
  // const recommendationsRes = await getRecommendations(params.id, params.type);
  return (
    <main>
      <div className="h-full w-full overflow-x-hidden">
        <div className="absolute top-0 left-0 mb-10 w-screen h-screen">
          <div className="h-full w-full bg-gradient-to-t from-background from-30% via-background/95 via-40% to-transparent">
            <Backdrop
              src={`https://image.tmdb.org/t/p/original${pageItem.backdropPath}`}
            />
          </div>
        </div>
        <div className="h-[5vh] md:h-[25vh]"></div>
        <div className="relative px-3 md:container items-end pt-16">
          <div className="items-end pb-5 md:pt-0 px-0 lg:px-40">
            <div>
              <div className="flex flex-col md:flex-row h-full md:h-3/4 z-10 md:items-center md:space-x-5">
                <Poster
                  src={`https://image.tmdb.org/t/p/original${pageItem.posterPath}`}
                />
              </div>
            </div>
            {video?.key && (
              <Link className="text-md z-10" href={`${params.id}/?show=true`}>
                <Button className="p-2 mt-1" variant="outline">
                  <Play size={22} className="mr-2" />
                  Play Trailer
                </Button>
              </Link>
            )}
            {pageItem.credits?.cast && (
              <>
                <h2 className={`text-2xl font-bold -mb-9 pt-3`}>Cast</h2>
                <div className="pt-2 pb-4 pl-8 md:pl-3 -ml-8 md:ml-0 md:w-full w-screen">
                  <ImageCarousel
                    items={pageItem.credits.cast.map(
                      (item: Cast, index: number) => (
                        <Link href={`/person/${item.id}`} key={index}>
                          <CastCard
                            name={item.name}
                            character={item.character}
                            imagePath={item.profile_path!}
                            index={index}
                            loading="lazy"
                          />
                        </Link>
                      ),
                    )}
                    breakpoints="cast"
                    className="md:-ml-6"
                  />
                </div>
              </>
            )}
            {pageItem.recommendations &&
              pageItem.recommendations.total_results > 0 && (
                <>
                  <h2 className={`text-2xl font-bold -mb-9 pt-3`}>
                    Recommended
                  </h2>
                  <div className="pt-2 pb-4 pl-8 md:pl-3 -ml-8 md:ml-0 md:w-full w-screen">
                    <Recommended
                      data={pageItem.recommendations.results!}
                      type={params.type}
                      rating={rating}
                    />
                  </div>
                </>
              )}
          </div>
          {(reviews.results?.length ?? -1) > 0 && (
            <div className="px-0 lg:px-40">
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
      <VideoPlayer youtubeId={video?.key ?? ""} id={params.id} />
    </main>
  );
}
