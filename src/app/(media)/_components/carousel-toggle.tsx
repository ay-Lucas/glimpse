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
    breakpointType: CarouselBreakpoints;
  }[];
  title: string;
}

export default function CarouselToggle({
  options,
  title,
}: CarouselToggleProps) {
  const [breakpointType, setBreakpointType] = useState<CarouselBreakpoints>(
    options[0]?.breakpointType ?? "title"
  );
  function toggle(to: CarouselBreakpoints, newItems: JSX.Element[]) {
    // fade out
    setTimeout(() => {
      setCarouselItems(newItems);
      setBreakpointType(to);
      // fade back in
    }, 300); // match your CSS duration
  }
  const validOptions = options.filter((opt) => opt.items.length > 0);
  const [carouselItems, setCarouselItems] = useState<JSX.Element[]>(
    validOptions[0]?.items ?? []
  );
  const css =
    breakpointType == "title"
      ? "grid grid-cols-[200px_1fr] xxs:grid-cols-[225px_1fr] auto-cols-auto grid-flow-col "
      : "flex space-x-4";

  return (
    <div className="space-y-4">
      <div className={`w-full items-center ${css}`}>
        <h2 className="text-2xl font-bold">{title}</h2>
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
                onClick={() => toggle(opt.breakpointType, opt.items)}
              >
                <h2>{opt.label}</h2>
              </ToggleGroupItem>
            ))}
        </ToggleGroup>
      </div>
      <div key={breakpointType} className={`animate-fade-in`}>
        <MediaCarousel breakpointType={breakpointType} items={carouselItems} />
      </div>
    </div>
  );
}
