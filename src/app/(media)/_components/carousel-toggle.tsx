"use client";

import { ReactNode, useState } from "react";
import type { DiscoverItem } from "@/app/discover/actions";
import ImageCarousel from "@/components/image-carousel";
import { Card } from "@/components/card";
import { BASE_POSTER_IMAGE_URL } from "@/lib/constants";

interface CarouselToggleProps {
  weeklyItems: ReactNode[];
  dailyItems: ReactNode[];
  title: string
}

export default function CarouselToggle({
  weeklyItems,
  dailyItems,
  title
}: CarouselToggleProps) {
  const [view, setView] = useState<0 | 1>(0);

  const options = [
    { label: "Weekly", items: weeklyItems },
    { label: "Daily", items: dailyItems },
  ];

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
