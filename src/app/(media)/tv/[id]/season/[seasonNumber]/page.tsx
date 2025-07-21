import { fetchTvDetails, fetchSeasonData } from "@/app/(media)/actions";
import { EpisodeCard } from "../../../_components/episode-card";

export default async function SeasonNumberPage({
  params,
}: {
  params: { id: number; seasonNumber: number };
}) {
  const seasonNumber = params.seasonNumber;
  const seriesId = params.id;
  const tv = await fetchTvDetails(seriesId);

  const season = await fetchSeasonData(seriesId, seasonNumber);
  return (
    <ul className="mt-6 flex flex-col items-center justify-center space-y-3 px-2">
      {season?.episodes &&
        season?.episodes.map((e, index) => (
          <li key={index} className="w-full max-w-4xl">
            <EpisodeCard episode={e} showId={seriesId} />
          </li>
        ))}
    </ul>
  );
}
