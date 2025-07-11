import CastCard from "@/components/cast-card";
import MediaCarousel from "@/components/media-carousel";
import { DEFAULT_BLUR_DATA_URL } from "@/lib/constants";
import { Cast } from "@/types/request-types-camelcase";
import Link from "next/link";

export default function TopCast({ cast }: { cast: Cast[] }) {
  const items = cast?.splice(0, 10).map((item, index: number) => (
    <Link href={`/person/${item.id}`} key={index}>
      <CastCard
        name={item.name}
        character={item.character}
        imagePath={item.profilePath}
        index={index}
        blurDataURL={DEFAULT_BLUR_DATA_URL}
        className="pb-3 pt-2"
      />
    </Link>
  ));

  return (
    <section className="media-card">
      <h2 className={`text-2xl font-bold`}>Top Cast</h2>
      <MediaCarousel items={items} breakpointType="poster" />
    </section>
  );
}
