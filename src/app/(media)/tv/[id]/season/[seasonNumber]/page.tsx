import { fetchTvDetails, fetchSeasonData } from "@/app/(media)/actions";
import { EpisodeCard } from "../../../_components/episode-card";

export default async function SeasonNumber({
  params,
}: {
  params: { id: number; seasonNumber: number };
}) {
  const seasonNumber = params.seasonNumber;
  const seriesId = params.id;
  const tv = await fetchTvDetails(seriesId);

  const season = await fetchSeasonData(seriesId, seasonNumber);
  return (
    <ul className="mt-6 grid place-content-center space-y-3 px-2">
      {season?.episodes &&
        season?.episodes.map((e, index) => (
          <li key={index} className="max-w-4xl">
            <EpisodeCard episode={e} showId={seriesId} />
          </li>
        ))}
    </ul>
  );
}
