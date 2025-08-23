import { MovieResult, TvResult } from "@/types/request-types-camelcase";
import MediaCarousel, { MediaCarouselProps } from "./media-carousel";
import { mkCards } from "@/app/discover/_components/discover-utils";
import { hasPoster, isEnglish } from "@/lib/filters";

interface TitleCarouselProps extends Omit<MediaCarouselProps, "items"> {
  title: string;
  titles: (MovieResult | TvResult)[];
  englishOnly?: boolean;
}

export default function TitleCarousel({
  titles,
  breakpointType,
  className,
  title,
}: TitleCarouselProps) {
  const filteredTitles = titles.filter((t) => isEnglish(t) && hasPoster(t));
  const uniqueTitles = uniqueById(filteredTitles);
  const sortedTitles = sortByDate(uniqueTitles);
  return (
    <>
      <h2 id={title} className="scroll-mt-16 text-2xl font-bold">
        {title}
      </h2>
      <MediaCarousel
        items={mkCards(sortedTitles, "tv")}
        breakpointType={breakpointType}
      />
    </>
  );
}

export const uniqueById = <T extends { id: number }>(arr: T[]) => {
  const seen = new Set<number>();
  return arr.filter((item) => !seen.has(item.id) && seen.add(item.id));
};

function sortByDate(titles: (MovieResult | TvResult)[]) {
  return titles.sort((a, b) => {
    const dateStrA =
      (a as TvResult).firstAirDate?.toString() ||
      (a as MovieResult).releaseDate?.toString();
    const dateA = dateStrA ? new Date(dateStrA).valueOf() : Infinity;

    const dateStrB =
      (b as TvResult).firstAirDate?.toString() ||
      (b as MovieResult).releaseDate?.toString();
    const dateB = dateStrB ? new Date(dateStrB).valueOf() : Infinity;
    return dateB - dateA;
  });
}
