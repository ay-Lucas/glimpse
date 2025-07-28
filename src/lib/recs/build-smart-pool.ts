import { options } from "@/lib/constants";
import { toDateString } from "@/lib/dates";
import { hasPoster, isEnglish, isAnime } from "@/lib/filters";
import { Candidate } from "@/types/camel-index";
import {
  DiscoverMovieResponse,
  DiscoverTvResponse,
  MovieResult,
  SearchKeywordResponse,
  TvResult,
} from "@/types/request-types-camelcase";
import camelcaseKeys from "camelcase-keys";
import { TAG2ID } from "../keywords";
import { redisUncached } from "@/services/cache";
import { fetchNetworkDetails } from "@/app/(media)/actions";

type Media = "movie" | "tv";

const TARGET = 200;
const PAGE_SIZE = 20;

export interface PoolFilters {
  media: "movie" | "series" | "either";
  years: [number, number];
  runtime_max: number; // minutes
  language: string[]; // ISO 639-1 codes
  avoid?: string[]; // trigger warnings
}

async function fetchKeywordIdsFromTmdb(tag: string) {
  const url = `https://api.themoviedb.org/3/search/keyword?query=${encodeURIComponent(
    tag
  )}&language=en-US&page=1`;
  const res = await fetch(url, options).then((x) => x.json());
  const camel = camelcaseKeys(res, { deep: true }) as SearchKeywordResponse;

  const slice = camel.results?.slice(0, 3);
  if (!slice) return [];
  const ids = slice.map((k) => k.id ?? 0).filter(Boolean);
  const valid = ids.flatMap((item) => item);
  return valid;
}

async function keywordIdsFor(tag: string) {
  const key = `kw:${tag.toLowerCase()}`;
  let ids = await redisUncached.get<number[]>(key);
  if (!ids) {
    ids = await fetchKeywordIdsFromTmdb(tag);
    await redisUncached.set(key, ids, { ex: 60 * 60 * 24 });
  }
  return ids;
}

async function discover(
  media: Media,
  page: number,
  kwIds: number[],
  f: PoolFilters
) {
  const qs = new URLSearchParams({
    page: String(page),
    language: f.language[0] ?? "en-US",
    sort_by: "popularity.desc",
    vote_count_gte: "100",
  });

  // year range
  if (media === "movie") {
    qs.set("primary_release_date.gte", `${f.years[0]}-01-01`);
    qs.set("primary_release_date.lte", `${f.years[1]}-12-31`);
    qs.set("with_runtime.lte", String(f.runtime_max));
  } else {
    qs.set("first_air_date.gte", `${f.years[0]}-01-01`);
    qs.set("first_air_date.lte", `${f.years[1]}-12-31`);
  }

  if (kwIds.length) qs.set("with_keywords", kwIds.join("|"));

  const url = `https://api.themoviedb.org/3/discover/${media}?${qs}`;
  const res = await fetch(url, options).then((x) => x.json());
  const camel = camelcaseKeys(res, { deep: true }) as
    | DiscoverMovieResponse
    | DiscoverTvResponse;
  return camel.results ?? [];
}

function toCandidate(r: MovieResult | TvResult, media: Media): Candidate {
  const title =
    media === "movie" ? (r as MovieResult).title : (r as TvResult).name;
  const date =
    media === "movie"
      ? (r as MovieResult).releaseDate
      : (r as TvResult).firstAirDate;
  const dateStr = toDateString(date);
  return {
    id: r.id,
    title,
    year: dateStr ? Number(dateStr.slice(0, 4) || 0) : 0,
    overview: r.overview.slice(0, 200),
    keywords: [], // you can hydrate later
    posterPath: r.posterPath,
    voteAverage: r.voteAverage,
    voteCount: r.voteCount,
    mediaType: media,
  };
}

function passLocalFilters(
  r: MovieResult | TvResult,
  media: Media,
  f: PoolFilters
) {
  if ((r.voteCount ?? 0) === 0) return false;
  if (!hasPoster(r)) return false;

  // allow anime in any language
  if (media === "tv" && isAnime(r as TvResult)) {
    // and respect user movie-only choice
    return f.media !== "movie";
  }

  // enforce language
  if (!f.language.includes(r.originalLanguage)) return false;

  // media-type gating
  if (media === "tv" && f.media === "movie") return false;
  if (media === "movie" && f.media === "series") return false;

  return true;
}
/**
 * score(c, tags) → higher = better
 * ------------------------------------------------------------
 * WR = (v / (v + m)) * R + (m / (v + m)) * C
 *   R = voteAverage (0–10)
 *   v = voteCount
 *   m = confidence floor (e.g. 1 000 votes)
 *   C = global mean rating (≈ 6.8 on TMDB dataset)
 *
 * Then add small boosts for semantic tag hits.
 */
function score(c: Candidate, tags: string[]): number {
  const R = c.voteAverage;
  const v = c.voteCount ?? 0; // ensure you populate this field
  const m = 1_000; // tune: higher m favours blockbusters
  const C = 6.8; // average TMDB rating

  const weightedRating = (v / (v + m)) * R + (m / (v + m)) * C;

  // — semantic boost —
  const title = c.title.toLowerCase();
  const ov = c.overview?.toLowerCase();
  let boost = 0;

  for (const tRaw of tags) {
    const t = tRaw.toLowerCase();
    if (title.includes(t)) boost += 1;
    else if (ov?.includes(t)) boost += 0.5;
    if (boost >= 2) break;
  }

  return weightedRating + boost;
}

export async function buildSmartPool(tags: string[], f: PoolFilters) {
  // 0. Build keyword + genre id list
  const kwIds = (await Promise.all(tags.map(keywordIdsFor))).flat();
  for (const t of tags) kwIds.push(...(TAG2ID[t] ?? []));

  const medias: Media[] =
    f.media === "movie"
      ? ["movie"]
      : f.media === "series"
        ? ["tv"]
        : ["movie", "tv"];

  const map = new Map<number, Candidate>();
  const push = (raw: MovieResult | TvResult, m: Media) => {
    if (!passLocalFilters(raw, m, f)) return;
    map.set(raw.id, toCandidate(raw, m));
  };

  // 1. keyword OR pass
  for (let page = 1; map.size < TARGET && page <= 3; page++) {
    await Promise.all(
      kwIds.map((id) =>
        Promise.all(
          medias.map((m) =>
            discover(m, page, [id], f).then((r) => r.forEach((x) => push(x, m)))
          )
        )
      )
    );
  }

  // 2. popularity back-fill (still filtered by era/runtime)
  for (let page = 1; map.size < TARGET && page <= 5; page++) {
    await Promise.all(
      medias.map((m) =>
        discover(m, page, [], f).then((r) => r.forEach((x) => push(x, m)))
      )
    );
  }
  // 3. score & trim
  const scored = [...map.values()].sort(
    (a, b) => score(b, tags) - score(a, tags)
  );
  return scored.slice(0, TARGET);
}
