import { Genre } from "@/types/request-types-camelcase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import TmdbLogo from "@/assets/tmdb-logo.svg";
import dynamic from "next/dynamic";
import { FullMovie, WatchlistSchemaI } from "@/types/camel-index";
import { Session } from "next-auth";

interface MovieDetailsProps {
  title: string;
  overview: string;
  genres?: Genre[];
  voteAverage?: number;
  releaseDate?: string;
  rating?: string;
  isVideo?: boolean;
  paramsId: number;
  isReleased: boolean;
  status?:
    | "Rumored"
    | "Planned"
    | "In Production"
    | "Post Production"
    | "Released"
    | "Canceled";
  data: FullMovie;
  userWatchlists?: WatchlistSchemaI[];
  session?: Session;
}

const AddToWatchlistDropdownClient = dynamic(
  () => import("@/components/add-to-watchlist-button"),
  { ssr: false },
);

export async function MovieDetails({
  title,
  overview,
  genres = [],
  voteAverage,
  releaseDate,
  rating,
  isVideo,
  paramsId,
  isReleased,
  status,
  data,
  userWatchlists,
  session,
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
      <div>
        <h1 className="text-3xl md:text-5xl font-bold text-center md:text-start">
          {title}
        </h1>
        <p className="pt-1">Movie</p>
      </div>
      {genres.length > 0 && (
        <div className="flex flex-wrap justify-center md:justify-start gap-2">
          {genres.map((g) => (
            <span
              key={g.id}
              className="text-md bg-gray-700/60 px-3 py-1 rounded-full hover:bg-gray-700 transition"
            >
              {g.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap justify-center md:justify-start items-center gap-6">
        {isReleased && voteAverage != null && (
          <div className="flex items-center space-x-1">
            <span className="font-semibold">
              {Math.round(voteAverage * 10)}%
            </span>
            <TmdbLogo className="h-4 w-auto" alt="TMDB logo" />
          </div>
        )}

        {formattedDate && (
          <time dateTime={releaseDate} className="text-md text-gray-300">
            {formattedDate}
          </time>
        )}
        {rating && (
          <p className="text-sm border border-gray-300 px-1">{rating}</p>
        )}

        <div className="text-md">
          <span className="font-medium">Status:</span> {status ?? "Unreleased"}
        </div>
      </div>

      {isVideo && paramsId != null && (
        <div className="flex justify-center md:justify-start space-x-3">
          <Link href={`/movie/${paramsId}?show=true`}>
            <Button variant="outline" className="flex items-center space-x-2">
              <Play size={20} />
              <span>Play Trailer</span>
            </Button>
          </Link>
          {session && userWatchlists ? (
            <AddToWatchlistDropdownClient
              userId={session.user.id}
              item={data}
              rating={rating ?? ""}
              mediaType="movie"
            />
          ) : (
            <Link href={"/signin"}>
              <Button variant="secondary">Add to Watchlist</Button>
            </Link>
          )}
        </div>
      )}
      <p className="md:text-md">{overview}</p>
    </section>
  );
}
