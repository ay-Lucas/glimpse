import MediaCarousel from "@/components/media-carousel";
import { SlideCastCard } from "@/components/slide-cast-card";
import { Cast, GuestStar } from "@/types/request-types-camelcase";

export default function TopCast({
  cast,
  title,
}: {
  cast: Cast[] | GuestStar[];
  title: string;
}) {
  const items = cast
    ?.splice(0, 10)
    .map((item, index) => <SlideCastCard cast={item} key={index} />);

  return (
    <section className="media-card">
      <h2 className={`pb-3 text-2xl font-bold`}>{title}</h2>
      <MediaCarousel items={items} breakpointType="cast" />
    </section>
  );
}
