import { Episode, TvSeasonResponse } from "@/types/request-types";
import { getSeasonData } from "@/app/(media)/actions";
import { SeasonAccordion } from "./season-accordion";
import { BASE_BLUR_IMAGE_URL } from "@/lib/constants";
import { getBlurData } from "@/lib/blur-data-generator";

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

  const episodesWithPlaceholder = await Promise.all(
    episodesData.map(async (item) => {
      // If there are no episodes, default to an empty array
      const rawEpisodes = item.episodes ?? [];

      // Build an array of promises, then await them all
      const blurredEpisodes = await Promise.all(
        rawEpisodes.map(async (episode) => {
          // generate your blurDataURL for this episode

          let blurDataURL;
          if (item.poster_path) {
            let blurData = await getBlurData(
              `${BASE_BLUR_IMAGE_URL}${item.poster_path}`,
            );
            blurDataURL = blurData.base64;
          } else {
            blurDataURL =
              "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
          }

          return {
            ...episode,
            blurDataURL: blurDataURL,
          };
        }),
      );

      // Return a new item with the transformed episodes array
      return {
        ...item,
        episodes: blurredEpisodes,
      };
    }),
  );
  console.log(episodesWithPlaceholder);
  return (
    <>
      {episodesWithPlaceholder[0]?.episodes &&
        (episodesWithPlaceholder[0].episodes[0]?.name !== "Episode 1" ||
          episodesWithPlaceholder[0]?.episodes[0]?.overview !== "") && (
          <div className="space-y-2">
            {episodesWithPlaceholder.map(
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
