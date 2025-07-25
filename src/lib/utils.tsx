import { type ClassValue, clsx } from "clsx";
import {
  MovieResult,
  PersonResult,
  TvResult,
  Video,
} from "@/types/request-types-snakecase";
import { RatingResponse } from "@/types/request-types-camelcase";
import { twMerge } from "tailwind-merge";
import camelcaseKeys from "camelcase-keys";
import { Card } from "@/components/card";
import { BASE_POSTER_IMAGE_URL } from "./constants";
import Link from "next/link";
import { SlideImageCard } from "@/components/slide-image-card";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fisher-Yates algorithm
export function shuffle(array: string[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i] as any, array[j] as any] = [array[j], array[i]];
  }
  return array;
}

// sorts trending movies and tv objects
interface Item {
  popularity: number;
}

export function bubbleSort(arr: Array<MovieResult | TvResult>, n: number) {
  let temp: MovieResult | TvResult;
  let i, j: number;
  let swapped: boolean;
  for (i = 0; i < n - 1; i++) {
    swapped = false;
    for (j = 0; j < n - i - 1; j++) {
      let item = arr[j];
      let nextItem = arr[j + 1];
      if (
        item?.popularity &&
        nextItem?.popularity &&
        item?.popularity < nextItem.popularity
      ) {
        temp = item;
        item = nextItem;
        nextItem = temp;
        swapped = true;
      }
    }
    if (swapped == false) break;
  }
}

export function sortPopular(
  array: Array<MovieResult | TvResult>,
  minPopularity: number
) {
  if (typeof array === undefined || array.length == 0)
    throw new Error("Could not sort array: array is undefined or empty");
  bubbleSort(array, array.length);
  if (minPopularity > -1)
    return array.filter(
      (item) => item.popularity && item.popularity >= minPopularity
    );
  else return [];
}

export function filterList(
  array: Array<MovieResult | TvResult>,
  minPopularity: number
) {
  if (typeof array === undefined || array.length == 0)
    throw new Error("Could not sort array: array is undefined or empty");
  bubbleSort(array, array.length);
  if (minPopularity > -1)
    return array.filter(
      (item) => item.popularity && item.popularity >= minPopularity
    );
  else return [];
}

export function isUnique(
  item: MovieResult | TvResult,
  array: Array<MovieResult | TvResult>
) {
  let unique = false;
  array.forEach((trendingItem) => {
    if (
      (trendingItem.media_type === "tv" &&
        trendingItem.name === (item as any)?.name) ||
      (trendingItem.media_type === "movie" &&
        trendingItem.title === (item as any)?.title)
    )
      unique = true;
  });
  return !unique;
  // return item
}

export function isUsRating(item: RatingResponse) {
  return item.iso31661 === "US" && item !== undefined;
}

export function getTrailer(videoArray: Array<Video>) {
  const trailer: Array<Video> = videoArray.filter(
    (video) => video.type === "Trailer"
  );
  if (trailer?.length !== 0) {
    return trailer[0];
  } else {
    const teaser: Array<Video> = videoArray.filter(
      (video) => video.type === "Teaser"
    );
    return teaser[0];
  }
}

type AnyObject = Record<string, any>;

/**
 * 1) Pull off any TMDB‐special keys that camelcase‐keys won't touch (e.g. "watch/providers")
 * 2) deep‐convert the rest
 * 3) stick those special keys back in under camelCase
 * 4) assert the result as T
 */
export function tmdbToCamel<T extends AnyObject>(raw: AnyObject): T {
  // 1) Extract TMDB’s oddball fields
  const { "watch/providers": watchProviders, ...rest } = raw;

  // 2) Deep‐convert every other key
  const camel = camelcaseKeys(rest, { deep: true }) as AnyObject;

  // 3) Re‐attach the oddball under a proper camelCase name
  if (watchProviders !== undefined) {
    camel.watchProviders = watchProviders;
  }

  // 4) Assert to your API‐boundary type
  return camel as T;
}

export async function makeCarouselCards(data: Array<TvResult | MovieResult>) {
  return data.map(
    (item: MovieResult | TvResult | PersonResult, index: number) => {
      let card: React.ReactNode;
      switch (item.media_type) {
        case "tv":
          card = (
            <Card
              title={item.name}
              overview={item.overview}
              imagePath={item.poster_path}
              baseUrl={BASE_POSTER_IMAGE_URL}
              // blurDataURL={(item as any).blurDataURL}
              loading="lazy"
            />
          );
          break;
        case "movie":
          card = (
            <Card
              title={item.title}
              overview={item.overview}
              imagePath={item.poster_path}
              baseUrl={BASE_POSTER_IMAGE_URL}
              // blurDataURL={(item as any).blurDataURL}
              loading="lazy"
            />
          );
          break;
        case "person":
          card = (
            <Card
              title={item.name}
              overview=""
              imagePath={item.profile_path}
              baseUrl={BASE_POSTER_IMAGE_URL}
              loading="lazy"
            />
          );
          break;
      }
      return (
        <Link href={`/${item.media_type}/${item.id}`} key={index}>
          {card}
        </Link>
      );
    }
  );
}
export function languageCodeToEnglishName(code: string): string {
  if (!code || typeof code !== "string" || code.length !== 2) {
    return "Unknown";
  }

  try {
    const displayNames = new Intl.DisplayNames(["en"], { type: "language" });
    return displayNames.of(code) ?? code;
  } catch {
    return "Unknown";
  }
}

/**
 * Given an ISO 3166-1 alpha-2 code (e.g. "US", "GB", "FR"),
 * return its English short country name (e.g. "United States", "United Kingdom", "France").
 */
export function countryCodeToEnglishName(code: string): string {
  if (!code || typeof code !== "string" || code.length !== 2) {
    return "Unknown";
  }

  try {
    const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
    return displayNames.of(code.toUpperCase()) ?? code;
  } catch {
    return "Unknown";
  }
}

// Utility to dedupe by tmdbId
export function uniqueBy<T extends { id: number }>(arr: T[]): T[] {
  const seen = new Set<number>();
  return arr.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function getBaseUrl() {
  if (process.env.SITE_URL) {
    return process.env.SITE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function pause(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
