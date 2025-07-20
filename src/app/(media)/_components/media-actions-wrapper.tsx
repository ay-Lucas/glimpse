import MediaActions from "./media-actions";
import MediaRatings from "./media-ratings";

interface MediaActionsWrapperProps {
  tmdbId: number;
  mediaType: "movie" | "tv";
  trailerPath?: string;
  tmdbVoteAverage: number | null;
  tmdbVoteCount: number | null;
  imdbId: string | null;
  dateValue: Date | null;
  isReleased: boolean;
  title: string;
}

export function MediaActionsWrapper({
  tmdbId,
  mediaType,
  trailerPath,
  tmdbVoteAverage,
  tmdbVoteCount,
  imdbId,
  dateValue,
  isReleased,
  title,
}: MediaActionsWrapperProps) {
  return (
    <>
      <MediaRatings
        dateValue={dateValue}
        isReleased={isReleased}
        mediaType={mediaType}
        title={title}
        tmdbId={tmdbId}
        tmdbVoteAverage={tmdbVoteAverage}
        tmdbVoteCount={tmdbVoteCount}
        imdbId={imdbId}
      />
      <MediaActions
        videoPath={trailerPath}
        tmdbId={tmdbId}
        mediaType={mediaType}
      />
    </>
  );
}
