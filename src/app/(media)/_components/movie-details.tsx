import TmdbLogo from "@/assets/tmdb-logo.svg";
import { ScoreCircle } from "./score-circle";

interface MovieDetailsProps {
  overview: string;
  releaseDate?: string;
  rating?: string;
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
  releaseDate,
  rating,
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
