import { WatchProviderResponse } from "@/types/request-types-camelcase";
import TmdbProviderList from "./tmdb-provider-list";
import JustWatchProviderList from "./justwatch-provider-list";
import JustWatchLogo from "@/assets/justwatch-logo.svg";
import Link from "next/link";
import { getCachedJustWatch } from "../actions";

export default async function MediaProviders({ tmdbWatchProviders, title, tmdbId, releaseDate, mediaType }: { tmdbWatchProviders?: WatchProviderResponse, title: string, tmdbId: number, releaseDate: Date | null, mediaType: "tv" | "movie" }) {
  const justWatchInfo = await getCachedJustWatch(title, mediaType, tmdbId, releaseDate)
  const isTmdbValid: boolean = tmdbWatchProviders?.results !== undefined && tmdbWatchProviders.results?.US?.flatrate !== undefined && tmdbWatchProviders.results?.US?.flatrate.length > 0;
  const isJustWatchValid: boolean = justWatchInfo?.streams !== undefined && justWatchInfo.streams !== null && justWatchInfo?.streams.length > 0;

  return (
    <>
      {(isTmdbValid || isJustWatchValid) && (
        <div className="backdrop-blur-sm bg-background/40 rounded-lg p-4">
          <h2 className="text-2xl font-bold pb-4">
            Streaming
            <span className="inline-flex items-center ml-4">
              <Link href="https://justwatch.com">
                <JustWatchLogo
                  alt={`JustWatch Logo`}
                  width={100}
                  height={15}
                  className="flex"
                />
              </Link>
            </span>
          </h2>
          {isJustWatchValid && justWatchInfo?.streams ? (
            <JustWatchProviderList info={justWatchInfo.streams} />
          ) : (
            <TmdbProviderList watchProviders={tmdbWatchProviders!} />
          )}
        </div>
      )}
    </>
  )
}
