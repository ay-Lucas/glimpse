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

export async function searchAndRank(
  query: string,
  includeAdult: boolean,
  mediaType: SearchMediaType
): Promise<Array<MovieResult | TvResult | PersonResult>> {
  // 1️⃣ extract locale & region from header
  const accept = headers().get("accept-language") ?? "en-US";
  const primary = accept.split(",")[0] || "en-US"; // e.g. "en-US"
  const [lang = "en", region = "US"] = primary.split("-"); // ["en","US"]

  // 2️⃣ fetch raw results based on mediaType
  let raw: Array<MovieResult | TvResult | PersonResult> = [];
  if (mediaType === "movie") {
    raw = await rawMovieSearch(query, lang, includeAdult, region);
  } else if (mediaType === "tv") {
    raw = await rawTvSearch(query, lang, includeAdult, region);
  } else if (mediaType === "person") {
    console.log("person called");
    raw = await rawPersonSearch(query, lang, includeAdult, region);
  } else if (mediaType === "titles") {
    const [mv, tv] = await Promise.all([
      rawMovieSearch(query, lang, includeAdult, region),
      rawTvSearch(query, lang, includeAdult, region),
    ]);
    raw = [...mv, ...tv];
  } else {
    // "titles" or "all": merge movie, tv, person
    const [mv, tv, ps] = await Promise.all([
      rawMovieSearch(query, lang, includeAdult, region),
      rawTvSearch(query, lang, includeAdult, region),
      rawPersonSearch(query, lang, includeAdult, region),
    ]);
    raw = [...mv, ...tv, ...ps];
  }

  // 3️⃣ filter out unreleased / missing-image items
  const filtered = filterLocaleAndImage(raw);

  // 4️⃣ rank by relevance
  return rankByRelevance(filtered, query);
}

async function rawMovieSearch(
  query: string,
  lang: string,
  includeAdult: boolean,
  region?: string
): Promise<Array<MovieResult>> {
  try {
    const mvRes = await fetch(
      `${BASE_API_URL}/search/movie?&query=${encodeURIComponent(query)}
            &language=${lang}&region=${region}&include_adult=${includeAdult}`,
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
  region?: string
): Promise<Array<TvResult>> {
  try {
    const mvRes = await fetch(
      `${BASE_API_URL}/search/tv?&query=${encodeURIComponent(query)}
            &language=${lang}&region=${region}&include_adult=${includeAdult}`,
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
  region?: string
): Promise<Array<PersonResult>> {
  try {
    const mvRes = await fetch(
      `${BASE_API_URL}/search/person?&query=${encodeURIComponent(query)}
            &language=${lang}&region=${region}&include_adult=${includeAdult}`,
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

interface Scored<T> {
  item: T;
  score: number;
}

function rankByRelevance(
  items: Array<MovieResult | TvResult | PersonResult>,
  query: string
) {
  const q = query.toLowerCase();
  const scored: Scored<(typeof items)[number]>[] = items.map((item) => {
    // pick title/name
    const title =
      "title" in item ? item.title : "name" in item ? item.name : "";
    const lower = title.toLowerCase();
    let score = item.popularity ?? 0;

    if (lower === q) {
      score += 1000;
    } else if (lower.startsWith(q)) {
      score += 500;
    } else {
      const dist = levenshtein(lower, q);
      score += Math.max(0, 200 - dist);
    }

    if (item.mediaType !== "person") {
      score += ((item as MovieResult | TvResult).voteCount || 0) / 100;
    }
    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.item);
}

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
