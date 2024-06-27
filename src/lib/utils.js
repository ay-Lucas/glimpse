import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Fisher-Yates algorithm
export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
  },
  cache: "force-cache",
};

// sorts trending movies and tv objects
export function bubbleSort(arr, n) {
  let i, j, temp;
  let swapped;
  for (i = 0; i < n - 1; i++) {
    swapped = false;
    for (j = 0; j < n - i - 1; j++) {
      if (arr[j].popularity < arr[j + 1].popularity) {
        temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;
      }
    }
    if (swapped == false) break;
  }
}

export function sortPopular(array, minPopularity = 0) {
  if (typeof array === undefined || array.length == 0)
    throw new Error("Could not sort array: array is undefined or empty");
  bubbleSort(array, array.length);
  if (minPopularity > 0)
    array = array.filter((item) => item.popularity >= minPopularity);
  return array;
}

export function isUnique(item, array) {
  let unique = false;
  array.forEach((trendingItem) => {
    if (trendingItem.media_type === "tv" && trendingItem.name === item.name) {
      return (unique = true);
    } else if (
      trendingItem.media_type === "movie" &&
      trendingItem.title === item.title
    ) {
      return (unique = true);
    }
  });
  return !unique;
  // return item
}
