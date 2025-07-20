import { EpisodeHeader } from "@/app/(media)/_components/media-header";
import { RecommendationsSection } from "@/app/(media)/_components/recommendations-section";
import TopCast from "@/app/(media)/_components/top-cast";
import { fetchEpisodeData, fetchTvDetails } from "@/app/(media)/actions";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function EpisodePage({
  params,
}: {
  params: { id: number; seasonNumber: number; episodeNumber: number };
}) {
  const seasonNumber = params.episodeNumber;
  const seriesId = params.id;
  const episodeNumber = params.episodeNumber;
  const episode = await fetchEpisodeData(seriesId, seasonNumber, episodeNumber);
  const isReleased: boolean =
    episode.airDate !== undefined &&
    episode.airDate !== null &&
    new Date(episode.airDate).valueOf() < Date.now();
  const tv = await fetchTvDetails(seriesId);
  const firstAirDate =
    typeof tv.firstAirDate === "string" ? new Date(tv.firstAirDate) : null;
  const isCastValid = episode.guestStars && episode.guestStars?.length > 0;

  return (
    <main>
      {episode && (
        <>
          <div className="h-full w-full overflow-x-hidden pb-20">
            <div className="relative items-end px-3 pt-16 md:container">
              <div className="items-end space-y-5 px-0 md:pt-0 lg:px-24">
                <section>
                  <EpisodeHeader
                    e={episode}
                    airDateLabel={"Air Date"}
                    isReleased={isReleased}
                    showId={seriesId}
                  />
                </section>
                {isCastValid && (
                  <TopCast
                    cast={episode.guestStars ?? []}
                    title="Episode Cast"
                  />
                )}
                <section className="media-card space-y-10">
                  <Link
                    href={`/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}/credits`}
                    className="flex items-end hover:text-gray-400"
                  >
                    <h2 className={`text-2xl font-bold`}>All Cast and Crew</h2>
                    <ChevronRight size={30} />
                  </Link>
                </section>
                {tv.recommendations?.results &&
                  tv.recommendations?.results.length > 0 && (
                    <RecommendationsSection
                      titles={tv.recommendations?.results}
                      mediaType="tv"
                    />
                  )}
                <section></section>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
