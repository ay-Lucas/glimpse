import { BlurData } from "@/types/redis";
import { Redis } from "@upstash/redis";
import { unstable_cache } from "next/cache";

export const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
  enableTelemetry: false,
  cache: "force-cache",
});

export const redisUncached = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
  enableTelemetry: false,
  cache: "no-store",
});

export const getRedisBlurValue = async (
  mediaType: "movie" | "tv",
  id: number
) => {
  try {
    const blurData: BlurData | null = await redis.get(
      `lqip:${mediaType}:${id}`
    );
    return blurData;
  } catch (err) {
    console.error("Failed to retrieve Blur Data from Redis", err);
  }
};

export async function getRedisBlurValues(keys: string[]) {
  if (!keys.length) {
    console.error("Empty titles array passed to getRedisValues");
    return null;
  }
  try {
    const value = await redis.mget<BlurData[]>(keys);
    return value;
  } catch (err) {
    console.warn("Failed to retrieve Value from redis");
  }
}

export async function writePopularPeopleScores(sortedScores: number[]) {
  try {
    const key = `popular:people`;
    const payload = JSON.stringify({ sortedScores });

    // store in Redis, no TTL so it lives until you explicitly delete or override
    await redis.set(key, payload);
  } catch (err) {
    console.error(`⚠️  Failed to write popular people key`, err);
  }
}

export const getRedisPopularPeopleScores = unstable_cache(
  async () => {
    try {
      console.log("getRedisPopularPeopleScores called");
      const key = `popular:people`;
      // store in Redis, no TTL so it lives until you explicitly delete or override
      const value = await redis.get<{ sortedScores: number[] }>(key);
      return value;
    } catch (err) {
      console.error(`⚠️  Failed to retrieve popular people value`, err);
    }
  },
  [],
  { revalidate: 60 * 60 * 12 }
);
