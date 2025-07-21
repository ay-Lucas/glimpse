import TmdbLogo from "@/assets/tmdb-logo.svg";
import Metric from "./metric";

export default function TmdbRating({
  mediaType,
  tmdbId,
  tmdbVoteAverage,
  tmdbVoteCount,
  size,
}: {
  mediaType: "tv" | "movie";
  tmdbId: number;
  tmdbVoteAverage: number;
  tmdbVoteCount?: number;
  size?: "small" | "default";
}) {
  const width = size === "default" ? 40 : 30;
  const height = size === "default" ? 20 : 13;
  return (
    <Metric
      href={`https://www.themoviedb.org/${mediaType}/${tmdbId}`}
      Icon={
        <TmdbLogo
          alt="TMDB Logo"
          width={width}
          height={height}
          className="opacity-75 sm:mr-2"
        />
      }
      value={`${Math.round(tmdbVoteAverage * 10)}%`}
      count={tmdbVoteCount}
      size={size}
    />
  );
}
