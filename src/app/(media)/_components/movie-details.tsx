import TmdbLogo from "@/assets/tmdb-logo.svg";

interface MovieDetailsProps {
  overview: string;
  voteAverage?: number;
  releaseDate?: string;
  rating?: string;
  isVideo?: boolean;
  isReleased: boolean;
  status?:
    | "Rumored"
    | "Planned"
    | "In Production"
    | "Post Production"
    | "Released"
    | "Canceled";
}

export async function MovieDetails({
  overview,
  voteAverage,
  releaseDate,
  rating,
  isVideo,
  isReleased,
  status,
}: MovieDetailsProps) {
  const formattedDate = releaseDate
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(releaseDate))
    : null;
  return (
    <section className="flex flex-col space-y-4">
      <div className="grid grid-cols-4 md:grid-cols-5 gap-6 text-center md:text-left">
        {formattedDate && (
          <div>
            <div className="text-xs font-medium text-gray-400 uppercase">
              Release
            </div>
            <time dateTime={releaseDate} className="mt-1 block">
              {formattedDate}
            </time>
          </div>
        )}
        <div>
          <div className="text-xs font-medium text-gray-400 uppercase">
            Status
          </div>
          <div className="mt-1">{status ?? "Unreleased"}</div>
        </div>
        {isReleased && voteAverage != null && (
          <div>
            <div className="text-xs font-medium text-gray-400 uppercase">
              Score
            </div>
            <div className="mt-1 flex items-center justify-center md:justify-start space-x-1">
              <span className="font-medium">{voteAverage.toFixed(1)}</span>
              <span className="text-gray-400">/10</span>
              <TmdbLogo className="h-3 w-auto" alt="TMDB logo" />
            </div>
          </div>
        )}
        {rating && (
          <div>
            <div className="text-xs font-medium text-gray-400 uppercase">
              Rated
            </div>
            <div className="mt-1 px-1 border border-gray-300 inline-block text-sm">
              {rating}
            </div>
          </div>
        )}

        <div>
          <div className="text-xs font-medium text-gray-400 uppercase">
            Type
          </div>
          <div className="mt-1">Movie</div>
        </div>
      </div>

      <p className="md:text-md">{overview}</p>
    </section>
  );
}
