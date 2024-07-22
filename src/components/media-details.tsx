import { Genre } from "@/types/types";
import Image from "next/image";
import TmdbLogo from "@/../public/tmdb-logo.svg";
import Link from "next/link";
import { Button } from "./ui/button";
import { Play } from "lucide-react";

export function MediaDetails({
  title,
  overview,
  genres,
  voteAverage,
  releaseDate,
  rating,
  isVideo,
  paramsId,
}: {
  title: string;
  overview: string;
  genres?: Array<Genre>;
  voteAverage?: number;
  releaseDate?: string;
  rating?: string;
  isVideo?: boolean;
  paramsId?: number;
}) {
  const isReleased: boolean = new Date(releaseDate!).valueOf() < Date.now();

  return (
    <div className="flex flex-col justify-between space-y-1 items-center md:items-start">
      <h2 className="text-3xl md:text-5xl font-medium text-center md:text-start pb-2">
        {title}
      </h2>
      {genres && genres.length > 0 && (
        <div className="flex flex-wrap justify-center space-x-2">
          {genres?.map((genre, index: number) => (
            <ul
              key={index}
              className="bg-gray-700/60 shadow-lg rounded-lg px-2 select-none"
            >
              {genre.name}
            </ul>
          ))}
        </div>
      )}
      <div className="flex flex-row space-x-2 items-center justify-center md:justify-start">
        {isReleased && (
          <>
            <div className="inline-flex items-center">
              <span className="mr-2">
                {((voteAverage ?? 0) * 10).toFixed(0)}%
              </span>
              <Image
                src={TmdbLogo}
                className="w-[30px] h-[30px]"
                priority
                alt="tmdb logo"
              />
            </div>
            <span>•</span>
          </>
        )}
        <div className="">
          {isReleased
            ? `${new Intl.DateTimeFormat("us", {
                timeZone: "UTC",
                month: "short",
                year: "numeric",
                day: "numeric",
              }).format(new Date(releaseDate!))}`
            : "Date Unavailable"}
        </div>
      </div>
      {rating ? (
        <div className="">
          Rated <span className="font-semibold">{rating}</span>
        </div>
      ) : (
        <div>Rating Unavailable</div>
      )}

      {isVideo && (
        <Link className="text-md z-10" href={`${paramsId}/?show=true`}>
          <Button className="p-2 mt-1" variant="outline">
            <Play size={22} className="mr-2" />
            Play Trailer
          </Button>
        </Link>
      )}
      <br />
      <div className="text-md md:text-lg font-medium">{overview}</div>
    </div>
  );
}
