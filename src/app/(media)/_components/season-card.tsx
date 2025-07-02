import { BASE_POSTER_IMAGE_URL, DEFAULT_BLUR_DATA_URL } from "@/lib/constants";
import Image from "next/image";
import { Expandable } from "./expandable";
import TmdbLogo from "@/assets/tmdb-logo.svg";
import Metric from "./metric";

interface SeasonCardProps {
  seasonNumber?: number;
  name?: string;
  airDate?: string;
  overview?: string;
  posterPath?: string;
  voteAverage?: number;
  episodeCount?: number;
  id?: number;
}

export default function SeasonCard({
  seasonNumber,
  name,
  airDate,
  overview,
  posterPath,
  voteAverage,
  episodeCount,
  id,
}: SeasonCardProps) {
  const formattedAirDate = airDate
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(airDate))
    : null;

  return (
    <section className="media-card">
      <div className="grid grid-cols-[100px,1fr] items-start gap-3">
        {posterPath ? (
          <figure className="row-span-2 w-full">
            <Image
              quality={60}
              width={100}
              height={150}
              src={`${BASE_POSTER_IMAGE_URL}${posterPath}`}
              className="h-full w-full rounded-lg object-cover"
              placeholder="blur"
              blurDataURL={DEFAULT_BLUR_DATA_URL}
              alt={`${name} poster`}
              loading="lazy"
            />
          </figure>
        ) : (
          <div></div>
        )}

        <div className="space-y-2">
          <h1 className="text-left text-2xl font-bold">
            {`${seasonNumber === 0 && name === "Specials" ? "Specials" : `Season ${seasonNumber}`}`}
          </h1>
          <section className="flex flex-col space-y-4">
            <div className="grid grid-cols-2 gap-3 text-left xs:grid-cols-3 xs:gap-6">
              {formattedAirDate && (
                <div>
                  <div className="text-sm font-medium uppercase text-gray-400">
                    Aired on
                  </div>
                  <time dateTime={formattedAirDate} className="mt-1 block">
                    {formattedAirDate}
                  </time>
                </div>
              )}
              <div>
                <div className="text-sm font-medium uppercase text-gray-400">
                  Episode Count
                </div>
                <div className="mt-1">{episodeCount}</div>
              </div>
              <div className="col-span-2 xs:col-span-1">
                <div className="text-sm font-medium uppercase text-gray-400">
                  Vote Average
                </div>
                {voteAverage != null && voteAverage != null && (
                  <Metric
                    href={`https://www.themoviedb.org/tv/${id}`}
                    Icon={
                      <TmdbLogo
                        alt="TMDB Logo"
                        width={40}
                        height={40}
                        className="mr-2 opacity-75"
                      />
                    }
                    value={`${Math.round(voteAverage * 10)}%`}
                  />
                )}
              </div>
            </div>
          </section>
        </div>
        {overview && (
          <div className="col-span-2 md:col-span-1 md:col-start-2">
            <Expandable>{overview} </Expandable>
          </div>
        )}
      </div>
    </section>
  );
}
