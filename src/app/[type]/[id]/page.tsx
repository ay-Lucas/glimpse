import "@/styles/globals.css";
import { getData, getRecommendations, getReviews } from "./actions";
import { Reviews } from "../_components/reviews";
import { Backdrop } from "../_components/backdrop";
import { Poster } from "../_components/poster";
import { VideoPlayer } from "../_components/video-player";
import Link from "next/link";
import { Recommended } from "../_components/recommended";
import {
  Cast,
  CreditsResponse,
  MovieResultsResponse,
  MovieReviewsResponse,
  Person,
  Review,
  TvResultsResponse,
  TvReviewsResponse,
  Video,
} from "@/types/request-types";
import { ImageCarousel } from "@/components/image-carousel";
import { CastCard } from "@/components/cast-card";
import { MediaDetails } from "@/components/media-details";
import { Genre } from "@/types/types";
import { PersonDetails } from "@/components/person-details";

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
  videoPath?: string;
  backdropPath?: string;
  posterPath?: string;
  trailerPath?: string;
  genres?: Array<Genre>;
  recommendations?: MovieResultsResponse | TvResultsResponse;
  reviews?: MovieReviewsResponse | TvReviewsResponse;
  rating?: string;
  overview?: string;
  releaseDate?: string;
  details?: React.ReactNode;
  voteAverage?: number;
  media_type?: "tv" | "movie" | "person";
}

export default async function ItemPage({
  params,
}: {
  params: { type: "movie" | "tv" | "person"; id: number };
}) {
  const data = await getData({ id: params.id }, params.type);
  let item: Item = {};
  let personDetails: boolean = false;
  let person: Person = { media_type: "person" };
  data.media_type = params.type;

  switch (data.media_type) {
    case "movie":
      item = {
        title: data.title,
        posterPath: data.poster_path,
        backdropPath: data.backdrop_path,
        videoPath: getTrailer(data.videos.results!)?.key,
        credits: data.credits,
        reviews: await getReviews(data.media_type, params.id),
        recommendations: await getRecommendations(params.id, data.media_type),
        releaseDate: data.release_date,
        genres: data.genres,
        overview: data.overview,
        voteAverage: data.vote_average,
        rating:
          data.releases.countries.filter(
            (item) => item.iso_3166_1 === "US" && item.certification !== "",
          )[0]?.certification ?? "",
      };
      break;
    case "tv":
      item = {
        title: data.name,
        posterPath: data.poster_path,
        backdropPath: data.backdrop_path,
        videoPath: getTrailer(data.videos.results!)?.key,
        credits: data.credits,
        reviews: await getReviews(data.media_type, params.id),
        recommendations: await getRecommendations(params.id, data.media_type),
        releaseDate: data.first_air_date,
        genres: data.genres,
        overview: data.overview,
        voteAverage: data.vote_average,
        rating:
          data.content_ratings.results.filter(
            (item) => item.iso_3166_1 === "US" && item.rating !== "",
          )[0]?.rating ?? "",
      };
      break;
    case "person":
      item = {
        posterPath: data.profile_path,
      };
      person = data;
      personDetails = true;
      break;
  }
  const info = data as any;

  return (
    <main>
      <div className="h-full w-full overflow-x-hidden">
        <div className="absolute top-0 left-0 mb-10 w-screen h-screen">
          {item.backdropPath && (
            <div className="h-full w-full bg-gradient-to-t from-background from-30% via-background/95 via-40% to-transparent">
              <Backdrop
                src={`https://image.tmdb.org/t/p/original${item.backdropPath}`}
              />
            </div>
          )}
        </div>
        <div className="h-[5vh] md:h-[25vh]"></div>
        <div className="relative px-3 md:container items-end pt-16">
          <div className="items-end pb-5 md:pt-0 px-0 lg:px-40">
            <div>
              <div className="flex flex-col md:flex-row h-full md:h-3/4 z-10 md:items-center md:space-x-5">
                {item.posterPath && (
                  <Poster
                    src={`https://image.tmdb.org/t/p/original${item.posterPath}`}
                  />
                )}
                {personDetails ? (
                  <PersonDetails
                    name={info.name}
                    biography={person.biography}
                    birthDate={person.birthday}
                    deathDay={person.deathday}
                    popularity={person.popularity}
                    placeOfBirth={person.place_of_birth}
                    knownForDept={person.known_for_department}
                  />
                ) : (
                  <MediaDetails
                    title={item.title ?? ""}
                    genres={item.genres}
                    rating={item.rating}
                    releaseDate={item.releaseDate}
                    overview={item.overview!}
                    voteAverage={item.voteAverage ?? 0}
                    paramsId={params.id}
                    isVideo={
                      item.videoPath !== undefined && item.videoPath !== ""
                    }
                  />
                )}
              </div>
            </div>
            {item.credits?.cast && (
              <>
                <h2 className={`text-2xl font-bold -mb-9 pt-3`}>Cast</h2>
                <div className="pt-2 pb-4 pl-8 md:pl-3 -ml-8 md:ml-0 md:w-full w-screen">
                  <ImageCarousel
                    items={item.credits.cast?.map(
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
            {item.recommendations && item.recommendations.total_results > 0 && (
              <>
                <h2 className={`text-2xl font-bold -mb-9 pt-3`}>Recommended</h2>
                <div className="pt-2 pb-4 pl-8 md:pl-3 -ml-8 md:ml-0 md:w-full w-screen">
                  <Recommended
                    data={item.recommendations.results!}
                    type={(data as any).media_type}
                    rating={item.rating!}
                  />
                </div>
              </>
            )}
          </div>

          {(item.reviews?.results?.length ?? -1) > 0 && (
            <div className="px-0 lg:px-40">
              <h2 className="text-2xl font-semibold pb-5 pr-3 inline-flex">
                Reviews
              </h2>
              <span className="text-2xl font-semibold">
                ({item.reviews?.results?.length})
              </span>
              <div className="space-y-3">
                {item.reviews?.results?.map(
                  (reviews: Review, index: number) => (
                    <Reviews data={reviews} key={index} />
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <VideoPlayer youtubeId={item.videoPath!} id={params.id} />
    </main>
  );
}
