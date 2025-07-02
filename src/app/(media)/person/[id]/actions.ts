import {
  BASE_API_URL,
  NUM_OF_POPULAR_PEOPLE_PAGES,
  options,
} from "@/lib/constants";
import { PersonPopularResponse } from "@/types/request-types-snakecase";
import pLimit from "p-limit";

export const fetchPopularPeopleScores = async (
  pages = NUM_OF_POPULAR_PEOPLE_PAGES
): Promise<{ sortedScores: number[] } | undefined> => {
  const limit = pLimit(5); // ← at most 5 concurrent fetches
  const safeFetch = async (pageNum: number) => {
    try {
      const res = await fetch(
        `${BASE_API_URL}/person/popular?page=${pageNum}`,
        options
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()) as PersonPopularResponse;
    } catch {
      return undefined;
    }
  };

  // schedule each fetch through the limiter
  const pagePromises = Array.from({ length: pages }, (_, i) =>
    limit(() => safeFetch(i + 1))
  );

  // wait for all to finish, but never more than 5 at once
  const pagesData = await Promise.all(pagePromises);

  // flatten + sort
  const allResults = pagesData.flatMap((p) => p?.results ?? []);
  const sortedScores = allResults
    .map((p) => p.popularity)
    .filter((n): n is number => typeof n === "number")
    .sort((a, b) => b - a);

  return { sortedScores };
};
