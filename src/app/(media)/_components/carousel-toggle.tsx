"use client";

import { useState } from "react";
import ImageCarousel from "@/components/image-carousel";

interface CarouselToggleProps {
  options: {
    items: JSX.Element[]
    label: string;
  }[];
  title: string
}

export default function CarouselToggle({
  options,
  title
}: CarouselToggleProps) {
  const [view, setView] = useState<0 | 1>(0);

  return (
    <div className="space-y-4">
      <ImageCarousel
        title={
          <div className="flex space-x-4 items-center">
            <h2 className={`text-2xl font-bold ml-6 md:ml-1`}>
              {title}
            </h2>
            <div className="flex space-x-2 items-center">
              {options.map((opt, index) => (
                <button
                  key={index}
                  onClick={() => setView(index as 0 | 1)}
                  className={`px-3 rounded-2xl transition ${view === index
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
