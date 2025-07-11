import ImdbRating from "./imdb-rating";
import TmdbRating from "./tmdb-rating";
import RottenTomatoesRating from "./rotten-tomatoes-rating";
import { getCachedJustWatch } from "@/lib/justwatch";

interface MediaRatingsProps {
  tmdbVoteAverage: number | null;
  tmdbVoteCount: number | null;
  tmdbId: number;
  imdbId: string | null;
  isReleased: boolean;
  title: string;
  dateValue: Date | null;
  mediaType: "tv" | "movie";
}

export default async function MediaRatings({
  tmdbVoteAverage,
  tmdbVoteCount,
  tmdbId,
  imdbId,
  isReleased,
  title,
  dateValue,
  mediaType,
}: MediaRatingsProps) {
  const justWatchInfo = await getCachedJustWatch(
    title,
    mediaType,
    tmdbId,
    dateValue
  );

  const rottenTomatoesScore = justWatchInfo?.tomatoMeter?.valueOf();
  const imdbCount = justWatchInfo?.imdbCount
    ? Number(justWatchInfo.imdbCount)
    : null;
  const imdbScore = justWatchInfo?.imdbScore
    ? Number(justWatchInfo.imdbScore)
    : null;

  return (
    <div className="flex flex-row flex-wrap items-center gap-5">
      {tmdbVoteAverage != null && tmdbVoteCount != null && (
        <TmdbRating
          mediaType={mediaType}
          tmdbId={tmdbId}
          tmdbVoteAverage={tmdbVoteAverage}
          tmdbVoteCount={tmdbVoteCount}
        />
      )}
      {imdbCount && imdbScore && (
        <ImdbRating count={imdbCount} score={imdbScore} imdbId={imdbId} />
      )}
      {typeof rottenTomatoesScore === "number" && (
        <RottenTomatoesRating score={rottenTomatoesScore} title={title} />
      )}
    </div>
  );
}
