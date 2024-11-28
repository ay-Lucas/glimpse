import "@/styles/globals.css";
import {
  getData,
  getRecommendations,
  getReviews,
  getSeasonData,
} from "./actions";
import { Reviews } from "../_components/reviews";
import { Backdrop } from "../_components/backdrop";
import { Poster } from "../_components/poster";
import { VideoPlayer } from "../_components/video-player";
import Link from "next/link";
import { Recommended } from "../_components/recommended";
import {
  Cast,
  Person,
  Review,
  TvSeasonResponse,
  Video,
} from "@/types/request-types";
import { ImageCarousel } from "@/components/image-carousel";
import { CastCard } from "@/components/cast-card";
import { MediaDetails } from "@/components/media-details";
import { PersonDetails } from "@/components/person-details";
import Image from "next/image";
import JustWatchLogo from "@/../public/justwatch-logo.svg";
import { SeasonAccordion } from "../_components/season-accordion";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { AddToWatchlistDropdown } from "@/components/add-to-watchlist-button";
import { getWatchlists } from "@/lib/actions";
import { Item } from "@/types";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getBlurData } from "@/lib/blur-data-generator";
import { BASE_IMAGE_URL } from "@/lib/constants";
import { Seasons } from "../_components/seasons";
import { RecommededSection } from "../_components/recommendedSection";
const SEASON_COMPONENT_HEIGHT = 52;

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

