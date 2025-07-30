import pLimit from "p-limit";
import { BASE_API_URL, options } from "@/lib/constants";
import { toDateString } from "@/lib/dates";
import { hasPoster, isAnime, isEnglish } from "@/lib/filters";
import { Candidate } from "@/types/camel-index";
import {
  DiscoverMovieResponse,
  DiscoverTvResponse,
  MovieResult,
  SearchKeywordResponse,
  TvResult,
} from "@/types/request-types-camelcase";
import { redisUncached as redis } from "@/services/cache";
import { fetchJSON } from "../tmdb";
import { TAG2ID } from "./tag-catalog";
import { uniqueBy } from "../utils";
import { uniqueById } from "@/components/title-carousel";

/* ───  tunables  ────────────────────────────────────────────────────── */
export type Media = "movie" | "tv";

export const TMDB_MEAN = 6.8;
export const CONF_FLOOR = 1_000;
export const PAGES_KEYWORD = 3;
export const PAGES_POPULAR = 5;
export const TARGET = 200;
const CONCURRENCY = 10;
const limit = pLimit(CONCURRENCY);

/* ───  filters  ─────────────────────────────────────────────────────── */
export interface PoolFilters {
  media: "movie" | "series" | "either";
  years: [number, number];
  runtime_max: number;
  language: string[];
  avoid?: string[];
}

/* ───  helpers  ─────────────────────────────────────────────────────── */
export async function fetchKeywordIds(tag: string) {
  const cacheKey = `kw:${tag.toLowerCase()}`;
  let ids = await redis.get<number[]>(cacheKey);
  if (ids) return ids;

  const url = `${BASE_API_URL}/search/keyword?query=${encodeURIComponent(tag)}&page=1`;
  const res = await fetchJSON<SearchKeywordResponse>(url, options);
  ids = (res.results ?? [])
    .slice(0, 3)
    .map((k) => k.id)
    .filter((k) => k !== undefined);
  await redis.set(cacheKey, ids, { ex: 60 * 60 * 24 });
  return ids;
}

function buildQS(media: Media, page: number, kwIds: number[], f: PoolFilters) {
  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("language", f.language[0] ?? "en-US");
  qs.set("sort_by", "popularity.desc");
  qs.set("vote_count_gte", "100");
  if (kwIds.length) qs.set("with_keywords", kwIds.join(","));

  if (media === "movie") {
    qs.set("primary_release_date.gte", `${f.years[0]}-01-01`);
    qs.set("primary_release_date.lte", `${f.years[1]}-12-31`);
    qs.set("with_runtime.lte", String(f.runtime_max));
  } else {
    qs.set("first_air_date.gte", `${f.years[0]}-01-01`);
    qs.set("first_air_date.lte", `${f.years[1]}-12-31`);
  }
  return qs;
}

async function discover(
  media: Media,
  page: number,
  kwIds: number[],
  f: PoolFilters
) {
  const qs = buildQS(media, page, kwIds, f);
  qs.forEach((v, k) => v === "undefined" && qs.delete(k)); // strip empties

  const url = `${BASE_API_URL}/discover/${media}?${qs}`;
  const res = await fetchJSON<DiscoverMovieResponse | DiscoverTvResponse>(
    url,
    options
  );
  return res.results ?? [];
}

export function toCandidate(
  r: MovieResult | TvResult,
  media: Media
): Candidate {
  const title =
    media === "movie" ? (r as MovieResult).title : (r as TvResult).name;
  const date =
    media === "movie"
      ? (r as MovieResult).releaseDate
      : (r as TvResult).firstAirDate;
  const year = date ? Number(toDateString(date)?.slice(0, 4)) : 0;

  return {
    id: r.id,
    title,
    year,
    overview: r.overview.slice(0, 200),
    keywords: [],
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

  // anime bypasses language gate
  if (media === "tv" && isAnime(r as TvResult)) return f.media !== "movie";

  if (!isEnglish(r) && !f.language.includes(r.originalLanguage)) return false;
  if (media === "tv" && f.media === "movie") return false;
  if (media === "movie" && f.media === "series") return false;
  return true;
}

export function score(c: Candidate, tags: (string | undefined)[]): number {
  /* 1. weighted rating ---------------------------------------------- */
  const v = c.voteCount ?? 0;
  const WR =
    (v / (v + CONF_FLOOR)) * c.voteAverage +
    (CONF_FLOOR / (v + CONF_FLOOR)) * TMDB_MEAN;

  /* 2. semantic boost ------------------------------------------------ */
  const blob = `${c.title} ${c.overview}`.toLowerCase();
  let boost = 0;

  for (const raw of tags) {
    if (boost >= 2) break; // cap reached
    if (!raw) continue; // skip undefined / empty
    const tag = raw.toLowerCase();

    if (!blob.includes(tag)) continue;

    boost += c.title.toLowerCase().includes(tag) ? 1 : 0.5;
  }

  return WR + boost;
}

/* ───  main  ────────────────────────────────────────────────────────── */
export async function buildSmartPool(tags: string[], f: PoolFilters) {
  /* 1.  keyword id set (dedup) */
  const kwSet = new Set<number>();
  (await Promise.all(tags.map(fetchKeywordIds)))
    .flat()
    .forEach((id) => kwSet.add(id));
  tags.forEach((t) => TAG2ID[t]?.forEach((id) => kwSet.add(id)));
  const kwBatches = [...kwSet].map((id) => [id]);

  /* 2.  prepare collectors */
  const medias: Media[] =
    f.media === "either"
      ? ["movie", "tv"]
      : f.media === "movie"
        ? ["movie"]
        : ["tv"];

  const map = new Map<number, Candidate>();
  const push = (raw: MovieResult | TvResult, m: Media) =>
    passLocalFilters(raw, m, f) && map.set(raw.id, toCandidate(raw, m));

  /* 3.  helper inside to access map.size */
  async function collectPages(
    meds: Media[],
    pages: number,
    kwLists: number[][]
  ) {
    for (let p = 1; p <= pages && map.size < TARGET; p++) {
      await Promise.all(
        meds.flatMap((m) =>
          kwLists.map((kw) =>
            limit(() => discover(m, p, kw, f)).then((res) =>
              res.forEach((r) => push(r, m))
            )
          )
        )
      );
    }
  }

  /* 4.  run passes */
  await collectPages(medias, PAGES_KEYWORD, kwBatches);
  await collectPages(medias, PAGES_POPULAR, [[]]);
  const pool = [...map.values()]
    .sort((a, b) => score(b, tags) - score(a, tags))
    .slice(0, TARGET);

  console.log("length: " + pool.length);
  const unique = uniqueBy(pool);
  console.log("New length: " + unique.length);
  /* 5.  score & trim */
  return pool;
}
