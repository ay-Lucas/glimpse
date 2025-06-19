import { BlurData } from "@/types/redis";
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
  enableTelemetry: false,
  cache: "force-cache"
});

export const getRedisBlurValue = async (mediaType: "movie" | "tv", id: number) => {
  try {
    const blurData: BlurData | null = await redis.get(`lqip:${mediaType}:${id}`);
    return blurData;
  } catch (err) {
    console.error("Failed to retrieve Blur Data from Redis", err)
  }
}

export async function getRedisBlurValues(keys: string[]) {
  if (!keys.length) {
    console.error("Empty titles array passed to getRedisValues");
    return null;
  }
  try {
    const value = await redis.mget<BlurData[]>(keys)
    return value;
  } catch (err) {
    console.warn("Failed to retrieve Value from redis")
  }
}
