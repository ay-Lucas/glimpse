import { Genre } from "@/types/types";
import {
  Episode,
  MovieReleaseDatesResponse,
  ShowContentRatingResponse,
} from "@/types/request-types-camelcase";
import { MediaPoster } from "./media-poster";
import { MediaActionsWrapper } from "./media-actions-wrapper";
import { MediaOverview } from "./media-overview";
import { MediaStats } from "./media-stats";
import { MediaTitle } from "./media-title";
import { MediaStill } from "./media-still";

export interface MediaHeaderProps {
  title: string;
  overview: string;
  dateLabel: string; // e.g. "First Aired" or "Release"
  dateLabel2?: string; // e.g. "First Aired" or "Release"
  dateValue: string | undefined; // ISO date string
  dateValue2?: string; // ISO date string
  isReleased: boolean;
  posterPath: string | null;
  posterBlur: string | null;
  tmdbVoteAverage: number | null;
  tmdbVoteCount: number | null;
  genres: Genre[] | null;
  trailerPath: string | undefined;
  tmdbId: number;
  imdbId: string | null;
  status: string | undefined; // e.g. "Ended" or "Released"
  tagline: string | null;
  runtime: number | null;
  typeLabel: "Movie" | "Series" | "Episode";
  mediaType: "tv" | "movie";
  isAdult: boolean;
  contentRatings: ShowContentRatingResponse | MovieReleaseDatesResponse | null;
}

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

export function MediaHeader(props: MediaHeaderProps) {
  // format dates / runtime here once
  const formattedDate = props.dateValue ? new Date(props.dateValue) : null;
  const runtimeLabel = formatRuntime(props.runtime) ?? undefined;

  return (
    <div className="media-card grid grid-cols-1 gap-5 md:grid-cols-[238px,1fr]">
      <MediaPoster
        posterPath={props.posterPath}
        posterBlur={props.posterBlur}
        title={props.title}
      />

      <div className="space-y-2.5">
        <MediaTitle
          title={props.title}
          tagline={props.tagline}
          genres={props.genres}
          isAdult={props.isAdult}
        />

        <MediaActionsWrapper
          tmdbId={props.tmdbId}
          mediaType={props.mediaType}
          trailerPath={props.trailerPath}
          tmdbVoteAverage={props.tmdbVoteAverage}
          tmdbVoteCount={props.tmdbVoteCount}
          imdbId={props.imdbId}
          dateValue={formattedDate}
          isReleased={props.isReleased}
          title={props.title}
        />

        <MediaStats
          dateLabel={props.dateLabel}
          dateValue={props.dateValue}
          dateLabel2={props.dateLabel2}
          dateValue2={props.dateValue2}
          isReleased={props.isReleased}
          status={props.status}
          runtimeLabel={runtimeLabel}
          typeLabel={props.typeLabel}
        />

        {props.overview && <MediaOverview overview={props.overview} />}
      </div>
    </div>
  );
}

export interface EpisodeHeaderProps {
  e: Episode;
  airDateLabel: string;
  isReleased: boolean;
  showId: number;
}
export function EpisodeHeader({
  e,
  airDateLabel,
  isReleased,
  showId,
}: EpisodeHeaderProps) {
  const runtimeLabel = formatRuntime(e.runtime) ?? undefined;
  const statusLabel = isReleased
    ? "Released"
    : (e.productionCode ?? "Unreleased");
  const title = `S${e.seasonNumber}.E${e.episodeNumber} ${e.name}`;
  return (
    <div className="media-card grid grid-cols-1 gap-5 md:grid-cols-[238px,1fr]">
      <MediaStill stillPath={e.stillPath ?? null} title={e.name ?? ""} />
      <div className="space-y-2.5">
        <MediaTitle title={title} isAdult={false} />
        <MediaStats
          dateLabel={airDateLabel}
          dateValue={e.airDate}
          isReleased={isReleased}
          status={statusLabel}
          runtimeLabel={runtimeLabel}
          typeLabel={"Episode"}
        />
        {e.overview && <MediaOverview overview={e.overview} />}
      </div>
    </div>
  );
}
