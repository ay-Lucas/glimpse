import dynamic from "next/dynamic";
import Link from "next/link";
import { Cast } from "@/types/request-types-camelcase";
import Image from "next/image";
import { auth } from "@/auth";
import { getWatchlists } from "@/lib/actions";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  appendBlurDataToMediaArray,
  getBlurData,
} from "@/lib/blur-data-generator";
import {
  BASE_BLUR_IMAGE_URL,
  BASE_ORIGINAL_IMAGE_URL,
  BASE_POSTER_IMAGE_URL,
  DEFAULT_BLUR_DATA_URL,
  options,
} from "@/lib/constants";
import { RecommededSection } from "@/app/(media)/_components/recommendedSection";
import ReviewSection from "@/app/(media)/_components/ReviewSection";
import { getFullMovie, getMovieDetails } from "../../actions";
import { getTrailer } from "@/lib/utils";
import JustWatchLogo from "@/assets/justwatch-logo.svg";
import CastCard from "@/components/cast-card";
import { MovieDetails } from "../../_components/movie-details";
import MediaActions from "../../_components/media-actions";
import { ScoreCircle } from "../../_components/score-circle";

export const revalidate = 3600;
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

export default async function MoviePage({
  params,
}: {
  params: { id: number };
}) {
  const tmdbId = Number(params.id);

  // const [movie, session] = await Promise.all([
  //   getFullMovie(tmdbId) ?? getMovieDetails({ id: params.id }),
  //   auth(),
  // ]);

  // const watchlistPromise = session
  //   ? getWatchlists(session.user.id)
  //   : Promise.resolve(null);

  // const [userWatchlists, posterBlurData, backdropBlurData] = await Promise.all([
  //   watchlistPromise,
  // data.poster_path
  //   ? getBlurData(`${BASE_BLUR_IMAGE_URL}${data.poster_path}`)
  //   : Promise.resolve(null),
  // data.backdrop_path
  //   ? getBlurData(`${BASE_BLUR_IMAGE_URL}${data.backdrop_path}`)
  //   : Promise.resolve(null),
  // data.credits?.cast?.length
  // ? appendBlurDataToMediaArray(
  //     data.credits.cast,
  //     BaseImageUrl.BLUR,
  //     data.credits.cast.map((c) => c.profile_path),
  //   )
  // : Promise.resolve([]),
  // ]);
  const movie =
    (await getFullMovie(tmdbId)) ?? (await getMovieDetails({ id: params.id }));
  const session = await auth();

  const videoPath = getTrailer(movie?.videos?.results || [])?.key;
  const rating =
    movie?.releases?.countries?.find(
      (c) => c.iso31661 === "US" && c.certification,
    )?.certification ?? "";
  const isReleased: boolean =
    (movie?.releaseDate &&
      new Date(movie?.releaseDate!).valueOf() < Date.now()) ||
    false;
  // console.log(movie.watchProviders?.results?.US?.flatrate)
  // console.log(movie.watchProviders?.results)
  const details = await getMovieDetails({ id: params.id }, options);
  details;
  if (movie.originCountry)
    console.log(movie.originCountry[0])
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
                    blurDataURL={
                      movie?.backdropBlurData ?? DEFAULT_BLUR_DATA_URL
                    }
                  />
                </div>
              ) : (
                <div className="absolute z-0 top-0 left-0 h-full w-full items-center justify-center bg-gradient-to-b from-background to-background/50 via-gray-900" />
              )}
            </div>

            <div className="h-[6vh] md:h-[10vh]"></div>
            <div className="relative px-3 md:container items-end pt-16">
              <div className="items-end pb-5 md:pt-0 px-0 lg:px-40 space-y-5 ">
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
                          blurDataURL={
                            movie?.posterBlurData ?? DEFAULT_BLUR_DATA_URL
                          }
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
                        session={session ?? undefined}
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
                      <li className="grid grid-cols-2 border-b">
                        <div>Vote Average</div>
                        <span>{movie?.voteAverage?.toFixed(1)}</span>
                      </li>
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
                        <div>{movie.spokenLanguages?.at(0)?.name}</div>
                      </li>
                      <li className="grid grid-cols-2">
                        <div>Origin Country</div>
                        <span>{movie.originCountry?.join(", ")}</span>
                      </li>
                      <span className="mr-32"></span>
                    </ul>
                  </div>
                  <Suspense
                    fallback={
                      <Skeleton className="w-full h-[356px] rounded-xl" />
                    }
                  >
                    {movie.watchProviders?.results?.US?.flatrate &&
                      movie.watchProviders?.results?.US?.flatrate?.length >
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
                            {movie.watchProviders?.results?.US?.flatrate?.map(
                              (item, index) => (
                                <a
                                  href={
                                    movie.watchProviders?.results?.US?.link!
                                  }
                                  key={index}
                                  className="w-[55px] h-[55px] flex-shrink-0 transform transition-transform  duration-200  hover:scale-105  hover:shadow-xl"
                                >
                                  <Image
                                    src={`${BASE_ORIGINAL_IMAGE_URL}${item.logoPath}`}
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
                {movie.credits?.cast && movie.credits.cast.length > 0 && (
                  <Suspense
                    fallback={
                      <Skeleton className="w-full h-[356px] rounded-xl" />
                    }
                  >
                    {movie.credits.cast && (
                      <div>
                        <h2 className={`text-2xl font-bold -mb-9`}>Cast</h2>
                        <div className="pt-2 pb-4 pl-8 md:pl-3 -ml-8 md:ml-0 md:w-full w-screen">
                          <ImageCarouselClient
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
                            className="md:-ml-6"
                          />
                        </div>
                      </div>
                    )}
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
              </div>

              <Suspense
                fallback={<Skeleton className="w-full h-[194px] rounded-xl" />}
              >
                <ReviewSection id={tmdbId} type={"movie"} />
              </Suspense>
            </div>
          </div>
          {videoPath !== undefined && (
            <Suspense>
              <VideoPlayerClient youtubeId={videoPath} id={params.id} />
            </Suspense>
          )}
        </>
      )}
    </main>
  );
}
