import Link from "next/link";
import { DetailItem } from "../../_components/media-details";
import { Expandable } from "../../_components/expandable";
import { FullMovie } from "@/types/camel-index";
import {
  countryCodeToEnglishName,
  languageCodeToEnglishName,
} from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import {
  MovieResult,
  ReleaseDate,
  ReleaseDateResponse,
  ReleasesReleaseDate,
} from "@/types/request-types-camelcase";
import { TmdbMovieDetailsResponseAppended } from "@/types/tmdb-camel";

export function buildMovieDetailItems(
  movie: TmdbMovieDetailsResponseAppended
): DetailItem[] {
  const items: DetailItem[] = [];
  // 1) Directors
  const directors = movie.credits?.crew?.filter((c) => c.job === "Director");
  if (directors && directors.length > 0) {
    const directorTags = directors.map((d, i) => (
      <Link
        key={d.id}
        href={`/person/${d.id}`}
        className="text-blue-200 hover:underline"
      >
        {d.name}
        {i < directors.length - 1 ? ", " : ""}
      </Link>
    ));
    items.push({
      label: "Directors",
      value: <Expandable lineHeight={17}>{directorTags}</Expandable>,
    });
  }

  // 2) Producers
  const producers = movie.credits?.crew?.filter((c) => c.job === "Producer");
  if (producers && producers.length > 0) {
    const producerTags = producers.map((p, i) => (
      <Link
        key={p.id}
        href={`/person/${p.id}`}
        className="text-blue-200 hover:underline"
      >
        {p.name}
        {i < producers.length - 1 ? ", " : ""}
      </Link>
    ));
    items.push({
      label: "Producers",
      value: <Expandable lineHeight={17}>{producerTags}</Expandable>,
    });
  }

  // 3) Writers
  const writers = movie.credits?.crew?.filter((c) => c.job === "Writer");
  if (writers && writers.length > 0) {
    const writerTags = writers.map((w, i) => (
      <Link
        key={w.id}
        href={`/person/${w.id}`}
        className="text-blue-200 hover:underline"
      >
        {w.name}
        {i < writers.length - 1 ? ", " : ""}
      </Link>
    ));
    items.push({
      label: "Writers",
      value: <Expandable lineHeight={17}>{writerTags}</Expandable>,
    });
  }

  // 4) Revenue & Budget
  if (movie.revenue && movie.revenue > 0) {
    items.push({
      label: "Revenue",
      value: `$${movie.revenue.toLocaleString()}`,
    });
  }
  if (movie.budget && movie.budget > 0) {
    items.push({
      label: "Budget",
      value: `$${movie.budget.toLocaleString()}`,
    });
  }

  // 6) Popularity
  if (movie.popularity != null && movie.popularity > 0) {
    const popularity =
      movie.popularity > 1
        ? Math.round(movie.popularity)
        : movie.popularity.toFixed(3);

    items.push({
      label: "Popularity",
      value: popularity,
    });
  }

  // 7) Language
  if (movie.originalLanguage) {
    items.push({
      label: "Language",
      value: languageCodeToEnglishName(movie.originalLanguage),
    });
  }

  // 8) Origin country
  if (movie.originCountry && movie.originCountry.length > 0) {
    items.push({
      label: "Origin Country",
      value: movie.originCountry
        .map(countryCodeToEnglishName)
        .filter(Boolean)
        .join(", "),
    });
  }
  if (movie.homepage) {
    items.push({
      label: "Homepage",
      value: (
        <a
          href={movie.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline"
        >
          Official Site
          <ExternalLink className="ml-1 h-4 w-4" />
        </a>
      ),
    });
  }

  if (movie.spokenLanguages?.length) {
    items.push({
      label: "Spoken Languages",
      value: movie.spokenLanguages
        .map((item) => languageCodeToEnglishName(item.iso6391 ?? ""))
        .join(", "),
    });
  }

  if (movie.productionCountries?.length) {
    items.push({
      label: "Production Countries",
      value: movie.productionCountries
        .map((item) => countryCodeToEnglishName(item.iso31661 ?? ""))
        .join(", "),
    });
  }

  if (movie.productionCompanies?.length) {
    items.push({
      label: "Production Companies",
      value: (
        <div className="flex flex-wrap items-center space-x-4 pt-1">
          {movie.productionCompanies.map((c) => c.name).join(" • ")}
        </div>
      ),
    });
  }

  return items;
}
//
// /**
//  * Pick a single certification string to show from the TMDB movie /content_ratings endpoint.
//  *
//  * @param entries        - the `countries` array from TMDB
//  * @param preferred      - your user’s locale (e.g. "US")
//  * @param fallback       - a secondary locale to try (e.g. "GB")
//  */
// export function pickMovieRating(
//   entries: ReleasesReleaseDate[],
//   preferred = "US",
//   fallback?: string
// ): string | null {
//   // 1️⃣ Filter out any blank certifications
//   const valid = entries.filter((e) => e.certification?.trim() !== "");
//   // 2️⃣ Build a map for quick lookup (last‐write wins)
//   const byRegion = valid.reduce((map, { iso31661, certification }) => {
//     // console.log(map.get("US"));
//     if (typeof iso31661 === "string" && typeof certification === "string")
//       map.set(iso31661, certification);
//     return map;
//   }, new Map<string, string>());
//   // 3️⃣ Try your preferred region
//   if (byRegion.has(preferred)) {
//     return byRegion.get(preferred)!;
//   }
//
//   // 4️⃣ Then a fallback region if given
//   if (fallback && byRegion.has(fallback)) {
//     return byRegion.get(fallback)!;
//   }
//
//   // 5️⃣ Finally, pick the “primary” one if TMDB marked it so
//   const primary = valid.find((e) => e.primary && e.certification);
//   if (primary) return primary.certification ?? null;
//
//   // 6️⃣ Last, fall back to the entry with the most recent releaseDate
//   const newest = valid
//     .slice()
//     .sort(
//       (a, b) =>
//         new Date(b.releaseDate ?? 0).getTime() -
//         new Date(a.releaseDate ?? 0).getTime()
//     )[0];
//   return newest ? (newest.certification ?? null) : null;
// }
export function pickMovieRating(
  entries: ReleaseDateResponse[],
  preferred = "US",
  fallback?: string
): ReleaseDateResponse | null {
  if (entries.length === 0) return null;

  // 1️⃣ Try preferred, then fallback
  let regionEntry: ReleaseDateResponse | undefined =
    entries.find((e) => e.iso31661 === preferred) ||
    (fallback ? entries.find((e) => e.iso31661 === fallback) : undefined);

  // 2️⃣ If neither, pick the region with the newest release date
  if (!regionEntry) {
    type Flat = { iso: string; rd: ReleaseDate };
    const all: Flat[] = entries.flatMap((e) =>
      e.releaseDates.map((rd) => ({ iso: e.iso31661, rd }))
    );
    if (all.length === 0) return null;

    // Sort descending by date
    all.sort(
      (a, b) =>
        new Date(b.rd.releaseDate).getTime() -
        new Date(a.rd.releaseDate).getTime()
    );
    const newest = all[0];
    regionEntry = entries.find((e) => e.iso31661 === newest?.iso);
    if (!regionEntry) return null;
  }

  // 3️⃣ Filter out empty certifications and sort ascending by releaseDate
  const candidates: ReleaseDate[] = regionEntry.releaseDates
    .filter((rd) => rd.certification.trim() !== "")
    .sort(
      (a, b) =>
        new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
    );

  if (candidates.length === 0) return null;

  // 4️⃣ Pick the oldest non‐"NR", or fallback to the first (oldest)
  const olderNonNR = candidates.find((rd) => rd.certification !== "NR");
  const chosen = olderNonNR ?? candidates[0];
  if (!chosen) return null;
  // 5️⃣ Return in the expected shape
  return {
    iso31661: regionEntry.iso31661,
    releaseDates: [chosen],
  };
}
// export function pickMovieRating(
//   entries: ReleaseDateResponse[],
//   preferred = "US",
//   fallback?: string
// ): ReleaseDateResponse | null {
//   console.log(
//     entries.filter((e) => e.iso31661 === "US").map((i) => i.releaseDates)
//   );
//   // 1️⃣ Flatten into pairs of (iso31661, rd)
//   type Flat = { iso31661: string; rd: ReleaseDate };
//   const all: Flat[] = entries.flatMap(({ iso31661, releaseDates }) =>
//     releaseDates.map((rd) => ({ iso31661, rd }))
//   );
//
//   // 2️⃣ Keep only non-empty certifications
//   const valid = all.filter(({ rd }) => rd.certification.trim() !== "");
//
//   // 3️⃣ Build a map region → rd (last-write wins)
//   const byRegion = new Map<string, ReleaseDate>();
//   for (const { iso31661, rd } of valid) {
//     byRegion.set(iso31661, rd);
//   }
//
//   // 4️⃣ Pick which region key to use
//   let regionKey: string | undefined;
//   if (byRegion.has(preferred)) {
//     regionKey = preferred;
//   } else if (fallback && byRegion.has(fallback)) {
//     regionKey = fallback;
//   } else {
//     // 5️⃣ Fallback to the rd with the most recent date
//     const newest = valid
//       .slice()
//       .sort(
//         (a, b) =>
//           new Date(b.rd.releaseDate).getTime() -
//           new Date(a.rd.releaseDate).getTime()
//       )[0];
//     if (!newest) return null;
//     regionKey = newest.iso31661;
//   }
//
//   // 6️⃣ Build and return the ReleaseDateResponse
//   const chosen = byRegion.get(regionKey);
//   console.log("chosen: " + JSON.stringify(chosen));
//   if (!chosen) return null;
//   return {
//     iso31661: regionKey,
//     releaseDates: [chosen],
//   };
// }
// export function pickMovieRating(
//   entries: Array<{
//     iso31661: string;
//     releaseDates: ReleaseDate[];
//   }>,
//   preferred = "US",
//   fallback?: string
// ): string | null {
//   // 1️⃣ Flatten all releaseDates, retaining each country code
//   const allDates = entries.flatMap(({ iso31661, releaseDates }) =>
//     releaseDates.map((rd) => ({ ...rd, iso31661 }))
//   );
//
//   // 2️⃣ Filter out any blank certifications
//   const valid = allDates.filter((rd) => rd.certification.trim() !== "");
//
//   // 3️⃣ Build a region→certification map (last-write wins)
//   const byRegion = new Map<string, string>();
//   for (const rd of valid) {
//     byRegion.set(rd.iso31661, rd.certification);
//   }
//
//   // 4️⃣ Try your preferred region
//   if (byRegion.has(preferred)) {
//     return byRegion.get(preferred)!;
//   }
//
//   // 5️⃣ Then a fallback region if given
//   if (fallback && byRegion.has(fallback)) {
//     return byRegion.get(fallback)!;
//   }
//
//   // 6️⃣ Finally, pick the entry with the most recent date
//   const newest = valid
//     .slice()
//     .sort(
//       (a, b) =>
//         new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
//     )[0];
//
//   return newest ? newest.certification : null;
// }
