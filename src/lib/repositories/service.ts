"use server";
import { fetchMovieDetails, fetchTvDetails } from "@/app/(media)/actions";
import { movieExists, tvShowExists } from "./media";
import { upsertMovieDetails, upsertTvDetails } from "./upsert";
import {
  addMovieToWatchlist,
  addTvToWatchlist,
  WatchlistItemModel,
} from "./watchlist";

async function ensureUpsert<T>(
  exists: (id: number) => Promise<boolean>,
  fetch: (id: number) => Promise<T>,
  upsert: (d: T) => Promise<any>,
  id: number
) {
  if (!(await exists(id))) {
    const details = await fetch(id);
    await upsert(details);
  }
}

export async function addWatchlistItemAndUpsertMedia(
  watchlistId: string,
  mediaType: "movie" | "tv",
  tmdbId: number
): Promise<WatchlistItemModel | undefined> {
  if (mediaType === "movie") {
    await ensureUpsert(
      movieExists,
      fetchMovieDetails,
      upsertMovieDetails,
      tmdbId
    );
    return addMovieToWatchlist(watchlistId, tmdbId);
  } else {
    await ensureUpsert(tvShowExists, fetchTvDetails, upsertTvDetails, tmdbId);
    return addTvToWatchlist(watchlistId, tmdbId);
  }
}
