import pLimit from "p-limit";
import { options } from "@/lib/constants";
import { Candidate } from "@/types/camel-index";
import { redisUncached as redis } from "@/services/cache";
import { unstable_cache } from "next/cache";

const KW_CONCURRENCY = 5;

/** single-movie cache fetch - returns max 5 keywords */
async function fetchKeywords(
  media: "movie" | "tv",
  id: number
): Promise<string[]> {
  const cacheKey = `kwlist:${media}:${id}`;
  let list = await redis.get<string[]>(cacheKey);
  if (list) return list;

  const url = `https://api.themoviedb.org/3/${media}/${id}/keywords`;
  const res = await fetch(url, options);
  if (!res.ok) return [];

  const json = await res.json();
  const raw = (json.keywords || json.results || []) as { name: string }[];
  list = raw.map((k) => k.name).slice(0, 5);

  await redis.set(cacheKey, list, { ex: 60 * 60 * 24 }); // 24 h
  return list;
}

const fetchCachedKeywords = unstable_cache(fetchKeywords, [], {
  revalidate: 60 * 60 * 60,
});

/** hydrate every Candidate.keywords in parallel (8 at a time) */
export async function hydrateKeywords(cands: Candidate[]) {
  const limit = pLimit(KW_CONCURRENCY);
  await Promise.all(
    cands.map((c) =>
      limit(async () => {
        c.keywords = await fetchCachedKeywords(c.mediaType, c.id);
      })
    )
  );
  return cands;
}
