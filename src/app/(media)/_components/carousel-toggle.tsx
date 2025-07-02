"use client";

import { useState } from "react";
import ImageCarousel from "@/components/image-carousel";

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
  const [view, setView] = useState<0 | 1>(0);

  return (
    <div className="space-y-4">
      <ImageCarousel
        title={
          <div className="grid w-full auto-cols-max grid-flow-col items-center justify-between sm:grid-cols-[225px_1fr_auto]">
            <h2 className={`text-2xl font-bold sm:pl-2`}>{title}</h2>
            <div className="flex items-center space-x-2">
              {options.map((opt, index) => (
                <button
                  key={index}
                  onClick={() => setView(index as 0 | 1)}
                  className={`sm:text-md rounded-2xl px-3 text-sm font-semibold transition ${
                    view === index
                      ? "bg-blue-500/80 text-white backdrop-blur-lg"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        }
        items={options[view]?.items!}
      />
    </div>
  );
}
