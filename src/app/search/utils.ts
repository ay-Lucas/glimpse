import { BASE_API_URL, options } from "@/lib/constants";
import {
  MovieResult,
  MovieResultsResponse,
  PersonResult,
  PersonResultsResponse,
  TvResult,
  TvResultsResponse,
} from "@/types/request-types-camelcase";
import camelcaseKeys from "camelcase-keys";
import { get as levenshtein } from "fast-levenshtein";
import { headers } from "next/headers";

export type SearchMediaType = "titles" | "tv" | "movie" | "person" | "all";
export interface MovieResultWithKeywords extends MovieResult {
  keywords: string[];
}

export async function searchAndRank(
  query: string,
  includeAdult: boolean,
  mediaType: SearchMediaType,
  genreIds: number[] | null,
  page: number = 1
): Promise<Array<MovieResult | TvResult | PersonResult>> {
  // 1️⃣ extract locale & region from header
  const accept = headers().get("accept-language") ?? "en-US";
  const primary = accept.split(",")[0] || "en-US"; // e.g. "en-US"
  const [lang = "en", region = "US"] = primary.split("-"); // ["en","US"]

  // 2️⃣ fetch only that page
  let raw: Array<MovieResult | TvResult | PersonResult> = [];
  if (mediaType === "movie") {
    raw = await rawMovieSearch(query, lang, includeAdult, region, page);
  } else if (mediaType === "tv") {
    raw = await rawTvSearch(query, lang, includeAdult, region, page);
  } else if (mediaType === "person") {
    raw = await rawPersonSearch(query, lang, includeAdult, region, page);
  } else if (mediaType === "titles") {
    const [mv, tv] = await Promise.all([
      rawMovieSearch(query, lang, includeAdult, region, page),
      rawTvSearch(query, lang, includeAdult, region, page),
    ]);
    raw = [...mv, ...tv];
  } else {
    raw = await rawMultiSearch(query, lang, includeAdult, region, page);
  }
  // 3️⃣ filter out unreleased / missing-image items
  const filteredLocale = filterLocaleAndImage(raw);
  const correctGenres = filteredLocale.filter((item) =>
    filterGenres(item, genreIds)
  );

  return rankByRelevance(correctGenres, query);
}

function filterGenres(
  item: MovieResult | TvResult | PersonResult,
  includedGenreIds: number[] | null
) {
  // 1. no filter? keep everything
  if (!includedGenreIds || includedGenreIds?.length === 0) return true;

  // 2. only filter genres of movies & TV shows
  if (item.mediaType === "person") return false;

  // 3. guard against missing/empty genre_ids
  const ids: number[] = Array.isArray(item?.genreIds) ? item.genreIds : [];

  // 4. require at least one match
  return ids.some((g) => includedGenreIds?.includes(g));
}

