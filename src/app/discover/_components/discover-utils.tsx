import { SlideCard } from "@/components/slide-card";
import { BASE_POSTER_IMAGE_URL } from "@/lib/constants";
import { getRedisBlurValues } from "@/services/cache";
import { DiscoverItem } from "@/types/camel-index";
import { BlurMap } from "@/types/redis";
import { MovieResult, TvResult } from "@/types/request-types-camelcase";
import Link from "next/link";

// export const convertToDiscoverItems = async (
//   array: MovieResult[] | TvResult[],
//   blurMap: BlurMap
// ): Promise<DiscoverItem[]> => {
//   const erroredItems: string[] = [];
//   const promises = array.map(async (item) => {
//
//     // const posterBlurDataUrl = backfilledBlurData?.posterBlur
//     //   ? backfilledBlurData.posterBlur : await getBlurData(`${BaseImageUrl.BLUR}${item.posterPath}`)
//     const posterBlurDataUrl = backfilledBlurData?.posterBlur;
//     const discoverItem: DiscoverItem = {
//       tmdbId: item.id,
//       title: title,
//       voteAverage: item.voteAverage,
//       voteCount: item.voteCount,
//       releaseDate: releaseDate,
//       posterPath: item.posterPath,
//       backdropPath: item.backdropPath,
//       posterBlurDataUrl,
//       overview: item.overview,
//       mediaType: item.mediaType,
//
//     }
//
//     return {
//       tmdbId: item.id,
//       title: title,
//       voteAverage
//       posterPath: item.posterPath,
//       backdropPath: item.backdropPath,
//       posterBlurDataUrl,
//       overview: item.overview,
//       mediaType: item.mediaType,
//     };
//   });
//   if (erroredItems.length)
//     console.warn(
//       `\nPoster blur data not found for: \n${erroredItems.join("\n")}`
//     );
//
//   return await Promise.all(promises);
// };

export const mkCards = (
  items: (TvResult | MovieResult)[],
  mediaType: "tv" | "movie",
  blurMap: BlurMap
): JSX.Element[] => {
  return items.map((item) => {
    const title = (item as MovieResult).title || (item as TvResult).name;
    const backfilledBlurData = blurMap.get(item.id);
    const releaseDateStr =
      (item as MovieResult).releaseDate || (item as TvResult).firstAirDate;
    const releaseDate =
      typeof releaseDateStr === "string" ? new Date(releaseDateStr) : null;
    if (!backfilledBlurData?.posterBlur)
      console.warn(`\nPoster blur data not found for: ${title} : ${item.id}`);

    return (
      <SlideCard
        rating={null}
        tmdbVoteAverage={item.voteAverage ?? undefined}
        tmdbVoteCount={item.voteCount ?? undefined}
        tmdbId={item.id}
        releaseDate={releaseDate}
        mediaType={mediaType}
        data={item}
        aspectClass="aspect-[2/3]"
        alt={`poster of ${title}`}
        title={title}
        overview={item.overview}
        imagePath={item.posterPath}
        baseUrl={BASE_POSTER_IMAGE_URL}
        blurDataURL={backfilledBlurData?.posterBlur}
        loading="lazy"
      />
    );
  });
};

export async function getBlurDataMap(titles: DiscoverItem[]) {
  const map: BlurMap = new Map();

  // Return empty map if empty array
  if (titles.length === 0) return map;

  // const ids = titles.map((t) => t.tmdbId)
  const keys = titles.map((item) => `lqip:${item.mediaType}:${item.tmdbId}`);
  const rawValues = await getRedisBlurValues(keys);

  if (!rawValues || rawValues.length !== keys.length) {
    console.warn(
      `getRedisBlurValues returned ${
        rawValues?.length ?? 0
      } entries for ${keys.length} titles`
    );
  }

  if (!rawValues) {
    console.warn("getRedisBlurValues is undefined");
    return map;
  }

  rawValues.forEach((data, i) => {
    const id = titles[i]?.tmdbId;
    const title = titles[i]?.title;
    if (data && id && title) {
      map.set(id, data);
    } else {
      console.warn(`Missing blur data for TMDB #${id} (“${title}”)`);
    }
  });

  return map;
}
