import {
  fetchDiscoverTvIds,
  fetchTvDetails,
  getRecommendations,
} from "@/app/(media)/actions";
import Link from "next/link";
import { Video } from "@/types/request-types-snakecase";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { RecommededSection } from "@/app/(media)/_components/recommendedSection";
import ReviewSection from "@/app/(media)/_components/ReviewSection";
import { ChevronRight } from "lucide-react";
import VideoPlayer from "../../_components/video-player";
import { getRedisBlurValue } from "@/services/cache";
import { MediaHeader } from "../../_components/media-header";
import { MediaDetails } from "../../_components/media-details";
import MediaProviders from "../../_components/media-providers";
import { buildTvDetailItems } from "./utils";
import ImageCarousel from "@/components/image-carousel";
import CastCard from "@/components/cast-card";
import { BASE_CAST_IMAGE_URL, DEFAULT_BLUR_DATA_URL } from "@/lib/constants";
import { Separator } from "@radix-ui/react-dropdown-menu";

function getTrailer(videoArray: Array<Video>) {
  const trailer: Array<Video> = videoArray.filter(
    (video) => video.type === "Trailer"
  );
  if (trailer?.length !== 0) {
    return trailer[0];
  } else {
    const teaser: Array<Video> = videoArray.filter(
      (video) => video.type === "Teaser"
    );
    return teaser[0];
  }
}

// Generate all TV pages featured on Discover page (and their recommendations) at build
export async function generateStaticParams() {
  const tvIds = await fetchDiscoverTvIds();
  const rawTvIds = tvIds.map((item) => item.id);

  if (process.env.IS_LOCALHOST === "true") {
    return tvIds;
  }

  const recResponses = await Promise.all(
    tvIds.map((item) => getRecommendations(Number(item.id), "tv"))
  );

  const recIds = recResponses.flatMap(
    (res) => res?.results?.map((m) => m.id) ?? []
  );

  const uniqueIds = Array.from(new Set([...rawTvIds, ...recIds]));

  return uniqueIds.map((id) => ({ id: id.toString() }));
}

export default async function TvPage({ params }: { params: { id: number } }) {
  const tmdbId = Number(params.id);
  const tv = await fetchTvDetails(tmdbId);

  if (!tv) throw new Error("fetchTvDetails returned undefined");

  let videoPath;
  if (tv.videos !== undefined && tv.videos.results)
    videoPath = getTrailer(tv.videos.results)?.key;
  const rating =
    tv.contentRatings?.results.filter(
      (item) => item.iso31661 === "US" && item.rating !== ""
    )[0]?.rating ?? "";

  const isReleased: boolean =
    tv.firstAirDate !== undefined &&
    tv.firstAirDate !== null &&
    new Date(tv.firstAirDate).valueOf() < Date.now();
  const blurData = await getRedisBlurValue("tv", params.id);

  // console.log(tv)
  const detailItems = buildTvDetailItems(tv);
  // console.log(`Tv page rendered! ${tv.name}`)
  return (
    <main>
      {tv && (
        <>
          <div className="h-full w-full overflow-x-hidden pb-20">
            <div className="h-[6vh] md:h-[10vh]"></div>
            <div className="relative items-end px-3 pt-16 md:container">
              <div className="items-end space-y-5 px-0 md:pt-0 lg:px-24">
                <section>
                  <MediaHeader
                    rating={rating}
                    dateValue={tv.firstAirDate?.toString()}
                    dateLabel={"First Aired"}
                    dateValue2={tv.lastAirDate?.toString()}
                    dateLabel2={"Last Aired"}
                    isReleased={isReleased}
                    overview={tv.overview}
                    status={tv.status ?? undefined}
                    posterPath={tv.posterPath ?? null}
                    posterBlur={blurData?.posterBlur ?? null}
                    title={tv.name}
                    genres={tv.genres ?? null}
                    imdbId={tv.externalIds?.imdbId ?? null}
                    tmdbId={params.id}
                    tmdbVoteAverage={tv.voteAverage ?? null}
                    tmdbVoteCount={tv.voteCount ?? null}
                    trailerPath={videoPath}
                    tagline={tv.tagline ?? null}
                    homepage={tv.homepage ?? null}
                    data={tv}
                    runtime={tv.runtime ?? null}
                    typeLabel="Series"
                    mediaType="tv"
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
                      tmdbWatchProviders={tv.watchProviders}
                      mediaType="tv"
                      releaseDate={tv.firstAirDate ?? null}
                      title={tv.name}
                      tmdbId={tv.id}
                    />
                  </Suspense>
                </section>
                {/* <section> */}
                <section className="media-card space-y-10">
                  {tv.numberOfSeasons && tv.numberOfSeasons > 0 && (
                    <Link
                      href={`/tv/${params.id}/seasons`}
                      className="flex items-end hover:text-gray-400"
                    >
                      <h2 className="text-2xl font-bold">
                        Season{tv.numberOfSeasons > 1 && "s"} (
                        {tv.numberOfSeasons})
                      </h2>
                      <ChevronRight size={30} />
                    </Link>
                  )}
                </section>
                {tv.credits?.cast && tv.credits.cast.length > 0 && (
                  <>
                    <section className="media-card space-y-10">
                      <Link
                        href={`/tv/${params.id}/credits`}
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
                      <section className="media-card">
                        <ImageCarousel
                          title={
                            <h2 className={`text-2xl font-bold`}>Top Cast</h2>
                          }
                          items={tv.credits.cast
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
                <Suspense
                  fallback={
                    <Skeleton className="h-[356px] w-full rounded-xl" />
                  }
                >
                  <RecommededSection
                    isReleased={isReleased}
                    mediaType="tv"
                    rating={rating}
                    tmdbId={tmdbId}
                  />
                </Suspense>
                <Suspense
                  fallback={
                    <Skeleton className="h-[194px] w-full rounded-xl" />
                  }
                >
                  <ReviewSection id={tmdbId} type={"tv"} />
                </Suspense>
              </div>
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
