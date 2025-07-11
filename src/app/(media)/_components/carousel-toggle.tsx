"use client";

import { useState } from "react";
import MediaCarousel, {
  CarouselBreakpoints,
} from "@/components/media-carousel";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface CarouselToggleProps {
  options: {
    items: JSX.Element[];
    label: string;
  }[];
  title: string;
}

export default function CarouselToggle({
  options,
  title,
}: CarouselToggleProps) {
  const [breakpointType, setBreakpointType] =
    useState<CarouselBreakpoints>("backdrop");

  function toggle(to: CarouselBreakpoints, newItems: JSX.Element[]) {
    // fade out
    setTimeout(() => {
      setCarouselItems(newItems);
      setBreakpointType(to);
      // fade back in
    }, 300); // match your CSS duration
  }
  const validOptions = options.filter((opt) => opt.items.length > 0);
  const firstOption = validOptions[0];
  const [carouselItems, setCarouselItems] = useState<JSX.Element[]>(
    validOptions[0]?.items ?? []
  );

  return (
    <div className="space-y-4">
      <div className="xxs:grid-cols-[225px_1fr] grid w-full auto-cols-auto grid-flow-col grid-cols-[200px_1fr] items-center justify-between">
        <h2 className="text-2xl font-bold sm:pl-2">{title}</h2>

        <ToggleGroup
          variant="outline"
          type="single"
          defaultValue={validOptions[0]?.label}
          className="justify-start"
        >
          {validOptions.length > 0 &&
            validOptions.map((opt, index) => (
              <ToggleGroupItem
                key={`${opt.label}${index}`}
                value={opt.label}
                aria-label={`Toggle ${opt.label}`}
                onClick={() => toggle("title", opt.items)}
              >
                <h2>{opt.label}</h2>
              </ToggleGroupItem>
            ))}
        </ToggleGroup>
      </div>
      <MediaCarousel breakpointType="title" items={carouselItems} />
    </div>
  );
}
