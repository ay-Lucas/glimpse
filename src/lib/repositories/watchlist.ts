"use server";
import { db } from "@/db/index";
import { movies, tvShows, watchlist, watchlistItems } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { getMediaForWatchlists } from "./media";
import { getCurrentUserId } from "@/services/supabase/server";

export async function addMovieToWatchlist(watchlistId: string, tmdbId: number) {
  return addWatchlistItem({ watchlistId, movieId: tmdbId, tvId: null });
}

export async function addTvToWatchlist(watchlistId: string, tmdbId: number) {
  return addWatchlistItem({ watchlistId, movieId: null, tvId: tmdbId });
}

async function addWatchlistItem(opts: {
  watchlistId: string;
  movieId: number | null;
  tvId: number | null;
}) {
  const [inserted] = await db.insert(watchlistItems).values(opts).returning();
  return inserted;
}

export async function getWatchlistsWithItems(
  userId: string
): Promise<WatchlistWithItems[]> {
  // 1) grab all lists
  const lists = await db.query.watchlist.findMany({
    where: (w, { eq }) => eq(w.userId, userId),
  });
  if (lists.length === 0) return [];

  // 2) grab *all* items for *all* those lists
  const listIds = lists.map((l) => l.id);
  const items = await db.query.watchlistItems.findMany({
    where: (wi, { inArray }) => inArray(wi.watchlistId, listIds),
  });

  // 3) group items by their parent watchlistId
  const itemsByList = items.reduce<Record<string, WatchlistItemModel[]>>(
    (acc, item) => {
      (acc[item.watchlistId] ??= []).push(item);
      return acc;
    },
    {}
  );

  // 4) stitch them back into each list
  return lists.map((l) => ({
    ...l,
    items: itemsByList[l.id] ?? [],
  }));
}

export type MovieModel = InferSelectModel<typeof movies>;
export type TvShowModel = InferSelectModel<typeof tvShows>;

export type MovieWatchlistModel = MovieModel & WatchlistItemModel;
export type TvShowWatchlistModel = TvShowModel & WatchlistItemModel;

export type DbMediaResult = {
  movies: MovieWatchlistModel[];
  tvShows: TvShowWatchlistModel[];
};

// export type WatchlistWithMedia = Omit<WatchlistWithItems, "items"> & {
//   media: DbMediaResult;
// };

export type WatchlistWithMedia = WatchlistModel & {
  items: DbMediaResult;
};

export async function getWatchlistsWithMedia(): Promise<WatchlistWithMedia[]> {
  const userId = await getCurrentUserId();

  const lists = await getWatchlistsWithItems(userId);
  if (!lists || lists?.length === 0) return [];

  // 2) Bulk fetch all movies & tvShows referenced in any list
  const { movies: movieModels, tvShows: tvModels } =
    await getMediaForWatchlists(lists);

  // Index by TMDb id
  const movieMap = new Map<number, MovieModel>(
    movieModels.map((m) => [m.id, m])
  );
  const tvMap = new Map<number, TvShowModel>(tvModels.map((t) => [t.id, t]));

  const watchlistsWithMedia = lists.map((wl): WatchlistWithMedia => {
    const movieResults: MovieWatchlistModel[] = [];
    const tvResults: TvShowWatchlistModel[] = [];

    wl.items?.forEach((item) => {
      if (item.movieId != null) {
        const media = movieMap.get(item.movieId);
        if (media)
          movieResults.push({ ...media, ...item } as MovieWatchlistModel);
      }
      if (item.tvId != null) {
        const media = tvMap.get(item.tvId);
        if (media)
          tvResults.push({ ...media, ...item } as TvShowWatchlistModel);
      }
    });
    return {
      ...wl,
      items: { movies: movieResults, tvShows: tvResults },
    };
  });
  return watchlistsWithMedia;
}

// 1) Infer each table’s row type
export type WatchlistModel = InferSelectModel<typeof watchlist>;
export type WatchlistItemModel = InferSelectModel<typeof watchlistItems>;

// 2) Compose your “with items” type
export type WatchlistWithItems = WatchlistModel & {
  items?: WatchlistItemModel[];
};
/**
 * Fetch a single watchlist plus its items for a given user.
 * Returns null if none found or not owned by that user.
 */
export async function getWatchlistWithItems(
  userId: string,
  watchlistId: string
): Promise<WatchlistWithItems | null> {
  // fetch the watchlist itself
  const wl = await db.query.watchlist.findFirst({
    where: (w, { and, eq }) => and(eq(w.id, watchlistId), eq(w.userId, userId)),
  });
  if (!wl) return null;

  // fetch its items separately
  const items = await db.query.watchlistItems.findMany({
    where: (wi, { eq }) => eq(wi.watchlistId, watchlistId),
  });

  // return a single object that has both
  return {
    ...wl,
    items,
  };
}
