import Image from "next/image";
import MediaActions from "./media-actions";
import { BASE_POSTER_IMAGE_URL, DEFAULT_BLUR_DATA_URL } from "@/lib/constants";
import { Genre } from "@/types/types";
import { FullMovie, FullTv } from "@/types/camel-index";
import { Expandable } from "./expandable";
import MediaRatings from "./media-ratings";

export interface MediaHeaderProps {
  title: string;
  overview: string;
  dateLabel: string; // e.g. "First Aired" or "Release"
  dateLabel2?: string; // e.g. "First Aired" or "Release"
  dateValue: string | undefined; // ISO date string
  dateValue2?: string; // ISO date string
  isReleased: boolean;
  rating: string | null; // e.g. "PG-13"
  posterPath: string | null;
  posterBlur: string | null;
  tmdbVoteAverage: number | null;
  tmdbVoteCount: number | null;
  genres: Genre[] | null;
  data: FullTv | FullMovie;
  trailerPath: string | undefined;
  tmdbId: number;
  imdbId: string | null;
  status: string | undefined; // e.g. "Ended" or "Released"
  tagline: string | null;
  homepage: string | null;
  runtime: number | null;
  typeLabel: string; // e.g. "Series" or "Movie"
  mediaType: "tv" | "movie";
}

export async function MediaHeader({
  title,
  overview,
  dateLabel,
  dateValue,
  dateLabel2,
  dateValue2,
  isReleased,
  rating,
  status,
  posterPath,
  posterBlur,
  tmdbVoteAverage,
  tmdbVoteCount,
  genres,
  data,
  trailerPath,
  tmdbId,
  imdbId,
  tagline,
  homepage,
  runtime,
  typeLabel,
  mediaType,
}: MediaHeaderProps) {
  const formattedDate1 = dateValue
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(dateValue))
    : null;

  const formattedDate2 = dateValue2
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(dateValue2))
    : null;

  function formatRuntime(totalMinutes: number | undefined | null) {
    if (typeof totalMinutes !== "number" || totalMinutes <= 0) return null;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.ceil(totalMinutes % 60);
    const label = [];
    if (hours > 0) label.push(`${hours}h`);
    if (minutes > 0) {
      label.push(`${minutes}m`);
    }
    return label.join(" ");
  }

  const runtimeLabel = formatRuntime(runtime);
  const dateValueDate = dateValue ? new Date(dateValue) : null;
  return (
    <div className="media-card grid grid-cols-1 items-start gap-5 md:grid-cols-[238px,1fr]">
      {posterPath ? (
        <figure className="relative mx-auto h-[238px] w-[159px] md:h-[357px] md:w-[238px]">
          <Image
            quality={70}
            fill
            src={`${BASE_POSTER_IMAGE_URL}${posterPath}`}
            className="rounded-lg object-cover"
            priority
            placeholder="blur"
            blurDataURL={posterBlur ?? DEFAULT_BLUR_DATA_URL}
            alt={`${title} poster`}
            loading="eager"
            sizes="159px"
          />
        </figure>
      ) : (
        <div className="h-[357px] w-[238px]" />
      )}

      <div className="space-y-3">
        <div>
          <h1 className="text-3xl font-bold md:text-5xl">{title}</h1>
          {tagline && (
            <p className="text-md pt-1 italic text-gray-300">“{tagline}”</p>
          )}
        </div>
        <MediaRatings
          dateValue={dateValueDate}
          isReleased={isReleased}
          mediaType={mediaType}
          title={title}
          tmdbId={tmdbId}
          tmdbVoteAverage={tmdbVoteAverage}
          tmdbVoteCount={tmdbVoteCount}
          imdbId={imdbId}
        />
        <div className="mb-4 flex flex-wrap items-center gap-4">
          {genres && genres.length > 0 && (
            <>
              {genres.map((g) => (
                <span
                  key={g.id}
                  className="rounded-full bg-gray-700/60 px-2 py-0.5 text-sm ring-1 ring-gray-400 transition hover:bg-gray-700"
                >
                  {g.name}
                </span>
              ))}
            </>
          )}
        </div>
        <section className="flex flex-col space-y-4">
          <div className="grid grid-cols-4 gap-6 md:grid-cols-5">
            {formattedDate1 && (
              <div>
                <div className="text-xs font-medium uppercase text-gray-400">
                  {dateLabel}
                </div>
                <time dateTime={dateValue} className="mt-1 block">
                  {formattedDate1}
                </time>
              </div>
            )}

            {formattedDate2 && (
              <div>
                <div className="text-xs font-medium uppercase text-gray-400">
                  {dateLabel2}
                </div>
                <time dateTime={dateValue2} className="mt-1 block">
                  {formattedDate2}
                </time>
              </div>
            )}

            <div>
              <div className="text-xs font-medium uppercase text-gray-400">
                Status
              </div>
              <div className="mt-1">{status ?? "Unknown"}</div>
            </div>

            {rating && (
              <div>
                <div className="text-xs font-medium uppercase text-gray-400">
                  Rated
                </div>
                <div className="mt-1 inline-block border px-1 text-sm">
                  {rating}
                </div>
              </div>
            )}

            {runtimeLabel && (
              <div>
                <div className="text-xs font-medium uppercase text-gray-400">
                  Runtime
                </div>
                <div className="mt-1 inline-block border px-1 text-sm">
                  {runtimeLabel}
                </div>
              </div>
            )}

            <div>
              <div className="text-xs font-medium uppercase text-gray-400">
                Type
              </div>
              <div className="mt-1">{typeLabel}</div>
            </div>
          </div>

          <div>
            <div className="text-xs font-medium uppercase text-gray-400">
              Overview
            </div>
            <div>
              <Expandable buttonClassname="mt-1 md:text-md">
                {overview}
              </Expandable>
            </div>
          </div>
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
