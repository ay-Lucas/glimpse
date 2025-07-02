import Link from "next/link";
import { Cast } from "@/types/request-types-camelcase";
import Image from "next/image";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BASE_CAST_IMAGE_URL,
  BASE_ORIGINAL_IMAGE_URL,
  DEFAULT_BLUR_DATA_URL,
} from "@/lib/constants";
import { RecommededSection } from "@/app/(media)/_components/recommendedSection";
import ReviewSection from "@/app/(media)/_components/ReviewSection";
import {
  fetchMovieDetails,
  fetchDiscoverMovieIds,
  getRecommendations,
} from "../../actions";
import { getTrailer } from "@/lib/utils";
import CastCard from "@/components/cast-card";
import ImageCarousel from "@/components/image-carousel";
import VideoPlayer from "../../_components/video-player";
import { getRedisBlurValue } from "@/services/cache";
import { MediaHeader } from "../../_components/media-header";
import MediaProviders from "../../_components/media-providers";
import { MediaDetails } from "../../_components/media-details";
import { buildMovieDetailItems } from "./utils";
import { Credits } from "../../_components/media-credits";
import { ChevronRight } from "lucide-react";
import MediaLinks from "../../_components/media-links";

export const revalidate = 43200; // 12 hours

// Generate all Movie pages featured on Discover page (and their recommendations) at build
export async function generateStaticParams() {
  const movieIds = await fetchDiscoverMovieIds();
  const rawMovieIds = movieIds.map((item) => item.id);

  if (process.env.IS_LOCALHOST === "true") {
    return movieIds;
  }

  const recResponses = await Promise.all(
    movieIds.map((item) => getRecommendations(Number(item.id), "movie"))
  );

  const recIds = recResponses.flatMap(
    (res) => res?.results?.map((m) => m.id) ?? []
  );

  const uniqueIds = Array.from(new Set([...rawMovieIds, ...recIds]));

  return uniqueIds.map((id) => ({ id: id.toString() }));
}

