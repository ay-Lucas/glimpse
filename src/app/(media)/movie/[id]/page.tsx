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
import { fetchMovieDetails, fetchDiscoverMovieIds, getRecommendations } from "../../actions";
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

export const revalidate = 43200; // 12 hours

// Generate all Movie pages featured on Discover page (and their recommendations) at build
export async function generateStaticParams() {
  const movieIds = await fetchDiscoverMovieIds();
  const rawMovieIds = movieIds.map(item => item.id);

  if (process.env.IS_LOCALHOST === "true") {
    return movieIds;
  }

  const recResponses = await Promise.all(
    movieIds.map((item) => getRecommendations(Number(item.id), "movie"))
  );

  const recIds = recResponses.flatMap((res) =>
    res?.results?.map((m) => m.id) ?? []
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

  if (!movie)
    throw new Error("fetchMovieDetails returned undefined");

  const videoPath = getTrailer(movie?.videos?.results || [])?.key;
  const rating =
    movie?.releases?.countries?.find(
      (c) => c.iso31661 === "US" && c.certification,
    )?.certification ?? "";
  const isReleased: boolean =
    (movie?.releaseDate &&
      new Date(movie?.releaseDate!).valueOf() < Date.now()) ||
    false;

  const detailItems = buildMovieDetailItems(movie)
  const blurData = await getRedisBlurValue("movie", params.id);

  // console.log(movie.watchProviders?.results)
  // console.log(`Movie page rendered! ${movie.title}`)
  // TODO: Add all watch providers
  return (
    <main>
      {movie && (
        <>
          <div className="h-full w-full overflow-x-hidden">
            <div className="absolute top-0 left-0 mb-10 w-full h-screen">
              {movie?.backdropPath ? (
                <div className="absolute h-full w-full bg-gradient-to-t from-background via-background/95 via-30% to-transparent">
                  <div className="bg-background/40 absolute h-full w-full"></div>
                  <Image
                    fill
                    src={`${BASE_ORIGINAL_IMAGE_URL}${movie.backdropPath}`}
                    quality={70}
                    alt="header image"
                    className={`object-cover -z-10`}
                    sizes="100vw"
                    placeholder="blur"
                    blurDataURL={blurData?.backdropBlur ?? DEFAULT_BLUR_DATA_URL}
                  />
                </div>
              ) : (
                <div className="absolute z-0 top-0 left-0 h-full w-full items-center justify-center bg-gradient-to-b from-background to-background/50 via-gray-900" />
              )}
            </div>

            <div className="h-[6vh] md:h-[10vh]"></div>
            <div className="relative px-3 md:container items-end pt-16">
              <div className="items-end pb-5 md:pt-0 px-0 lg:px-24 space-y-5 ">
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
                <section className="grid gap-4 grid-cols-[repeat(auto-fit,_minmax(0,_1fr))]">
                  <MediaDetails items={detailItems} />
                  <Suspense fallback={<Skeleton className="w-full h-[356px] rounded-xl" />}>
                    <MediaProviders tmdbWatchProviders={movie.watchProviders} mediaType="movie" releaseDate={movie.releaseDate ?? null} title={movie.title} tmdbId={movie.id} />
                  </Suspense>
                </section>
                {movie.credits?.cast && movie.credits.cast.length > 0 && (
                  <>
                    <section className="space-y-10 media-card">
                      <Link href={`/movie/${params.id}/credits`} className="flex items-end hover:text-gray-400">
                        <h2 className={`text-2xl font-bold`}>All Cast and Crew</h2>
                        <ChevronRight size={30} />
                      </Link>
                    </section>
                    <Suspense fallback={<Skeleton className="w-full h-[356px] rounded-xl" />}>
                      <section className="space-y-10 media-card">
                        <ImageCarousel
                          title={<h2 className={`text-2xl font-bold`}>Top Cast</h2>}
                          items={movie.credits.cast?.splice(0, 10).map((item, index: number) => (
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
                <Suspense
                  fallback={
                    <Skeleton className="w-full h-[356px] rounded-xl" />
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
                  fallback={<Skeleton className="w-full h-[194px] rounded-xl" />}
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
      )
      }
    </main >
  );
}
