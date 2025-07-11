import { WatchProviderResponse } from "@/types/request-types-camelcase";
import TmdbProviderList from "./tmdb-provider-list";
import JustWatchProviderList from "./justwatch-provider-list";
import JustWatchLogo from "@/assets/justwatch-logo.svg";
import Link from "next/link";
import { getCachedJustWatch } from "@/lib/justwatch";

export default async function MediaProviders({
  tmdbWatchProviders,
  title,
  tmdbId,
  releaseDate,
  mediaType,
}: {
  tmdbWatchProviders?: WatchProviderResponse;
  title: string;
  tmdbId: number;
  releaseDate: Date | null;
  mediaType: "tv" | "movie";
}) {
  const justWatchInfo = await getCachedJustWatch(
    title,
    mediaType,
    tmdbId,
    releaseDate
  );
  const isTmdbValid: boolean =
    tmdbWatchProviders?.results !== undefined &&
    tmdbWatchProviders.results?.US?.flatrate !== undefined &&
    tmdbWatchProviders.results?.US?.flatrate.length > 0;
  const isJustWatchValid: boolean =
    justWatchInfo?.streams !== undefined &&
    justWatchInfo.streams !== null &&
    justWatchInfo?.streams.length > 0;
  return (
    <>
      {(isTmdbValid || isJustWatchValid) && (
        <div className="media-card">
          <h2 className="pb-4 text-2xl font-bold">
            Streaming
            <span className="ml-4 inline-flex items-center">
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
  );
}
