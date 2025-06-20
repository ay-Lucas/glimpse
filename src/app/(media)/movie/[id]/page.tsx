import Link from "next/link";
import { Cast } from "@/types/request-types-camelcase";
import Image from "next/image";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BASE_ORIGINAL_IMAGE_URL,
  BASE_POSTER_IMAGE_URL,
  DEFAULT_BLUR_DATA_URL,
} from "@/lib/constants";
import { RecommededSection } from "@/app/(media)/_components/recommendedSection";
import ReviewSection from "@/app/(media)/_components/ReviewSection";
import { fetchMovieDetails, fetchDiscoverMovieIds, getRecommendations, fetchDirectOffers } from "../../actions";
import { countryCodeToEnglishName, getTrailer, languageCodeToEnglishName } from "@/lib/utils";
import JustWatchLogo from "@/assets/justwatch-logo.svg";
import CastCard from "@/components/cast-card";
import { MovieDetails } from "../../_components/movie-details";
import MediaActions from "../../_components/media-actions";
import { ScoreCircle } from "../../_components/score-circle";
import ImageCarousel from "@/components/image-carousel";
import VideoPlayer from "../../_components/video-player";
import ProviderList from "../../_components/provider-list";
import { getRedisBlurValue } from "@/services/cache";
import TmdbProviderList from "../../_components/tmdb-provider-list";
import JustWatchProviderList from "../../_components/provider-list";

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

  const videoPath = getTrailer(movie?.videos?.results || [])?.key;
  const rating =
    movie?.releases?.countries?.find(
      (c) => c.iso31661 === "US" && c.certification,
    )?.certification ?? "";
  const isReleased: boolean =
    (movie?.releaseDate &&
      new Date(movie?.releaseDate!).valueOf() < Date.now()) ||
    false;
  const justWatchData = await fetchDirectOffers(movie.title, "show", movie.releaseDate)
  const blurData = await getRedisBlurValue("movie", params.id);
  // console.log(movie.watchProviders?.results)
  // console.log(`Movie page rendered! ${movie.title}`)
  // TODO: Add all watch providers
  return (
    <main>
      {movie && (
        <>
          <div className="h-full w-full overflow-x-hidden">
            <div className="absolute top-0 left-0 mb-10 w-screen h-screen">
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
                <section className="bg-background/20 backdrop-blur-sm rounded-lg p-4 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-[238px,1fr] gap-5 items-start">
                    {movie?.posterPath && (
                      <figure className="w-full">
                        <Image
                          quality={60}
                          width={238}
                          height={357}
                          src={`${BASE_POSTER_IMAGE_URL}${movie.posterPath}`}
                          className="object-cover rounded-lg w-full h-full"
                          priority
                          placeholder="blur"
                          blurDataURL={blurData?.posterBlur ?? DEFAULT_BLUR_DATA_URL}
                          alt={`${movie.title} poster`}
                          loading="eager"
                        />
                      </figure>
                    )}

                    <div className="space-y-6">
                      <h1 className="text-3xl md:text-5xl font-bold text-center md:text-left">
                        {movie.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        {isReleased && movie.voteAverage != null && (
                          <div className="flex flex-col items-center">
                            <ScoreCircle
                              size={54}
                              strokeWidth={3}
                              percentage={Math.round(movie.voteAverage * 10)}
                            />
                            <span className="sr-only">{movie.voteAverage}</span>
                          </div>
                        )}
                        {movie.genres && movie.genres.length > 0 && (
                          <>
                            {movie.genres.map((g) => (
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
                      <MovieDetails
                        rating={rating}
                        releaseDate={movie.releaseDate?.toString()}
                        overview={movie.overview!}
                        status={movie.status} />
                      <MediaActions
                        data={movie}
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
                      <li className="grid grid-cols-2 border-b">
                        <div className="items-center">Directors</div>
                        <div>
                          {movie.credits?.crew
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
                      {movie.revenue !== null && movie.revenue !== 0 && (
                        <li className="grid grid-cols-2 border-b">
                          <span>Revenue</span>
                          <span>${movie.revenue?.toLocaleString()}</span>
                        </li>
                      )}
                      {movie.budget !== null && movie.budget !== 0 && (
                        <li className="grid grid-cols-2 border-b">
                          <div>Budget</div>
                          <span>${movie.budget?.toLocaleString()}</span>
                        </li>
                      )}
                      {movie.voteAverage &&
                        <li className="grid grid-cols-2 border-b">
                          <div>Vote Average</div>
                          <span>{movie.voteAverage.toFixed(1)}</span>
                        </li>
                      }
                      <li className="grid grid-cols-2 border-b">
                        <div>Vote Count</div>
                        <span>{movie?.voteCount}</span>
                      </li>
                      <li className="grid grid-cols-2 border-b">
                        <div>Popularity</div>
                        <span>{Math.round(movie.popularity ?? 0)}</span>
                      </li>
                      <li className="grid grid-cols-2 border-b">
                        <div>Language</div>
                        <div>{languageCodeToEnglishName(movie.originalLanguage!)}</div>
                      </li>
                      <li className="grid grid-cols-2">
                        <div>Origin Country</div>
                        <span>{movie.originCountry?.map(code => countryCodeToEnglishName(code))?.join(", ")}</span>
                      </li>
                      <span className="mr-32"></span>
                    </ul>
                  </div>
                  <Suspense
                    fallback={
                      <Skeleton className="w-full h-[356px] rounded-xl" />
                    }
                  >
                    {((movie.watchProviders?.results?.US?.flatrate || (justWatchData && justWatchData.Streams.length > 0)) && (
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
                        {justWatchData && justWatchData.Streams.length > 0 ? (
                          <JustWatchProviderList info={justWatchData} />
                        ) : (
                          <TmdbProviderList watchProviders={movie.watchProviders!} />
                        )}
                      </div>
                    ))}
                  </Suspense>
                </div>
                {movie.credits?.cast && movie.credits.cast.length > 0 && (
                  <Suspense
                    fallback={
                      <Skeleton className="w-full h-[356px] rounded-xl" />
                    }
                  >
                    <ImageCarousel
                      title={
                        <h2 className={`text-2xl font-bold`}>Cast</h2>
                      }
                      items={movie.credits.cast.map(
                        (item: Cast, index: number) => (
                          <Link href={`/person/${item.id}`} key={index}>
                            <CastCard
                              name={item.name}
                              character={item.character}
                              imagePath={item.profilePath ?? undefined}
                              index={index}
                              blurDataURL={DEFAULT_BLUR_DATA_URL}
                            />
                          </Link>
                        ),
                      )}
                      breakpoints="cast"
                    />
                  </Suspense>
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
      )}
    </main>
  );
}