export default async function ItemPage({
  params,
}: {
  params: { type: "movie" | "tv" | "person"; id: number };
}) {
  const data = await getData({ id: params.id }, params.type);
  let item: Item;
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
        releaseDate: data.release_date,
        genres: data.genres,
        overview: data.overview,
        voteAverage: data.vote_average,
        rating:
          data.releases.countries.filter(
            (item) => item.iso_3166_1 === "US" && item.certification !== "",
          )[0]?.certification ?? "",
        media_type: "movie",
        tmdbId: Number(params.id),
        popularity: data.popularity,
        language: data.original_language!,
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
        releaseDate: data.first_air_date,
        genres: data.genres,
        overview: data.overview,
        voteAverage: data.vote_average,
        rating:
          data.content_ratings.results.filter(
            (item) => item.iso_3166_1 === "US" && item.rating !== "",
          )[0]?.rating ?? "",
        media_type: "tv",
        tmdbId: Number(params.id),
        popularity: data.popularity ?? 0,
        numberOfSeasons: data.number_of_episodes,
        // numberOfEpisodes: episodesData.reduce(
        //   (total, season) => total + (season.episodes?.length ?? 0),
        //   0,
        // ),
        language: data.original_language!,
      };
      break;
    case "person":
      item = {
        posterPath: data.profile_path,
        media_type: "person",
        tmdbId: Number(params.id),
        popularity: data.popularity ?? 0,
      };
      person = data;
      personDetails = true;
      break;
  }
  const session = await auth();
  let userWatchlists;
  if (session) {
    userWatchlists = await getWatchlists(session.user.id);
  }

  const posterBlurData = item.posterPath
    ? await getBlurData(`${BASE_IMAGE_URL}${item.posterPath}`)
    : null;
  const backdropBlurData = item.backdropPath
    ? await getBlurData(`${BASE_IMAGE_URL}${item.backdropPath}`)
    : null;

  const isReleased: boolean =
    new Date(item.releaseDate ?? Date.now()).valueOf() < Date.now();
  const info = data as any;
  return (
    <main>
      <div className="h-full w-full overflow-x-hidden">
        <div className="absolute top-0 left-0 mb-10 w-screen h-screen">
          {item.backdropPath ? (
            <div className="absolute h-full w-full bg-gradient-to-t from-background from-30% via-background/95 via-40% to-transparent">
              <Backdrop
                src={`${BASE_IMAGE_URL}${item.backdropPath}`}
                blurDataUrl={backdropBlurData?.base64 ?? ""}
              />
            </div>
          ) : (
            <div className="absolute z-0 top-0 left-0 h-full w-full items-center justify-center bg-gradient-to-b from-background to-background/50 via-gray-900" />
          )}
        </div>

        <div className="h-[6vh] md:h-[25vh]"></div>
        <div className="relative px-3 md:container items-end pt-16">
          <div className="items-end pb-5 md:pt-0 px-0 lg:px-40 space-y-5">
            <div>
              <div className="flex flex-col md:flex-row h-full md:h-3/4 z-10 md:items-center md:space-x-5 pb-3">
                {item.posterPath && (
                  <Poster
                    src={`https://image.tmdb.org/t/p/original${item.posterPath}`}
                    blurDataUrl={posterBlurData?.base64 ?? ""}
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
                  <>
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
                  </>
                )}
              </div>
              {item.media_type !== "person" && userWatchlists && session ? (
                <AddToWatchlistDropdown
                  userId={session.user.id}
                  watchlistItem={item}
                />
              ) : (
                item.media_type !== "person" && (
                  <Link href={"/signin"}>
                    <Button variant="secondary">Add to Watchlist</Button>
                  </Link>
                )
              )}
            </div>
            {data.media_type !== "person" && (
              <div className="pt-3 flex flex-col md:flex-row w-full md:space-y-0 space-y-4">
                <div className="w-full md:w-1/2">
                  <h2 className="text-2xl font-bold pb-4">Details</h2>
                  <ul className="grid bg-secondary/40 rounded-xl p-3 -ml-1 space-y-1">
                    {data.media_type === "tv" ? (
                      <>
                        <li className="grid grid-cols-2 border-b items-center">
                          <div>Creators</div>
                          <div>
                            {data.created_by?.map((item, index) => (
                              <Link
                                href={`/person/${item.id}`}
                                className="hover:underline"
                                key={index}
                              >
                                {index === 0 ? "" : ", "}
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </li>
                        <li className="grid grid-cols-2 border-b">
                          <div>Networks</div>
                          <div>
                            {data.networks?.map((item, index) => (
                              <span key={index}>
                                {index === 0 ? "" : ", "}
                                {item.name}
                              </span>
                            ))}
                          </div>
                        </li>
                        <li className="grid grid-cols-2 border-b">
                          <div>Vote Average</div>
                          <span>{data.vote_average!.toFixed(1)}</span>
                        </li>
                        <li className="grid grid-cols-2 border-b">
                          <div>Vote Count</div>
                          <span>{data.vote_count}</span>
                        </li>
                        <li className="grid grid-cols-2 border-b">
                          <div>Popularity</div>
                          <span>{Math.round(data.popularity!)}</span>
                        </li>
                        <li className="grid grid-cols-2 border-b">
                          <div>Language</div>
                          <div>{data.spoken_languages?.at(0)?.name}</div>
                        </li>
                        <li className="grid grid-cols-2">
                          <div>Origin Country</div>
                          <span>{data.origin_country}</span>
                        </li>
                      </>
                    ) : data.media_type === "movie" ? (
                      <>
                        <li className="grid grid-cols-2 border-b">
                          <div className="items-center">Directors</div>
                          <div>
                            {data.credits.crew
                              ?.filter((item) => item.job === "Director")
                              .map((item, index) => (
                                <Link
                                  href={`/person/${item.id}`}
                                  className="hover:underline"
                                  key={index}
                                >
                                  {index === 0 ? "" : ", "}
                                  {item.name}
                                </Link>
                              ))}
                          </div>
                        </li>
                        {data.revenue !== null && data.revenue !== 0 && (
                          <li className="grid grid-cols-2 border-b">
                            <span>Revenue</span>
                            <span>${data.revenue?.toLocaleString()}</span>
                          </li>
                        )}
                        {data.budget !== null && data.budget !== 0 && (
                          <li className="grid grid-cols-2 border-b">
                            <div>Budget</div>
                            <span>${data.budget?.toLocaleString()}</span>
                          </li>
                        )}
                        <li className="grid grid-cols-2 border-b">
                          <div>Vote Average</div>
                          <span>{data.vote_average.toFixed(1)}</span>
                        </li>
                        <li className="grid grid-cols-2 border-b">
                          <div>Vote Count</div>
                          <span>{data.vote_count}</span>
                        </li>
                        <li className="grid grid-cols-2 border-b">
                          <div>Popularity</div>
                          <span>{Math.round(data.popularity)}</span>
                        </li>
                        <li className="grid grid-cols-2 border-b">
                          <div>Language</div>
                          <div>{data.spoken_languages?.at(0)?.name}</div>
                        </li>
                        <li className="grid grid-cols-2">
                          <div>Origin Country</div>
                          <span>{data.origin_country}</span>
                        </li>
                      </>
                    ) : (
                      <span className="mr-32"></span>
                    )}
                  </ul>
                </div>
                <Suspense
                  fallback={
                    <Skeleton className="w-full h-[356px] rounded-xl" />
                  }
                >
                  {data.media_type === "movie" || data.media_type === "tv"
                    ? data["watch/providers"]?.results?.US?.flatrate &&
                      data["watch/providers"]?.results?.US?.flatrate?.length >
                        0 && (
                        <div className="w-full md:w-1/2 md:pl-3 pt-3 md:pt-0 pb-3 md:pb-0">
                          <h2 className="text-2xl font-bold pb-4">
                            Streaming
                            <span className="inline-flex items-center ml-4">
                              <Link href="https://justwatch.com">
                                <Image
                                  src={JustWatchLogo}
                                  alt={`JustWatch Logo`}
                                  width={100}
                                  height={15}
                                  className="flex"
                                />
                              </Link>
                            </span>
                          </h2>
                          <li className="grid grid-cols-2">
                            <div className="flex space-x-2">
                              {data[
                                "watch/providers"
                              ]?.results?.US?.flatrate?.map((item, index) => (
                                <div key={index}>
                                  <Link
                                    href={
                                      data["watch/providers"]?.results?.US
                                        ?.link!
                                    }
                                  >
                                    <Image
                                      src={`https://image.tmdb.org/t/p/original/${item.logo_path}`}
                                      alt={`${item.provider_name} logo`}
                                      width={55}
                                      height={55}
                                      className="rounded-lg object-cover"
                                    />
                                  </Link>
                                </div>
                              ))}
                            </div>
                          </li>
                        </div>
                      )
                    : ""}
                </Suspense>
              </div>
            )}
            {data.media_type === "tv" &&
              data.number_of_seasons &&
              data.number_of_seasons > 0 && (
                <>
                  <div className="pb-5 space-y-2">
                    <h2 className={`text-2xl font-bold pb-4 pt-3`}>Seasons</h2>
                    <Suspense
                      fallback={
                        <div className="space-y-2">
                          {Array.from({
                            length: data.number_of_seasons ?? 1,
                          }).map((_, index) => (
                            <Skeleton
                              key={index}
                              className={`w-full h-[${SEASON_COMPONENT_HEIGHT}px] rounded-xl`}
                            />
                          ))}
                        </div>
                      }
                    >
                      <Seasons
                        id={params.id}
                        numberOfSeasons={data.number_of_seasons}
                      />
                    </Suspense>
                  </div>
                </>
              )}
            {item.credits?.cast && item.credits.cast.length > 0 && (
              <Suspense
                fallback={<Skeleton className="w-full h-[356px] rounded-xl" />}
              >
                <div>
                  <h2 className={`text-2xl font-bold -mb-9`}>Cast</h2>
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
                </div>
              </Suspense>
            )}
            <Suspense
              fallback={<Skeleton className="w-full h-[356px] rounded-xl" />}
            >
              <RecommededSection isReleased={isReleased} item={item} />
            </Suspense>
          </div>

          <Suspense
            fallback={<Skeleton className="w-full h-[194px] rounded-xl" />}
          >
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
          </Suspense>
        </div>
      </div>
      <Suspense>
        <VideoPlayer youtubeId={item.videoPath!} id={params.id} />
      </Suspense>
    </main>
  );
}
