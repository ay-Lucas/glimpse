import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";

export function SlideImageCard({
  src,
  alt,
  aspectClass, // e.g. "aspect-[2/3]" or "aspect-[16/9]"
  className,
  props,
  blurDataURL,
  unoptimized = false,
  loading = "lazy",
}: {
  src: string;
  alt: string;
  aspectClass: string;
  className?: string;
  props?: ImageProps;
  blurDataURL?: string;
  unoptimized?: boolean;
  loading?: "lazy" | "eager";
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      className={`group relative inset-0 w-full overflow-hidden ${aspectClass} rounded-lg ${className}`}
    >
      {/* Skeleton */}
      {!loaded && (
        <Skeleton className="absolute inset-0 rounded-lg" />
        //<div className="absolute inset-0 animate-pulse rounded-lg bg-gray-700" />
      )}
      {/* <div className="rounded-lg bg-gray-200" /> */}

      {/* Real image */}
      <Image
        {...props}
        src={src}
        alt={alt}
        fill
        loading={loading}
        unoptimized={unoptimized}
        placeholder={blurDataURL ? "blur" : "empty"}
        blurDataURL={blurDataURL}
        onLoad={() => setLoaded(true)} // ← use onLoad instead
        className={`absolute inset-0 object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} rounded-lg`}
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 100vw"
      />
    </div>
  );
}
