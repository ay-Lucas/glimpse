import { BASE_POSTER_IMAGE_URL, DEFAULT_BLUR_DATA_URL } from "@/lib/constants"
import Image from "next/image"
import { ScoreCircle } from "./score-circle";

interface SeasonCardProps {
  seasonNumber?: number,
  name?: string,
  airDate?: string,
  overview?: string,
  posterPath?: string,
  voteAverage?: number,
  episodeCount?: number,
  id?: number
}

export default function SeasonCard({ seasonNumber, name, airDate, overview, posterPath, voteAverage, episodeCount, id }: SeasonCardProps) {
  const formattedAirDate = airDate
    ? new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(airDate))
    : null;

  return (
    <div className="items-end px-40">

      <section className="border-gray-500 border-[0.5px] bg-gray-500/10 backdrop-blur-xl rounded-lg p-5">
        <div className="grid grid-cols-1 md:grid-cols-[100px,1fr] gap-5 items-start">
          {posterPath && (
            <figure className="w-full">
              <Image
                quality={60}
                width={100}
                height={150}
                src={`${BASE_POSTER_IMAGE_URL}${posterPath}`}
                className="object-cover rounded-lg w-full h-full"
                priority
                placeholder="blur"
                blurDataURL={
                  DEFAULT_BLUR_DATA_URL
                }
                alt={`${name} poster`}
                loading="eager"
              />
            </figure>
          )}

          <div className="space-y-2">
            <h1 className="text-xl md:text-2xl font-bold text-center md:text-left">
              {`${seasonNumber === 0 && name === "Specials" ? "Specials" : `Season ${seasonNumber}`}`}
            </h1>
            <section className="flex flex-col space-y-4">
              <div className="grid grid-cols-4 md:grid-cols-5 gap-6 text-center md:text-left">
                {formattedAirDate && (
                  <div>
                    <div className="text-sm font-medium text-gray-400 uppercase">
                      Aired on
                    </div>
                    <time dateTime={formattedAirDate} className="mt-1 block">
                      {formattedAirDate}
                    </time>
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium text-gray-400 uppercase">
                    Epsiode Count
                  </div>
                  <div className="mt-1">{episodeCount}</div>
                </div>
                {voteAverage !== 0 && voteAverage && (
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex flex-col items-center">
                      <ScoreCircle
                        size={54}
                        strokeWidth={3}
                        percentage={Math.round(voteAverage * 10)}
                      />
                      <span className="sr-only">{voteAverage}</span>
                    </div>
                  </div>
                )}

              </div>

              <p className="md:text-md">{overview}</p>
            </section>
          </div>
        </div >
      </section >

    </div >)
}
