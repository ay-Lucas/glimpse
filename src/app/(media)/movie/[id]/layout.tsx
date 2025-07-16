import { ReactNode } from "react";
import Image from "next/image";
import { fetchMovieDetails } from "@/app/(media)/actions";
import {
  BASE_ORIGINAL_IMAGE_URL,
  DEFAULT_BLUR_DATA_URL,
} from "@/lib/constants";
import { getRedisBlurValue } from "@/services/cache";
import { ContentRatingProvider } from "@/context/content-rating";

export const revalidate = 43200; // 12 hours

export default async function MovieLayout({
  params,
  children,
}: {
  params: { id: number };
  children: ReactNode;
}) {
  const tmdbId = params.id;
  const movie = await fetchMovieDetails(tmdbId);
  const blurData = await getRedisBlurValue("movie", params.id);
  return (
    <div className="h-full w-full overflow-x-hidden">
      <div className="absolute left-0 top-0 mb-10 h-screen w-full">
        {movie?.backdropPath ? (
          <div className="absolute h-full w-full bg-gradient-to-t from-background via-background/95 via-30% to-transparent">
            <div className="absolute h-full w-full bg-background/40"></div>
            <Image
              fill
              src={`${BASE_ORIGINAL_IMAGE_URL}${movie.backdropPath}`}
              quality={70}
              alt="header image"
              className={`-z-10 object-cover`}
              sizes="100vw"
              placeholder="blur"
              blurDataURL={blurData?.backdropBlur ?? DEFAULT_BLUR_DATA_URL}
            />
          </div>
        ) : (
          <div className="absolute left-0 top-0 z-0 h-full w-full items-center justify-center bg-gradient-to-b from-background via-gray-900 to-background/50" />
        )}
      </div>
      <ContentRatingProvider
        ratings={movie.releaseDates?.results ?? []}
        mediaType="movie"
      >
        {children}
      </ContentRatingProvider>
    </div>
  );
}
