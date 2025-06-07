import { fetchDiscoverTvIds, fetchTvDetails } from "@/app/(media)/actions";
import Link from "next/link";
import { Video } from "@/types/request-types-snakecase";
import Image from "next/image";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BASE_CAST_IMAGE_URL,
  BASE_POSTER_IMAGE_URL,
  DEFAULT_BLUR_DATA_URL,
} from "@/lib/constants";
import { RecommededSection } from "@/app/(media)/_components/recommendedSection";
import ReviewSection from "@/app/(media)/_components/ReviewSection";
import JustWatchLogo from "@/assets/justwatch-logo.svg";
import CastCard from "@/components/cast-card";
import { TvDetails } from "../../_components/tv-details";
import { ScoreCircle } from "../../_components/score-circle";
import MediaActions from "../../_components/media-actions";
import { ChevronRight } from "lucide-react";
import { countryCodeToEnglishName, languageCodeToEnglishName } from "@/lib/utils";
import ImageCarousel from "@/components/image-carousel";
import VideoPlayer from "../../_components/video-player";

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

// Generate all TV pages featured on Discover page at build
export async function generateStaticParams() {
  return await fetchDiscoverTvIds();
}

export default async function TvPage({ params }: { params: { id: number } }) {
  const tmdbId = Number(params.id);
  const tv = await fetchTvDetails(tmdbId);

  if (!tv) return;

  let videoPath;
  if (tv.videos !== undefined && tv.videos.results)
    videoPath = getTrailer(tv.videos.results)?.key;
  const rating =
    tv.contentRatings?.results.filter(
      (item) => item.iso31661 === "US" && item.rating !== "",
    )[0]?.rating ?? "";

  const isReleased: boolean =
    tv.firstAirDate !== undefined &&
    tv.firstAirDate !== null &&
    new Date(tv.firstAirDate).valueOf() < Date.now();

  // console.log(`Tv page rendered! ${tv.name}`)

  return (
    <main>
      {tv && (
        <>
          <div className="h-full w-full overflow-x-hidden pb-20">
            <div className="h-[6vh] md:h-[10vh]"></div>
            <div className="relative px-3 md:container items-end pt-16">
              <div className="items-end pb-5 md:pt-0 px-0 lg:px-40 space-y-5">

                <section className="bg-background/20 backdrop-blur-sm rounded-lg p-4 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-[238px,1fr] gap-5 items-start">
                    {tv?.posterPath && (
                      <figure className="w-full">
                        <Image
                          quality={60}
                          width={238}
                          height={357}
                          src={`${BASE_POSTER_IMAGE_URL}${tv.posterPath}`}
                          className="object-cover rounded-lg w-full h-full"
                          priority
                          placeholder="blur"
                          blurDataURL={
                            tv?.posterBlurData ?? DEFAULT_BLUR_DATA_URL
                          }
                          alt={`${tv.name} poster`}
                          loading="eager"
                        />
                      </figure>
                    )}

                    <div className="space-y-6">
                      <h1 className="text-3xl md:text-5xl font-bold text-center md:text-left">
                        {tv.name}
                      </h1>
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        {isReleased && tv.voteAverage != null && (
                          <div className="flex flex-col items-center">
                            <ScoreCircle
                              size={54}
                              strokeWidth={3}
                              percentage={Math.round(tv.voteAverage * 10)}
                            />
                            <span className="sr-only">{tv.voteAverage}</span>
                          </div>
                        )}
                        {tv.genres && tv.genres.length > 0 && (
                          <>
                            {tv.genres.map((g) => (
                              <span
                                key={g.id}
                                className="text-sm bg-gray-700/60 px-2 py-0.5 rounded-full hover:bg-gray-700 transition ring-1 ring-gray-400"
                              >
                                {g.name}
                              </span>
                            ))}
                          </>
                        )}
                      </div>
                      <TvDetails
                        rating={rating}
                        firstAirDate={tv.firstAirDate?.toString() ?? undefined}
                        overview={tv.overview!}
                        status={tv.status ?? undefined}
                      />
                      <MediaActions
                        data={tv}
                        videoPath={videoPath}
                        tmdbId={params.id}
                        rating={rating}
                      />
                    </div>
                  </div>
                </section>
                <div className="pt-3 flex flex-col md:flex-row w-full md:space-y-0 space-y-4 backdrop-blur-sm bg-background/20 rounded-lg p-2">
                  <div className="w-full md:w-1/2">
                    <h2 className="text-2xl font-bold pb-4">Details</h2>
                    <ul className="grid p-3 -ml-1 space-y-1">
                      <li className="grid grid-cols-2 border-b items-center">
                        <div>Creators</div>
                        <div>
                          {tv.createdBy?.map((item, index) => (
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
                          {tv.networks?.map((item, index) => (
                            <span key={index}>
                              {index === 0 ? "" : ", "}
                              {item.name}
                            </span>
                          ))}
                        </div>
                      </li>
                      {tv.voteAverage &&
                        <li className="grid grid-cols-2 border-b">
                          <div>Vote Average</div>
                          <span>{tv.voteAverage.toFixed(1)}</span>
                        </li>
                      }
                      <li className="grid grid-cols-2 border-b">
                        <div>Vote Count</div>
                        <span>{tv.voteCount}</span>
                      </li>
                      <li className="grid grid-cols-2 border-b">
                        <div>Popularity</div>
                        <span>{Math.round(tv.popularity!)}</span>
                      </li>
                      <li className="grid grid-cols-2 border-b">
                        <div>Language</div>
                        <div>{languageCodeToEnglishName(tv.originalLanguage!)}</div>
                      </li>
                      <li className="grid grid-cols-2">
                        <div>Origin Country</div>
                        <span>{tv.originCountry?.map(code => countryCodeToEnglishName(code))?.join(", ")}</span>
                      </li>
                    </ul>
                  </div>
                  <Suspense
                    fallback={<Skeleton className="w-full h-[356px] rounded-xl" />}
                  >
                    {tv.watchProviders?.results?.US?.flatrate &&
                      tv.watchProviders?.results?.US?.flatrate?.length > 0 && (
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
                            {tv.watchProviders?.results?.US?.flatrate?.map(
                              (item, index) => (
                                <a
                                  href={tv.watchProviders?.results?.US?.link!}
                                  key={index}
                                  className="w-[55px] h-[55px] flex-shrink-0 transform transition-transform  duration-200  hover:scale-105  hover:shadow-xl"
                                >
                                  <Image
                                    src={`https://image.tmdb.org/t/p/original/${item.logoPath}`}
                                    alt={`${item.providerName} logo`}
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
                {tv.numberOfSeasons && tv.numberOfSeasons > 0 && (
                  <>
                    <div className="pb-5 space-y-2 flex">
                      <Link href={`/tv/${params.id}/seasons`} className="pb-4 pt-3 flex items-end hover:text-gray-400">
                        <h2 className={`text-2xl font-bold`}>Seasons </h2>
                        <ChevronRight size={30} />
                      </Link>
                      {/* <Suspense */}
                      {/*   fallback={ */}
                      {/*     <div className="space-y-2"> */}
                      {/*       {Array.from({ */}
                      {/*         length: tv.numberOfSeasons ?? 1, */}
                      {/*       }).map((_, index) => ( */}
                      {/*         <Skeleton */}
                      {/*           key={index} */}
                      {/*           className={`w-full h-[${SEASON_COMPONENT_HEIGHT}px] rounded-xl`} */}
                      {/*         /> */}
                      {/*       ))} */}
                      {/*     </div> */}
                      {/*   } */}
                      {/* > */}
                      {/*   <Seasons */}
                      {/*     id={params.id} */}
                      {/*     numberOfSeasons={tv.numberOfSeasons} */}
                      {/*   /> */}
                      {/* </Suspense> */}
                    </div>
                  </>
                )}
                {tv.credits?.cast && (
                  <Suspense
                    fallback={<Skeleton className="w-full h-[356px] rounded-xl" />}
                  >
                    <div>
                      <h2 className={`text-2xl font-bold -mb-9`}>Cast</h2>
                      <div className="pt-2 pb-4 pl-8 md:pl-3 -ml-8 md:ml-0 md:w-full w-screen">
                        <ImageCarousel
                          items={tv.credits?.cast?.map((item, index: number) => (
                            <Link href={`/person/${item.id}`} key={index}>
                              <CastCard
                                name={item.name}
                                character={item.character}
                                imagePath={`${BASE_CAST_IMAGE_URL}${item.profilePath}`}
                                index={index}
                                blurDataURL={DEFAULT_BLUR_DATA_URL}
                              />
                            </Link>
                          ))}
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
              <VideoPlayer youtubeId={videoPath} id={params.id} />
            </Suspense>
          )}
        </>
      )}
    </main>
  );
}
