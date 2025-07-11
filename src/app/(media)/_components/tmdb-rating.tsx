import TmdbLogo from "@/assets/tmdb-logo.svg";
import Metric from "./metric";

export default function TmdbRating({
  mediaType,
  tmdbId,
  tmdbVoteAverage,
  tmdbVoteCount,
}: {
  mediaType: "tv" | "movie";
  tmdbId: number;
  tmdbVoteAverage: number;
  tmdbVoteCount?: number;
}) {
  return (
    <Metric
      href={`https://www.themoviedb.org/${mediaType}/${tmdbId}`}
      Icon={
        <TmdbLogo
          alt="TMDB Logo"
          width={40}
          height={40}
          className="mr-2 opacity-75"
        />
      }
      value={`${Math.round(tmdbVoteAverage * 10)}%`}
      count={tmdbVoteCount}
    />
  );
}
