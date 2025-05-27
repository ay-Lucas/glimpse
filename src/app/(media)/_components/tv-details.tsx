import TmdbLogo from "@/assets/tmdb-logo.svg";
import { ScoreCircle } from "./score-circle";

interface TvDetailsProps {
  overview: string;
  firstAirDate?: string;
  rating?: string;
  status?:
  | "Rumored"
  | "Planned"
  | "In Production"
  | "Post Production"
  | "Released"
  | "Canceled"
  | string;
}

export async function TvDetails({
  overview,
  firstAirDate,
  rating,
  status,
}: TvDetailsProps) {
  const formattedDate = firstAirDate
    ? new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(firstAirDate))
    : null;
  return (
    <section className="flex flex-col space-y-4">
      <div className="grid grid-cols-4 md:grid-cols-5 gap-6 text-center md:text-left">
        {formattedDate && (
          <div>
            <div className="text-xs font-medium text-gray-400 uppercase">
              First Aired
            </div>
            <time dateTime={firstAirDate} className="mt-1 block">
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
          <div className="mt-1">Series</div>
        </div>
      </div>

      <p className="md:text-md">{overview}</p>
    </section>
  );
}
