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
  const logoSize = size === "default" ? 40 : 30;
  return (
    <Metric
      href={`https://www.themoviedb.org/${mediaType}/${tmdbId}`}
      Icon={
        <TmdbLogo
          alt="TMDB Logo"
          width={logoSize}
          height={logoSize}
          className="mr-2 opacity-75"
        />
      }
      value={`${Math.round(tmdbVoteAverage * 10)}%`}
      count={tmdbVoteCount}
      size={size}
    />
  );
}
