import { MovieResult, TvResult } from "@/types/request-types-camelcase";
import MediaCarousel, { MediaCarouselProps } from "./media-carousel";
import { mkCards } from "@/app/discover/_components/discover-utils";
import { hasPoster, isEnglish } from "@/lib/filters";

interface TitleCarouselProps extends Omit<MediaCarouselProps, "items"> {
  title: string;
  titles: (MovieResult | TvResult)[];
}

export default function TitleCarousel({
  titles,
  breakpointType,
  className,
  title,
}: TitleCarouselProps) {
  const filteredTitles = titles.filter((t) => isEnglish(t) && hasPoster(t));
  const uniqueTitles = uniqueById(filteredTitles);
  return (
    <>
      <h2 className="text-2xl font-bold sm:pl-2">{title}</h2>
      <MediaCarousel
        items={mkCards(uniqueTitles, "tv")}
        breakpointType={breakpointType}
      />
    </>
  );
}

export const uniqueById = <T extends { id: number }>(arr: T[]) => {
  const seen = new Set<number>();
  return arr.filter((item) => !seen.has(item.id) && seen.add(item.id));
};