async function rawMultiSearch(
  query: string,
  lang: string,
  includeAdult: boolean,
  region?: string,
  page: number = 1
): Promise<Array<MovieResult | PersonResult | TvResult>> {
  try {
    const mvRes = await fetch(
      `${BASE_API_URL}/search/multi?&query=${encodeURIComponent(query)}&language=${lang}&region=${region}&include_adult=${includeAdult}&page=${page}`,
      options
    );
    const data = await mvRes.json();
    const multi = camelcaseKeys(data, { deep: true }) as {
      results?: Array<MovieResult | TvResult | PersonResult>;
    };
    return (
      multi.results?.map((item) => ({
        ...item,
      })) ?? [] // mediaType already populated by TMDB multi endpoint
    );
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function rawMovieSearch(
  query: string,
  lang: string,
  includeAdult: boolean,
  region?: string,
  page: number = 1
): Promise<Array<MovieResult>> {
  try {
    const mvRes = await fetch(
      `${BASE_API_URL}/search/movie?&query=${encodeURIComponent(query)}&language=${lang}&region=${region}&include_adult=${includeAdult}&page=${page}`,
      options
    );
    const data = await mvRes.json();
    const mv = camelcaseKeys(data, {
      deep: true,
    }) as MovieResultsResponse;

    return [
      ...(mv.results?.map((m) => {
        return { ...m, mediaType: "movie" as "movie" };
      }) ?? []),
    ];
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function rawTvSearch(
  query: string,
  lang: string,
  includeAdult: boolean,
  region?: string,
  page: number = 1
): Promise<Array<TvResult>> {
  try {
    const mvRes = await fetch(
      `${BASE_API_URL}/search/tv?&query=${encodeURIComponent(query)}&language=${lang}&region=${region}&include_adult=${includeAdult}&page=${page}`,
      options
    );
    const data = await mvRes.json();
    const tv = camelcaseKeys(data, {
      deep: true,
    }) as TvResultsResponse;

    return [
      ...(tv.results?.map((t) => {
        return { ...t, mediaType: "tv" as "tv" };
      }) ?? []),
    ];
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function rawPersonSearch(
  query: string,
  lang: string,
  includeAdult: boolean,
  region?: string,
  page: number = 1
): Promise<Array<PersonResult>> {
  try {
    const mvRes = await fetch(
      `${BASE_API_URL}/search/person?&query=${encodeURIComponent(query)}
            &language=${lang}&region=${region}&include_adult=${includeAdult}&page=${page}`,
      options
    );
    const data = await mvRes.json();
    const ps = camelcaseKeys(data, {
      deep: true,
    }) as PersonResultsResponse;

    return [
      ...(ps.results?.map((p) => {
        return { ...p, mediaType: "person" as "person" };
      }) ?? []),
    ];
  } catch (err) {
    console.error(err);
    return [];
  }
}
function rankByRelevance(
  items: Array<MovieResult | TvResult | PersonResult>,
  query: string
) {
  const q = query.toLowerCase();

  const scored = items.map((item) => {
    // pick the right field
    const rawTitle =
      "title" in item ? item.title! : "name" in item ? item.name! : "";
    let title = rawTitle.toLowerCase();
    // strip leading articles for matching
    title = title.replace(/^(the|a|an)\s+/, "");

    let score = item.popularity ?? 0;

    if (title === q) {
      // exact match on the stripped title
      score += 1_000;
    } else if (title.startsWith(q)) {
      score += 500;
    } else if (title.includes(q)) {
      // substring match anywhere
      score += 300;
    } else {
      // fuzzy fallback
      const dist = levenshtein(title, q);
      score += Math.max(0, 200 - dist);
    }

    // vote count bump on movies/TV
    if (item.mediaType !== "person") {
      score += ((item as MovieResult | TvResult).voteCount || 0) / 100;
    }

    return { item, score };
  });

  // adult-first still in place
  scored.sort((a, b) => {
    const aAdult =
      a.item.mediaType !== "person" && (a.item as MovieResult | TvResult).adult;
    const bAdult =
      b.item.mediaType !== "person" && (b.item as MovieResult | TvResult).adult;

    if (aAdult !== bAdult) return aAdult ? -1 : 1;
    return b.score - a.score;
  });

  return scored.map((s) => s.item);
}
// function rankByRelevance(
//   items: Array<MovieResult | TvResult | PersonResult>,
//   query: string
// ) {
//   const q = query.toLowerCase();
//
//   // Build scored list as before
//   const scored: Array<{ item: (typeof items)[number]; score: number }> =
//     items.map((item) => {
//       const title =
//         "title" in item ? item.title : "name" in item ? item.name : "";
//       const lower = title.toLowerCase();
//
//       let score = item.popularity ?? 0;
//
//       if (lower === q) score += 1000;
//       else if (lower.startsWith(q)) score += 500;
//       else {
//         const dist = levenshtein(lower, q);
//         score += Math.max(0, 200 - dist);
//       }
//
//       if (item.mediaType !== "person") {
//         score += ((item as MovieResult | TvResult).voteCount || 0) / 100;
//       }
//
//       return { item, score };
//     });
//
//   // Now sort: adult-first, then by score descending
//   scored.sort((a, b) => {
//     const aAdult =
//       a.item.mediaType !== "person" && (a.item as MovieResult | TvResult).adult;
//     const bAdult =
//       b.item.mediaType !== "person" && (b.item as MovieResult | TvResult).adult;
//
//     // 1️⃣ Adult items come first
//     if (aAdult !== bAdult) {
//       return aAdult ? -1 : 1;
//     }
//     // 2️⃣ Otherwise, higher score first
//     return b.score - a.score;
//   });
//
//   return scored.map((s) => s.item);
// }

function filterLocaleAndImage(
  items: Array<MovieResult | TvResult | PersonResult>
) {
  const today = new Date().toISOString().slice(0, 10);
  return items.filter((item) => {
    const hasImage =
      item.mediaType === "person"
        ? Boolean((item as PersonResult).profilePath)
        : Boolean((item as MovieResult | TvResult).posterPath);
    if (!hasImage) return false;
    if (
      item.mediaType === "movie" &&
      (item as MovieResult).releaseDate! > today
    ) {
      return false;
    }
    return true;
  });
}
