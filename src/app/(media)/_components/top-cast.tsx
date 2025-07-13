import MediaCarousel from "@/components/media-carousel";
import { SlideImageCard } from "@/components/slide-image-card";
import { Cast } from "@/types/request-types-camelcase";
import Link from "next/link";

export default function TopCast({ cast }: { cast: Cast[] }) {
  const items = cast
    ?.splice(0, 10)
    .map((item, index) => <SlideCastCard cast={item} key={index} />);

  return (
    <section className="media-card">
      <h2 className={`pb-3 text-2xl font-bold`}>Top Cast</h2>
      <MediaCarousel items={items} breakpointType="posterCard" />
    </section>
  );
}

export function SlideCastCard({ cast }: { cast: Cast }) {
  return (
    <Link href={`/person/${cast.id}`}>
      <SlideImageCard
        key={cast.id}
        src={`/tmdb/t/p/w342${cast.profilePath}`}
        alt={`poster of ${cast.name}`}
        aspectClass="aspect-[2/3]"
      />
      <div className="mt-2 pb-4 text-start">
        <p className="line-clamp-1 text-sm font-semibold">{cast.name}</p>
        <p className="line-clamp-1 text-sm text-gray-400">
          as {cast.character}
        </p>
      </div>
    </Link>
  );
}
