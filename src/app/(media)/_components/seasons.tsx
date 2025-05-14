import { TvSeasonResponse } from "@/types/request-types";
import { getSeasonData } from "@/app/(media)/actions";
import { SeasonAccordion } from "./season-accordion";

export async function Seasons({
  id,
  numberOfSeasons,
}: {
  id: number;
  numberOfSeasons: number;
}) {
  const episodesData: Array<TvSeasonResponse> = [];
  for (let i = 0; i < numberOfSeasons!; i++) {
    const episodeData = await getSeasonData(id, i + 1);
    episodesData.push(episodeData);
  }
  return (
    <>
      {episodesData[0]?.episodes &&
        episodesData[0]?.episodes?.length > 0 &&
        episodesData[0].episodes[0]?.name !== "Episode 1" && (
          <div className="space-y-2">
            {episodesData.map(
              (item, index) =>
                item.episodes &&
                item.episodes.length > 0 && (
                  <SeasonAccordion
                    episodesData={item?.episodes!}
                    number={item.season_number!}
                    key={index}
                  />
                ),
            )}
          </div>
        )}
    </>
  );
}
