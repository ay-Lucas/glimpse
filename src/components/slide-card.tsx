// components/SlideCard.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

export function SlideCard({
  src,
  alt,
  aspectClass, // e.g. "aspect-[2/3]" or "aspect-[16/9]"
}: {
  src: string;
  alt: string;
  aspectClass: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`relative inset-0 w-full overflow-hidden ${aspectClass} rounded-lg bg-gray-200`}
    >
      {/* Skeleton */}
      {!loaded && (
        <div className="absolute inset-0 animate-pulse rounded-lg bg-gray-300" />
      )}
      {/* <div className="rounded-lg bg-gray-200" /> */}

      {/* Real image */}
      <Image
        src={src}
        alt={alt}
        fill
        loading="lazy"
        unoptimized
        onLoad={() => setLoaded(true)} // ← use onLoad instead
        className={`absolute inset-0 object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} rounded-lg`}
      />
    </div>
  );
}
