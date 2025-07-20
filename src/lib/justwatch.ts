import JustWatch, { StreamingInfo, StreamProvider } from "justwatch-api-client";
import { scrubByMaxRes } from "./scrub-streams";
import { unstable_cache } from "next/cache";
import { getJustWatchInfoFromDb } from "./actions";
import { GroupedProvider } from "@/types/camel-index";

// Called by /scripts/revalidate.ts: Don't wrap with React cache or unstable_cache
export const fetchJustWatchData = async (
  tmdbTitle: string,
  type: "movie" | "tv",
  tmdbId: number,
  releaseDate?: Date | null
): Promise<StreamingInfo | undefined> => {
  try {
    const releaseYear = releaseDate
      ? new Date(releaseDate).getFullYear()
      : null;
    // 1) Search JustWatch for your title
    const justwatch = new JustWatch(5000);
    // Search for a movie/show (with optional country code, default is "IN")
    const searchResults = await justwatch.searchByQuery(tmdbTitle, "US");
    const matches = searchResults.filter(
      (item) =>
        item.title?.toLowerCase() === tmdbTitle.toLowerCase() &&
        item.fullPath &&
        (releaseYear ? item.originalReleaseYear === releaseYear : true)
    );
    const firstMatch = matches[0];
    const data =
      firstMatch?.fullPath &&
      (await justwatch.getData(firstMatch.fullPath, "US"));
    return data ? data : undefined;
  } catch (err) {
    console.error(
      `Error fetching JustWatch ${tmdbTitle}: ${type}/${tmdbId} (${releaseDate})`
    );
  }
};

export const getJustWatchInfo = async (
  tmdbTitle: string,
  type: "movie" | "tv",
  tmdbId: number,
  releaseDate?: Date | null
) => {
  const justWatchResponse = await fetchJustWatchData(
    tmdbTitle,
    type,
    tmdbId,
    releaseDate
  );

  if (!justWatchResponse || !justWatchResponse.Streams?.length) return null;

  const cleaned = scrubByMaxRes(justWatchResponse.Streams);
  const providers = groupStreams(cleaned);

  return {
    ID: justWatchResponse.ID,
    originalTitle: justWatchResponse.originalTitle,
    isReleased: justWatchResponse.isReleased,
    releastyear: justWatchResponse.releastyear,
    genres: justWatchResponse.genres,
    imdbScore: justWatchResponse.imdbScore,
    imdbCount: justWatchResponse.imdbCount,
    tmdbRating: justWatchResponse.tmdbRating,
    tomatoMeter: justWatchResponse.tomatoMeter,
    productionCountries: justWatchResponse.productionCountries,
    shortDescription: justWatchResponse.shortDescription,
    streams: providers,
  };
};

export const getCachedJustWatch = unstable_cache(
  async (
    tmdbTitle: string,
    type: "movie" | "tv",
    tmdbId: number,
    releaseDate?: Date | null
  ) => {
    const info = await getJustWatchInfoFromDb(Number(tmdbId), type);
    if (info && info.streams) return info;

    const res = await getJustWatchInfo(tmdbTitle, type, tmdbId, releaseDate);
    return res;
  },
  [],
  { revalidate: 60 * 60 * 12 }
);

export function groupStreams(streams: StreamProvider[]): GroupedProvider[] {
  const map = new Map<
    string,
    {
      provider: string;
      name: string;
      link: string;
      icon: string;
      types: Set<string>;
      priceByType: Map<string, string>;
      resolutionsByType: Map<string, Set<string>>;
      audioByType: Map<string, Set<string>>;
      subtitleByType: Map<string, Set<string>>;
    }
  >();

  for (const s of streams) {
    let e = map.get(s.Provider);
    if (!e) {
      e = {
        provider: s.Provider,
        name: s.Name,
        link: s.Link,
        icon: s.Icon,
        types: new Set(),
        priceByType: new Map(),
        resolutionsByType: new Map(),
        audioByType: new Map(),
        subtitleByType: new Map(),
      };
      map.set(s.Provider, e);
    }

    // 1) record this type
    e.types.add(s.Type);
    // 2) price
    e.priceByType.set(s.Type, s.Price);
    // 3) resolution
    if (!e.resolutionsByType.has(s.Type))
      e.resolutionsByType.set(s.Type, new Set());
    e.resolutionsByType.get(s.Type)!.add(s.Resolution);
    // 4) audio
    if (!e.audioByType.has(s.Type)) e.audioByType.set(s.Type, new Set());
    s.Audio.forEach((a) => e.audioByType.get(s.Type)!.add(a));
    // 5) subtitle
    if (!e.subtitleByType.has(s.Type)) e.subtitleByType.set(s.Type, new Set());
    s.Subtitle.forEach((t) => e.subtitleByType.get(s.Type)!.add(t));
  }

  // flatten
  return Array.from(map.values()).map((e) => {
    const types = Array.from(e.types);
    const priceByType: Record<string, string> = {};
    types.forEach((t) => {
      priceByType[t] = e.priceByType.get(t) || "";
    });
    const resolutionsByType: Record<string, string[]> = {};
    types.forEach((t) => {
      resolutionsByType[t] = Array.from(e.resolutionsByType.get(t) || []);
    });
    const audioByType: Record<string, string[]> = {};
    types.forEach((t) => {
      audioByType[t] = Array.from(e.audioByType.get(t) || []);
    });
    const subtitleByType: Record<string, string[]> = {};
    types.forEach((t) => {
      subtitleByType[t] = Array.from(e.subtitleByType.get(t) || []);
    });

    return {
      provider: e.provider,
      name: e.name,
      link: e.link,
      icon: e.icon,
      types,
      priceByType,
      resolutionsByType,
      audioByType,
      subtitleByType,
    };
  });
}
