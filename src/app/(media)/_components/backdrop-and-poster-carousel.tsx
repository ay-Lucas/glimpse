"use client";
import MediaCarousel, {
  CarouselBreakpoints,
} from "@/components/media-carousel";
import { SlideImageCard } from "@/components/slide-image-card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Backdrop, Logo, Poster } from "@/types/request-types-camelcase";
import { useState } from "react";

export default function BackdropAndPosterCarousel({
  name,
  backdrops,
  logos,
  posters,
}: {
  name: string;
  backdrops: Array<Backdrop>;
  logos: Array<Logo>;
  posters: Array<Poster>;
}) {
  const posterItems = posters.map((p, i) => (
    <SlideImageCard
      key={i}
      baseUrl="/tmdb/t/p/w342"
      imagePath={p.filePath}
      unoptimized={true}
      alt={`poster of ${name}`}
      aspectClass="aspect-[2/3]"
    />
  ));

  const backdropItems = backdrops.map((b, i) => (
    <SlideImageCard
      key={i}
      baseUrl="/tmdb/t/p/w780"
      imagePath={b.filePath}
      unoptimized={true}
      alt={`backdrop of ${name}`}
      aspectClass="aspect-[16/9]"
    />
  ));

  const [carouselItems, setCarouselItems] = useState<JSX.Element[]>(
    backdropItems.length ? backdropItems : posterItems
  );

  // const [show, setShow] = useState(true);
  function toggle(to: CarouselBreakpoints, newItems: JSX.Element[]) {
    // fade out
    // setShow(false);
    setTimeout(() => {
      setCarouselItems(newItems);
      setBreakpointType(to);
      // fade back in
    }, 300); // match your CSS duration
  }
  const [breakpointType, setBreakpointType] =
    useState<CarouselBreakpoints>("backdrop");

  const defaultValue =
    backdropItems.length > 0
      ? "backdrops"
      : posterItems.length > 0
        ? "posters"
        : undefined;

  return (
    <section className="media-card space-y-4">
      <div className="flex items-center space-x-3">
        <h2 className="text-2xl font-bold">Images</h2>
        <ToggleGroup
          variant="outline"
          type="single"
          defaultValue={defaultValue}
          className="justify-start"
        >
          {backdropItems.length > 0 && (
            <ToggleGroupItem
              value="backdrops"
              aria-label="Toggle backdrops"
              onClick={() => toggle("backdrop", backdropItems)}
            >
              <h2>Backdrops</h2>
            </ToggleGroupItem>
          )}
          {posterItems.length > 0 && (
            <ToggleGroupItem
              value="posters"
              aria-label="Toggle posters"
              onClick={() => toggle("largePoster", posterItems)}
            >
              <h2>Posters</h2>
            </ToggleGroupItem>
          )}
        </ToggleGroup>
      </div>
      <div key={breakpointType} className={`animate-fade-in`}>
        <MediaCarousel breakpointType={breakpointType} items={carouselItems} />
      </div>
    </section>
  );
}
