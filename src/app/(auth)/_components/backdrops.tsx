import { fetchTmdbMovieLists, fetchTmdbTvLists } from "@/app/discover/actions";

export async function getBackdrops() {
  const { trendingMoviesDaily } = await fetchTmdbMovieLists();
  const { trendingTvDaily } = await fetchTmdbTvLists();

  const allPaths = [...trendingMoviesDaily, ...trendingTvDaily]
    .map(item => item.backdropPath);

  const combined: string[] = allPaths.filter(
    (p): p is string => typeof p === "string" && p.length > 0
  );

  return combined;
}
