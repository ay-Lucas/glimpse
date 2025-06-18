import { Card } from "@/components/card";
import { getBlurData } from "@/lib/blur-data-generator";
import { BaseImageUrl } from "@/lib/constants";
import { DiscoverItem } from "@/types/camel-index";
import { MovieResult, TvResult } from "@/types/request-types-camelcase";
import Link from "next/link";

export const convertToDiscoverItems = (async (
  array: MovieResult[] | TvResult[],
  blurMap: Map<number, string>
): Promise<DiscoverItem[]> => {

  const promises = array.map(async (item) => {
    const title = (item as MovieResult).title || (item as TvResult).name;
    const backfilledBlurData = blurMap.get(item.id);

    if (!backfilledBlurData)
      console.warn(`Blur data not found!" ${title} ${item.id}`)

    const posterBlurDataUrl = backfilledBlurData
      ? backfilledBlurData : await getBlurData(`${BaseImageUrl.BLUR}${item.posterPath}`)

    return {
      tmdbId: item.id,
      title: title,
      posterPath: item.posterPath,
      backdropPath: item.backdropPath,
      posterBlurDataUrl,
      overview: item.overview,
    };
  });

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

