import dynamic from "next/dynamic";
import { getTvData } from "@/app/(media)/actions";
import { Backdrop } from "@/app/(media)/_components/backdrop";
import { Poster } from "../../_components/poster";
import Link from "next/link";
import { Cast, Person, Video } from "@/types/request-types";
import { MediaDetails } from "@/components/media-details";
import Image from "next/image";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { getWatchlists } from "@/lib/actions";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getBlurData } from "@/lib/blur-data-generator";
import {
  BASE_BLUR_IMAGE_URL,
  BASE_CAST_IMAGE_URL,
  BASE_ORIGINAL_IMAGE_URL,
  BASE_POSTER_IMAGE_URL,
} from "@/lib/constants";
import { Seasons } from "@/app/(media)/_components/seasons";
import { RecommededSection } from "@/app/(media)/_components/recommendedSection";
import ReviewSection from "@/app/(media)/_components/ReviewSection";
import JustWatchLogo from "@/assets/justwatch-logo.svg";
import CastCard from "@/components/cast-card";

const VideoPlayerClient = dynamic(
  () => import("@/app/(media)/_components/video-player"),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-[194px] rounded-xl" />,
  },
);

const ImageCarouselClient = dynamic(
  () => import("@/components/image-carousel"),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-[356px] rounded-xl" />,
  },
);

const AddToWatchlistDropdownClient = dynamic(
  () => import("@/components/add-to-watchlist-button"),
  { ssr: false },
);
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

export default async function ItemPage({ params }: { params: { id: number } }) {
  const data = await getTvData({ id: params.id });
  data.media_type = "tv";
  const tmdbId = Number(params.id);
  let videoPath;
  if (data.videos !== undefined && data.videos.results)
    videoPath = getTrailer(data.videos.results)?.key;
  const rating =
    data.content_ratings.results.filter(
      (item) => item.iso_3166_1 === "US" && item.rating !== "",
    )[0]?.rating ?? "";
  const session = await auth();
  let userWatchlists;
  if (session) {
    userWatchlists = await getWatchlists(session.user.id);
  }

  const posterBlurData = data.poster_path
    ? await getBlurData(`${BASE_BLUR_IMAGE_URL}${data.poster_path}`)
    : null;
  const backdropBlurData = data.backdrop_path
    ? await getBlurData(`${BASE_POSTER_IMAGE_URL}${data.backdrop_path}`)
    : null;

  const castWithPlaceholder = await Promise.all(
    (data.credits?.cast ?? []).map(async (item) => {
      let blurDataURL;
      if (item.profile_path) {
        let blurData = await getBlurData(
          `${BASE_BLUR_IMAGE_URL}${item.profile_path}`,
        );
        blurDataURL = blurData.base64;
      } else {
        blurDataURL =
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
      }
      return {
        ...item,
        blurDataURL: blurDataURL,
      };
    }),
  );

  const isReleased: boolean =
    new Date(data.first_air_date ?? Date.now()).valueOf() < Date.now();
  return (
    <main>
      <div className="h-full w-full overflow-x-hidden">
        <div className="absolute top-0 left-0 mb-10 w-screen h-screen">
          {data.backdrop_path ? (
            <div className="absolute h-full w-full bg-gradient-to-t from-background from-30% via-background/95 via-40% to-transparent">
              <Backdrop
                src={`${BASE_ORIGINAL_IMAGE_URL}${data.backdrop_path}`}
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
                {data.poster_path && (
                  <Poster
                    src={`${BASE_POSTER_IMAGE_URL}${data.poster_path}`}
                    blurDataUrl={posterBlurData?.base64 ?? ""}
                  />
                )}
                <MediaDetails
                  title={data.name ?? ""}
                  genres={data.genres}
                  rating={rating}
                  releaseDate={data.first_air_date!}
                  overview={data.overview!}
                  voteAverage={data.vote_average ?? 0}
                  paramsId={params.id}
                  isVideo={videoPath !== undefined && videoPath !== ""}
                />
              </div>
              {userWatchlists && session ? (
                <AddToWatchlistDropdownClient
                  userId={session.user.id}
                  item={data}
                  rating={rating}
                />
              ) : (
                <Link href={"/signin"}>
                  <Button variant="secondary">Add to Watchlist</Button>
                </Link>
              )}
            </div>
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
                          {data.credits?.crew
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
                      <li className="grid grid-cols-2 border-b">
                        <div>Vote Average</div>
                        <span>{data.vote_average?.toFixed(1)}</span>
                      </li>
                      <li className="grid grid-cols-2 border-b">
                        <div>Vote Count</div>
                        <span>{data.vote_count}</span>
                      </li>
                      <li className="grid grid-cols-2 border-b">
                        <div>Popularity</div>
                        <span>{Math.round(data.popularity ?? 0)}</span>
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
                fallback={<Skeleton className="w-full h-[356px] rounded-xl" />}
              >
                {data["watch/providers"]?.results?.US?.flatrate &&
                  data["watch/providers"]?.results?.US?.flatrate?.length >
                    0 && (
                    <div className="w-full md:w-1/2 md:pl-3 pt-3 md:pt-0 pb-3 md:pb-0">
                      <h2 className="text-2xl font-bold pb-4">
                        Streaming
                        <span className="inline-flex items-center ml-4">
                          <Link href="https://justwatch.com">
                            <JustWatchLogo
                              alt={`JustWatch Logo`}
                              width={100}
                              height={15}
                              className="flex"
                            />
                          </Link>
                        </span>
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {data["watch/providers"]?.results?.US?.flatrate?.map(
                          (item, index) => (
                            <a
                              href={data["watch/providers"]?.results?.US?.link!}
                              key={index}
                              className="w-[55px] h-[55px] flex-shrink-0 transform transition-transform  duration-200  hover:scale-105  hover:shadow-xl"
                            >
                              <Image
                                src={`https://image.tmdb.org/t/p/original/${item.logo_path}`}
                                alt={`${item.provider_name} logo`}
                                width={55}
                                height={55}
                                className="rounded-lg object-cover"
                              />
                            </a>
                          ),
                        )}
                      </div>
                    </div>
                  )}
              </Suspense>
            </div>
            {data.number_of_seasons && data.number_of_seasons > 0 && (
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
            {data.credits?.cast && data.credits.cast.length > 0 && (
              <Suspense
                fallback={<Skeleton className="w-full h-[356px] rounded-xl" />}
              >
                <div>
                  <h2 className={`text-2xl font-bold -mb-9`}>Cast</h2>
                  <div className="pt-2 pb-4 pl-8 md:pl-3 -ml-8 md:ml-0 md:w-full w-screen">
                    <ImageCarouselClient
                      items={castWithPlaceholder?.map(
                        (item: Cast, index: number) => (
                          <Link href={`/person/${item.id}`} key={index}>
                            <CastCard
                              name={item.name}
                              character={item.character}
                              imagePath={`${BASE_CAST_IMAGE_URL}${item.profile_path}`}
                              index={index}
                              blurDataURL={(item as any).blurDataURL}
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
              <RecommededSection
                isReleased={isReleased}
                mediaType="tv"
                rating={rating}
                tmdbId={tmdbId}
              />
            </Suspense>
          </div>

          <Suspense
            fallback={<Skeleton className="w-full h-[194px] rounded-xl" />}
          >
            <ReviewSection id={tmdbId} type={"tv"} />
          </Suspense>
        </div>
      </div>
      {videoPath && (
        <Suspense>
          <VideoPlayerClient youtubeId={videoPath} id={params.id} />
        </Suspense>
      )}
    </main>
  );
}
