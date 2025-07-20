import CreditsSection from "@/app/(media)/_components/credits-page";
import { fetchEpisodeData, fetchTvDetails } from "@/app/(media)/actions";
import { toDateString } from "@/lib/dates";

export default async function EpisodeCreditsPage({
  params,
}: {
  params: { id: number; seasonNumber: number; episodeNumber: number };
}) {
  const episode = await fetchEpisodeData(
    Number(params.id),
    params.seasonNumber,
    params.episodeNumber
  );
  const tv = await fetchTvDetails(Number(params.id));
  const airDate = toDateString(episode.airDate);
  return (
    <main className="pt-3">
      <CreditsSection
        mediaType="tv"
        showId={params.id}
        cast={episode.credits?.cast ?? []}
        crew={episode.credits?.crew ?? []}
        releaseDate={airDate}
        title={episode.name ?? ""}
      />
    </main>
  );
}
