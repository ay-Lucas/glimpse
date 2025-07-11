"use client";

import TmdbRating from "@/app/(media)/_components/tmdb-rating";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import MediaActions from "@/app/(media)/_components/media-actions";
import {
  MovieResult,
  PersonResult,
  TvResult,
} from "@/types/request-types-camelcase";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";

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
  rating,
  data,
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
  releaseDate: Date | null;
  imagePath?: string | null;
  baseUrl: string;
  rating: string | null;
  data: TvResult | MovieResult | PersonResult | null;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="h-full max-w-[200px]">
      <Link
        href={`/${mediaType}/${tmdbId}`}
        key={tmdbId}
        prefetch={true}
        className={`group relative inset-0 flex w-full items-end ${aspectClass} rounded-lg ${className} max-w-[200px]`}
      >
        {/* Skeleton */}
        {!loaded && !blurDataURL && (
          <Skeleton className="absolute inset-0 rounded-lg" />
          //<div className="absolute inset-0 animate-pulse rounded-lg bg-black" />
        )}

        <Image
          {...props}
          src={`${baseUrl}${imagePath}`}
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
        {overview && (
          <div className="relative flex items-end bg-[linear-gradient(to_top,rgba(0,0,0,0.9)_90%,transparent)] p-2 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100">
            <div className="">
              <p className="line-clamp-5 pt-2 text-sm text-gray-200">
                {overview}
              </p>
            </div>
          </div>
        )}
      </Link>
      <div className="z-20 w-full pb-3">
        <div className="flex flex-col">
          <div className="flex justify-between">
            <div>
              {mediaType !== "person" &&
                tmdbVoteAverage !== undefined &&
                tmdbVoteAverage !== 0 && (
                  <TmdbRating
                    mediaType={mediaType}
                    tmdbId={tmdbId}
                    tmdbVoteAverage={tmdbVoteAverage}
                    tmdbVoteCount={tmdbVoteCount}
                  />
                )}
            </div>
            {mediaType !== "person" && data !== null && (
              <MediaActions
                variant="icon"
                mediaType={mediaType}
                data={data as TvResult | MovieResult}
                tmdbId={tmdbId}
              />
            )}
          </div>
          <h2 className="!select-text text-lg font-semibold text-white">
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
}
