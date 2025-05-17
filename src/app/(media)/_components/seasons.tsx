import { TvSeasonResponse } from "@/types/request-types";
import { getSeasonData } from "@/app/(media)/actions";
import { EpisodeWithBlur, SeasonAccordion } from "./season-accordion";
import { BaseImageUrl } from "@/lib/constants";
import { appendBlurDataToMediaArray } from "@/lib/blur-data-generator";

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

  const episodesWithBlur = (await Promise.all(
    episodesData.map(async (item) => {
      const posterPaths = item.episodes?.map((item) => item.still_path) ?? [];
      const episodes = await appendBlurDataToMediaArray(
        item.episodes!,
        BaseImageUrl.BLUR,
        posterPaths,
      );
      return {
        ...item,
        episodes: episodes,
      };
    }),
  )) as Array<TvSeasonResponse>;
  return (
    <>
      {episodesWithBlur[0]?.episodes &&
        (episodesWithBlur[0].episodes[0]?.name !== "Episode 1" ||
          episodesWithBlur[0]?.episodes[0]?.overview !== "") && (
          <div className="space-y-2">
            {episodesWithBlur.map(
              (item, index) =>
                item.episodes &&
                item.episodes.length > 0 && (
                  <SeasonAccordion
                    episodesData={item?.episodes as Array<EpisodeWithBlur>}
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
