import { Card } from "@/components/card";
import { getBlurData } from "@/lib/blur-data-generator";
import { BaseImageUrl } from "@/lib/constants";
import { getRedisBlurValues } from "@/services/cache";
import { DiscoverItem } from "@/types/camel-index";
import { BlurMap } from "@/types/redis";
import { MovieResult, TvResult } from "@/types/request-types-camelcase";
import Link from "next/link";

export const convertToDiscoverItems = (async (
  array: MovieResult[] | TvResult[],
  blurMap: BlurMap
): Promise<DiscoverItem[]> => {
  const erroredItems: string[] = [];
  const promises = array.map(async (item) => {
    const title = (item as MovieResult).title || (item as TvResult).name;
    const backfilledBlurData = blurMap.get(item.id);

    if (!backfilledBlurData?.posterBlur)
      erroredItems.push(`(${item.id}): ${title} `)

    // const posterBlurDataUrl = backfilledBlurData?.posterBlur
    //   ? backfilledBlurData.posterBlur : await getBlurData(`${BaseImageUrl.BLUR}${item.posterPath}`)
    const posterBlurDataUrl = backfilledBlurData?.posterBlur

    return {
      tmdbId: item.id,
      title: title,
      posterPath: item.posterPath,
      backdropPath: item.backdropPath,
      posterBlurDataUrl,
      overview: item.overview,
      mediaType: item.mediaType
    };
  });
  if (erroredItems.length)
    console.warn(`\nPoster blur data not found for: \n${erroredItems.join("\n")}`)

  return await Promise.all(promises);
})

export const mkCards = (items: DiscoverItem[], mediaType: "tv" | "movie"): JSX.Element[] =>
  items.map((item) => (
    <Link href={`/${mediaType}/${item.tmdbId}`} key={item.tmdbId} prefetch={true}>
      <Card
        title={item.title}
        overview={item.overview}
        imagePath={`${BaseImageUrl.POSTER}${item.posterPath}`}
        blurDataURL={item.posterBlurDataUrl}
        loading="lazy"
      />
    </Link>
  ));

export async function getBlurDataMap(titles: DiscoverItem[]) {
  const map: BlurMap = new Map();

  // Return empty map if empty array 
  if (titles.length === 0)
    return map;

  // const ids = titles.map((t) => t.tmdbId)
  const keys = titles.map((item) => `lqip:${item.mediaType}:${item.tmdbId}`);
  const rawValues = await getRedisBlurValues(keys);

  if (!rawValues || rawValues.length !== keys.length) {
    console.warn(
      `getRedisBlurValues returned ${rawValues?.length ?? 0
      } entries for ${keys.length} titles`
    )
  }

  if (!rawValues) {
    console.warn("getRedisBlurValues is undefined")
    return map;
  }

  rawValues.forEach((data, i) => {
    const id = titles[i]?.tmdbId
    const title = titles[i]?.title
    if (data && id && title) {
      map.set(id, data)
    } else {
      console.warn(`Missing blur data for TMDB #${id} (“${title}”)`)
    }
  })

  return map
}
