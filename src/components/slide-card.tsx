"use client";

import TmdbRating from "@/app/(media)/_components/tmdb-rating";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";
import AdultFlag from "@/app/(media)/_components/adult-flag";
import { Badge } from "./ui/badge";
import dynamic from "next/dynamic";
import { useSupabase } from "@/context/supabase";
import MediaActions from "@/app/(media)/_components/media-actions";

// const MediaActions = dynamic(
//   () => import("@/app/(media)/_components/media-actions"),
//   { ssr: false }
// );

export function SlideCard({
  alt,
  aspectClass, // e.g. "aspect-[2/3]" or "aspect-[16/9]"
  props,
  unoptimized = false,
  title,
  overview,
  tmdbVoteAverage,
  tmdbVoteCount,
  tmdbId,
  mediaType,
  releaseDate,
  imagePath,
  baseUrl,
  blurDataURL,
  loading = "lazy",
  className = "",
  isAdult,
  rating,
  enableSafeImage = false,
}: {
  alt: string;
  aspectClass: string;
  className?: string;
  props?: ImageProps;
  blurDataURL?: string;
  unoptimized?: boolean;
  loading?: "lazy" | "eager";
  title?: string;
  overview?: string;
  tmdbVoteAverage?: number;
  tmdbVoteCount?: number;
  tmdbId: number;
  mediaType: "tv" | "movie" | "person";
  isAdult?: boolean;
  releaseDate?: Date | null;
  imagePath?: string | null;
  baseUrl: string;
  rating?: string | null;
  enableSafeImage?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const src = `${baseUrl}${imagePath}`;
  const dateLabel = releaseDate
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(releaseDate))
    : null;
  const { user } = useSupabase();
  return (
    <div className="group h-full">
      {mediaType !== "person" && (
        <div
          className={`absolute right-0 top-0 z-10 transition-opacity duration-300 ease-out ${user ? "opacity-100 md:opacity-0 md:group-hover:opacity-100" : "opacity-100"}`}
        >
          <MediaActions variant="icon" mediaType={mediaType} tmdbId={tmdbId} />
        </div>
      )}
      <Link
        href={`/${mediaType}/${tmdbId}`}
        prefetch={true}
        className={`group relative inset-0 flex w-full items-end ${aspectClass} rounded-lg ${className} `}
      >
        {/* Skeleton */}
        {!loaded && !blurDataURL && (
          <Skeleton className="absolute inset-0 rounded-lg" />
          //<div className="absolute inset-0 animate-pulse rounded-lg bg-black" />
        )}
        <Image
          {...props}
          src={src}
          alt={alt}
          fill
          loading={loading}
          unoptimized={unoptimized}
          placeholder={blurDataURL ? "blur" : "empty"}
          blurDataURL={blurDataURL}
          onLoad={() => setLoaded(true)}
          className={`inset-0 object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} rounded-lg`}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 100vw"
        />
        {isAdult && (
          <div className="absolute right-0 top-0">
            <Badge variant={"destructive"}>
              <AdultFlag isAdult={isAdult}></AdultFlag>
            </Badge>
          </div>
        )}
        {overview && (
          <div className="relative flex items-end bg-[linear-gradient(to_top,rgba(0,0,0,0.9)_90%,transparent)] p-2 opacity-0 transition-opacity duration-300 ease-out md:group-hover:opacity-100">
            <div className="">
              <p className="line-clamp-5 pt-2 text-sm text-gray-200">
                {overview}
              </p>
            </div>
          </div>
        )}
      </Link>
      <div className="z-20 w-full">
        <div className="flex flex-col">
          <div className="flex items-center justify-between pt-1">
            {mediaType !== "person" &&
            tmdbVoteAverage !== undefined &&
            tmdbVoteAverage !== 0 ? (
              <TmdbRating
                mediaType={mediaType}
                tmdbId={tmdbId}
                tmdbVoteAverage={tmdbVoteAverage}
                tmdbVoteCount={tmdbVoteCount}
                size="small"
              />
            ) : (
              <div />
            )}
          </div>
          {dateLabel && <time dateTime={dateLabel}>{dateLabel}</time>}
          <h2 className="!select-text text-md font-semibold text-white md:text-lg">
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
}
