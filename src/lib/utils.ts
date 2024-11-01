import { type ClassValue, clsx } from "clsx";
import { MovieResult, RatingResponse, TvResult } from "@/types/request-types";
import { twMerge } from "tailwind-merge";

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
  minPopularity: number,
) {
  if (typeof array === undefined || array.length == 0)
    throw new Error("Could not sort array: array is undefined or empty");
  bubbleSort(array, array.length);
  if (minPopularity > -1)
    return array.filter(
      (item) => item.popularity && item.popularity >= minPopularity,
    );
  else return [];
}

export function filterList(
  array: Array<MovieResult | TvResult>,
  minPopularity: number,
) {
  if (typeof array === undefined || array.length == 0)
    throw new Error("Could not sort array: array is undefined or empty");
  bubbleSort(array, array.length);
  if (minPopularity > -1)
    return array.filter(
      (item) => item.popularity && item.popularity >= minPopularity,
    );
  else return [];
}

export function isUnique(
  item: MovieResult | TvResult,
  array: Array<MovieResult | TvResult>,
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
  return item.iso_3166_1 === "US" && item !== undefined;
}
