import Image from "next/image";
import MediaActions from "./media-actions";
import { BASE_POSTER_IMAGE_URL, DEFAULT_BLUR_DATA_URL } from "@/lib/constants";
import { ScoreCircle } from "./score-circle";
import { Genre } from "@/types/types";
import { FullMovie, FullTv } from "@/types/camel-index";

export interface MediaHeaderProps {
  title: string
  overview: string;
  dateLabel: string;         // e.g. "First Aired" or "Release"
  dateValue: string | undefined;        // ISO date string
  isReleased: boolean,
  rating: string | null;           // e.g. "PG-13"
  posterPath: string | null;
  posterBlur: string | null;
  tmdbVoteAverage: number | null;
  genres: Genre[] | null;
  data: FullTv | FullMovie
  trailerPath: string | undefined;
  tmdbId: number;
  status: string | undefined;           // e.g. "Ended" or "Released"
  typeLabel: string;         // e.g. "Series" or "Movie"
  mediaType: "tv" | "movie"
}

export function MediaHeader({
  title,
  overview,
  dateLabel,
  dateValue,
  isReleased,
  rating,
  status,
  posterPath,
  posterBlur,
  tmdbVoteAverage,
  genres,
  data,
  trailerPath,
  tmdbId,
  typeLabel,
  mediaType
}: MediaHeaderProps) {
  const formattedDate = dateValue
    ? new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateValue))
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[238px,1fr] gap-5 items-start">
      {posterPath && (
        <figure className="w-full">
          <Image
            quality={60}
            width={238}
            height={357}
            src={`${BASE_POSTER_IMAGE_URL}${posterPath}`}
            className="object-cover rounded-lg w-full h-full"
            priority
            placeholder="blur"
            blurDataURL={posterBlur ?? DEFAULT_BLUR_DATA_URL}
            alt={`${title} poster`}
            loading="eager"
          />
        </figure>
      )}

      <div className="space-y-6">
        <h1 className="text-3xl md:text-5xl font-bold text-center md:text-left">
          {title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {isReleased && tmdbVoteAverage != null && (
            <div className="flex flex-col items-center">
              <ScoreCircle
                size={54}
                strokeWidth={3}
                percentage={Math.round(tmdbVoteAverage * 10)}
              />
              <span className="sr-only">{tmdbVoteAverage}</span>
            </div>
          )}
          {genres && genres.length > 0 && (
            <>
              {genres.map((g) => (
                <span
                  key={g.id}
                  className="text-sm bg-gray-700/60 px-2 py-0.5 rounded-full hover:bg-gray-700 transition ring-1 ring-gray-400"
                >
                  {g.name}
                </span>
              ))}
            </>
          )}
        </div>
        <section className="flex flex-col space-y-4">
          <div className="grid grid-cols-4 md:grid-cols-5 gap-6 text-center md:text-left">
            {formattedDate && (
              <div>
                <div className="text-xs font-medium text-gray-400 uppercase">
                  {dateLabel}
                </div>
                <time dateTime={dateValue} className="mt-1 block">
                  {formattedDate}
                </time>
              </div>
            )}

            <div>
              <div className="text-xs font-medium text-gray-400 uppercase">
                Status
              </div>
              <div className="mt-1">{status ?? "Unknown"}</div>
            </div>

            {rating && (
              <div>
                <div className="text-xs font-medium text-gray-400 uppercase">
                  Rated
                </div>
                <div className="mt-1 inline-block border px-1 text-sm">
                  {rating}
                </div>
              </div>
            )}

            <div>
              <div className="text-xs font-medium text-gray-400 uppercase">
                Type
              </div>
              <div className="mt-1">{typeLabel}</div>
            </div>
          </div>

          <p className="md:text-md">{overview}</p>
        </section>
        <MediaActions
          data={data}
          videoPath={trailerPath}
          tmdbId={tmdbId}
          rating={rating ?? ""}
          mediaType={mediaType}
        />
      </div>
    </div>
  );
}
