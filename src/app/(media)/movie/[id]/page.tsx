import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ReviewSection from "@/app/(media)/_components/ReviewSection";
import {
  fetchMovieDetails,
  fetchDiscoverMovieIds,
  getRecommendations,
} from "../../actions";
import { getTrailer } from "@/lib/utils";
import VideoPlayer from "../../_components/video-player";
import { getRedisBlurValue } from "@/services/cache";
import { MediaHeader } from "../../_components/media-header";
import MediaProviders from "../../_components/media-providers";
import { MediaDetails } from "../../_components/media-details";
import { buildMovieDetailItems } from "./utils";
import { ChevronRight } from "lucide-react";
import MediaLinks from "../../_components/media-links";
import TopCast from "../../_components/top-cast";
import { RecommendationsSection } from "../../_components/recommendations-section";
import BackdropAndPosterCarousel from "../../_components/backdrop-and-poster-carousel";
import MovieReleases from "../../_components/movie-releases";

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
  const isReleased: boolean =
    (movie?.releaseDate &&
      new Date(movie?.releaseDate!).valueOf() < Date.now()) ||
    false;
  const detailItems = buildMovieDetailItems(movie);
  const blurData = await getRedisBlurValue("movie", params.id);
  const isCastValid = movie.credits?.cast && movie.credits.cast.length > 0;
  const releaseDate =
    typeof movie.releaseDate === "string" ? new Date(movie.releaseDate) : null;
  // TODO: Add all watch providers
  return (
    <main>
      {movie && (
        <>
          <div className="h-full w-full overflow-x-hidden pb-20">
            <div className="md:h-[6vh]"></div>
            <div className="relative items-end px-3 pt-16 md:container">
              <div className="items-end space-y-5 px-0 pb-5 md:pt-0 lg:px-24">
                <section>
                  <MediaHeader
                    dateValue={movie.releaseDate?.toString()}
                    dateLabel="Release"
                    isReleased={isReleased}
                    status={movie.status ?? undefined}
                    overview={movie.overview!}
                    posterPath={movie.posterPath ?? null}
                    posterBlur={blurData?.posterBlur ?? null}
                    title={movie.title}
                    genres={movie.genres ?? null}
                    tmdbId={movie.id}
                    imdbId={movie.externalIds?.imdbId ?? null}
                    tmdbVoteAverage={movie.voteAverage ?? null}
                    tmdbVoteCount={movie.voteCount ?? null}
                    trailerPath={videoPath}
                    tagline={movie.tagline ?? null}
                    runtime={movie.runtime ?? null}
                    typeLabel="Movie"
                    isAdult={movie.adult}
                    contentRatings={movie.releaseDates ?? null}
                    mediaType="movie"
                  />
                </section>
                <section className="grid gap-4 md:grid-cols-[repeat(auto-fit,_minmax(0,_1fr))]">
                  <MediaDetails items={detailItems} />
                  <Suspense
                    fallback={
                      <Skeleton className="h-[356px] w-full rounded-xl" />
                    }
                  >
                    <MediaProviders
                      tmdbWatchProviders={movie.watchProviders}
                      mediaType="movie"
                      releaseDate={releaseDate}
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
                      {isCastValid && (
                        <TopCast cast={movie.credits?.cast!} title="Top Cast" />
                      )}
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

                <BackdropAndPosterCarousel
                  backdrops={movie.images?.backdrops ?? []}
                  logos={movie.images?.logos ?? []}
                  posters={movie.images?.posters ?? []}
                  name={movie.title}
                />
                <Suspense
                  fallback={
                    <Skeleton className="h-[356px] w-full rounded-xl" />
                  }
                >
                  <section className="media-card space-y-3">
                    <h2 className={`text-2xl font-bold`}>Releases</h2>
                    {movie.releaseDates?.results &&
                      movie.releaseDates.results.length > 0 && (
                        <MovieReleases releaseDatesRes={movie.releaseDates} />
                      )}
                  </section>
                  {movie.recommendations?.results &&
                    movie.recommendations?.results.length > 0 && (
                      <RecommendationsSection
                        titles={movie.recommendations?.results}
                        mediaType="movie"
                      />
                    )}
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
