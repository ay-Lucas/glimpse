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
