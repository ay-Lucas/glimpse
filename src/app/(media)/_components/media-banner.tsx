"use client";
import { BASE_SMALL_BACKDROP_URL } from "@/lib/constants";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Vibrant } from "node-vibrant/browser";
import { useEffect, useMemo, useState } from "react";

export default function MediaBanner({
  name,
  id,
  firstAirDate,
  backdropPath,
  mediaType,
}: {
  name: string;
  id: number;
  firstAirDate: Date | null;
  backdropPath: string;
  mediaType: "tv" | "movie";
}) {
  const [bannerColor, setBannerColor] = useState("transparent");

  const params = useParams();
  const { episodeNumber, seasonNumber } = params;
  const baseHref = `/tv/${id}`;

  const src = `${BASE_SMALL_BACKDROP_URL}${backdropPath}`;
  const formattedFirstAirDate = firstAirDate
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
      }).format(new Date(firstAirDate))
    : null;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = async () => {
      const color = await getBannerColor(src);
      setBannerColor(color);
    };
  }, [src]);

  const { backLabel, href } = useMemo(() => {
    if (seasonNumber && episodeNumber) {
      return {
        backLabel: "Back to episodes",
        href: `${baseHref}/seasons/${seasonNumber}`,
      };
    }
    if (seasonNumber) {
      return { backLabel: "Back to seasons", href: `${baseHref}/seasons` };
    }
    return { backLabel: "Back to main", href: baseHref };
  }, [baseHref, seasonNumber, episodeNumber]);

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="absolute inset-0 transition-colors duration-200"
        style={{ backgroundColor: bannerColor }}
      />
      <div className="relative flex h-full items-center justify-center px-3 py-2 shadow-md">
        <div>
          <h1 className="text-3xl font-semibold text-white">
            {name}
            {formattedFirstAirDate && ` (${formattedFirstAirDate})`}
          </h1>
          <Link
            href={href}
            className="-ml-1 mt-2 flex w-fit items-center text-white hover:text-gray-400"
          >
            <ChevronLeft size={24} />
            <span className="text-lg font-semibold">{backLabel}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

async function getBannerColor(src: string) {
  try {
    const palette = await Promise.resolve(Vibrant.from(src).getPalette());
    const [r, g, b] = palette.DarkVibrant?.rgb ?? [0, 0, 0];
    return `rgba(${r},${g},${b},0.9)`;
  } catch {
    return "rgba(0,0,0,0.7)";
  }
}