export default async function MoviePage({
  params,
}: {
  params: { id: number };
}) {
  const tmdbId = Number(params.id);
  const movie = await fetchMovieDetails(tmdbId);

  if (!movie) throw new Error("fetchMovieDetails returned undefined");

  const videoPath = getTrailer(movie?.videos?.results || [])?.key;
  const rating =
    movie?.releases?.countries?.find(
      (c) => c.iso31661 === "US" && c.certification
    )?.certification ?? "";
  const isReleased: boolean =
    (movie?.releaseDate &&
      new Date(movie?.releaseDate!).valueOf() < Date.now()) ||
    false;

  const detailItems = buildMovieDetailItems(movie);
  const blurData = await getRedisBlurValue("movie", params.id);
  console.log(movie.externalIds);
  // console.log(movie.watchProviders?.results)
  // console.log(`Movie page rendered! ${movie.title}`)
  // TODO: Add all watch providers
  return (
    <main>
      {movie && (
        <>
          <div className="h-full w-full overflow-x-hidden">
            <div className="absolute left-0 top-0 mb-10 h-screen w-full">
              {movie?.backdropPath ? (
                <div className="absolute h-full w-full bg-gradient-to-t from-background via-background/95 via-30% to-transparent">
                  <div className="absolute h-full w-full bg-background/40"></div>
                  <Image
                    fill
                    src={`${BASE_ORIGINAL_IMAGE_URL}${movie.backdropPath}`}
                    quality={70}
                    alt="header image"
                    className={`-z-10 object-cover`}
                    sizes="100vw"
                    placeholder="blur"
                    blurDataURL={
                      blurData?.backdropBlur ?? DEFAULT_BLUR_DATA_URL
                    }
                  />
                </div>
              ) : (
                <div className="absolute left-0 top-0 z-0 h-full w-full items-center justify-center bg-gradient-to-b from-background via-gray-900 to-background/50" />
              )}
            </div>

            <div className="h-[6vh] md:h-[10vh]"></div>
            <div className="relative items-end px-3 pt-16 md:container">
              <div className="items-end space-y-5 px-0 pb-5 md:pt-0 lg:px-24">
                <section>
                  <MediaHeader
                    rating={rating}
                    dateValue={movie.releaseDate?.toString()}
                    dateLabel="Release"
                    isReleased={isReleased}
                    status={movie.status ?? undefined}
                    overview={movie.overview!}
                    posterPath={movie.posterPath ?? null}
                    posterBlur={blurData?.posterBlur ?? null}
                    title={movie.title}
                    genres={movie.genres ?? null}
                    tmdbId={params.id}
                    imdbId={movie.externalIds?.imdbId ?? null}
                    tmdbVoteAverage={movie.voteAverage ?? null}
                    tmdbVoteCount={movie.voteCount ?? null}
                    trailerPath={videoPath}
                    tagline={movie.tagline ?? null}
                    homepage={movie.homepage ?? null}
                    data={movie}
                    runtime={movie.runtime ?? null}
                    typeLabel="Movie"
                    mediaType="movie"
                  />
                </section>
                <section className="grid grid-cols-[repeat(auto-fit,_minmax(0,_1fr))] gap-4">
                  <MediaDetails items={detailItems} />
                  <Suspense
                    fallback={
                      <Skeleton className="h-[356px] w-full rounded-xl" />
                    }
                  >
                    <MediaProviders
                      tmdbWatchProviders={movie.watchProviders}
                      mediaType="movie"
                      releaseDate={movie.releaseDate ?? null}
                      title={movie.title}
                      tmdbId={movie.id}
                    />
                  </Suspense>
                </section>
                {movie.credits?.cast && movie.credits.cast.length > 0 && (
                  <>
                    <section className="media-card space-y-10">
                      <Link
                        href={`/movie/${params.id}/credits`}
                        className="flex items-end hover:text-gray-400"
                      >
                        <h2 className={`text-2xl font-bold`}>
                          All Cast and Crew
                        </h2>
                        <ChevronRight size={30} />
                      </Link>
                    </section>
                    <Suspense
                      fallback={
                        <Skeleton className="h-[356px] w-full rounded-xl" />
                      }
                    >
                      <section className="media-card space-y-10">
                        <ImageCarousel
                          title={
                            <h2 className={`text-2xl font-bold`}>Top Cast</h2>
                          }
                          items={movie.credits.cast
                            ?.splice(0, 10)
                            .map((item, index: number) => (
                              <Link href={`/person/${item.id}`} key={index}>
                                <CastCard
                                  name={item.name}
                                  character={item.character}
                                  imagePath={item.profilePath}
                                  index={index}
                                  blurDataURL={DEFAULT_BLUR_DATA_URL}
                                  className="pt-2"
                                />
                              </Link>
                            ))}
                          breakpoints="cast"
                        />
                      </section>
                    </Suspense>
                  </>
                )}
                {movie.externalIds && (
                  <MediaLinks
                    externalIds={movie.externalIds}
                    tmdbId={movie.id}
                    mediaType="movie"
                  />
                )}
                <Suspense
                  fallback={
                    <Skeleton className="h-[356px] w-full rounded-xl" />
                  }
                >
                  <RecommededSection
                    isReleased={isReleased}
                    tmdbId={tmdbId}
                    mediaType="movie"
                    rating={rating}
                  />
                </Suspense>
                <Suspense
                  fallback={
                    <Skeleton className="h-[194px] w-full rounded-xl" />
                  }
                >
                  <ReviewSection id={tmdbId} type={"movie"} />
                </Suspense>
              </div>
            </div>
          </div>
          {videoPath !== undefined && (
            <Suspense>
              <VideoPlayer youtubeId={videoPath} id={params.id} />
            </Suspense>
          )}
        </>
      )}
    </main>
  );
}
