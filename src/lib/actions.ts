"use server";

import { watchlistSchema } from "@/types/schema";
import { db } from "@/db/index";
import { and, asc, eq, gt, not, sql } from "drizzle-orm";
import { rateLimitViolation, watchlist, watchlistItems } from "@/db/schema";
import { JustWatchInfo } from "@/types/camel-index";
import { rateLimitLog } from "@/db/schema";
import { nanoid } from "nanoid";
import { movieSummaries } from "@/db/schema";
import { tvSummaries } from "@/db/schema";
import { DiscoverItem } from "@/types/camel-index";

const LIMIT = 10;
const WINDOW = 60_000;

export async function setWatchlistDetails(
  watchlistId: string,
  name: string,
  isPublic: boolean,
  description: string | undefined
) {
  const result = await db
    .update(watchlist)
    .set({
      name,
      isPublic,
      description: description ?? null,
    })
    .where(eq(watchlist.id, watchlistId))
    .returning();

  return result;
}
export async function isUniqueWatchlistName(
  watchlistId: string | undefined,
  name: string,
  userId: string
) {
  const baseFilter = and(
    eq(watchlist.userId, userId),
    eq(watchlist.name, name)
  );
  const conflict = await db.query.watchlist.findFirst({
    where: watchlistId
      ? and(baseFilter, not(eq(watchlist.id, watchlistId)))
      : baseFilter,
    columns: { id: true }, // only fetch the PK
  });
  return conflict === undefined;
}

export async function createWatchlist(
  userId: string,
  name: string,
  isPublic: boolean,
  description: string | undefined
) {
  const result = await db
    .insert(watchlist)
    .values({
      userId,
      name,
      isPublic,
      description: description ?? null,
    })
    .returning();

  return result; // Returns the newly created watchlist entry
}

/**
 * Delete one item (movie or TV) from a watchlist.
 *
 * @param opts.watchlistId  - the UUID of the watchlist
 * @param opts.mediaType    - "movie" or "tv"
 * @param opts.tmdbId       - the TMDb ID of the media
 * @returns the deleted row, or null if none matched
 */
export async function deleteWatchlistItem(opts: {
  watchlistId: string;
  mediaType: "movie" | "tv";
  tmdbId: number;
}) {
  const { watchlistId, mediaType, tmdbId } = opts;

  const predicate =
    mediaType === "movie"
      ? and(
          eq(watchlistItems.watchlistId, watchlistId),
          eq(watchlistItems.movieId, tmdbId)
        )
      : and(
          eq(watchlistItems.watchlistId, watchlistId),
          eq(watchlistItems.tvId, tmdbId)
        );

  const [deleted] = await db
    .delete(watchlistItems)
    .where(predicate)
    .returning();

  return deleted || null;
}

export async function deleteWatchlist(userId: string, watchlistId: string) {
  try {
    // Delete watchlist items referencing watchlistId
    const itemRes = await db
      .delete(watchlistItems)
      .where(and(eq(watchlistItems.watchlistId, watchlistId)))
      .returning();
    // Delete watchlist
    const watchlistRes = await db
      .delete(watchlist)
      .where(and(eq(watchlist.id, watchlistId), eq(watchlist.userId, userId)))
      .returning();
    return watchlistRes;
  } catch (error) {
    console.log("Failed to delete watchlist", error);
  }
}

async function deleteAllWatchlistItems() {
  try {
    // Execute the delete command
    await db.delete(watchlistItems);
    console.log("All rows deleted successfully.");
  } catch (error) {
    console.error("Error deleting rows:", error);
  }
}

export async function getDefaultWatchlist(userId: string) {
  const [defaultWatchlist] = await db
    .select()
    .from(watchlist)
    .where(and(eq(watchlist.userId, userId), eq(watchlist.isDefault, true)))
    .limit(1); // Limit to 1 to ensure a single result

  return defaultWatchlist || null; // Return the watchlist or null if not found
}

export async function setWatchlistName(
  userId: string,
  watchlistId: string,
  newWatchlistName: string
) {
  const validatedFields = watchlistSchema.safeParse({
    name: newWatchlistName,
  });

  if (!validatedFields.success) {
    return {
      message: "validation error",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const [watchlistToChange] = await db
      .update(watchlist)
      .set({ name: validatedFields.data.name })
      .where(and(eq(watchlist.userId, userId), eq(watchlist.id, watchlistId)))
      .returning();

    if (watchlistToChange?.name === newWatchlistName) return watchlistToChange;
  } catch (error) {
    console.log("Failed to set watchlist name", error);
  }
}

async function setFirstWatchlistAsDefault(userId: string): Promise<void> {
  // Step 1: Check if the user already has a default watchlist
  const [existingDefault] = await db
    .select()
    .from(watchlist)
    .where(and(eq(watchlist.userId, userId), eq(watchlist.isDefault, true)))
    .limit(1);

  // If a default watchlist exists, no action is needed
  if (existingDefault) return;
  // Step 2: Find the earliest created watchlist for the user
  const [firstWatchlist] = await db
    .select()
    .from(watchlist)
    .where(eq(watchlist.userId, userId))
    .orderBy(asc(watchlist.createdAt))
    .limit(1);

  // Step 3: If a watchlist exists, set it as the default
  if (firstWatchlist) {
    await db
      .update(watchlist)
      .set({ isDefault: true })
      .where(eq(watchlist.id, firstWatchlist.id));
  }
}

export async function isItemOnWatchlist(opts: {
  watchlistId: string;
  mediaType: "movie" | "tv";
  tmdbId: number;
}): Promise<boolean> {
  const { watchlistId, mediaType, tmdbId } = opts;

  const found = await db.query.watchlistItems.findFirst({
    where: (wi, { and, eq }) =>
      and(
        eq(wi.watchlistId, watchlistId),
        mediaType === "movie" ? eq(wi.movieId, tmdbId) : eq(wi.tvId, tmdbId)
      ),
  });

  return found !== undefined;
}

// export async function getWatchlistsWithItems(userId: string): Promise<WatchlistWithItems[] | null> {
//   return db.query.watchlist.findMany({
//     where: (w, { eq }) => eq(w.userId, userId),
//     with: watchlistRelations,
//   });
// }

// export async function getWatchlistsWithItems(
//   userId: string
// ): Promise<WatchlistWithItems[] | null> {
//   return db.query.watchlist.findMany({
//     where: (w, { eq }) => eq(w.userId, userId),
//     with: watchlistRelations,
//   });
// }
// export async function getWatchlistsAndItems(
//   userId: string
// ): Promise<WatchlistI[]> {
//   // Get the user's watchlists
//   const watchlistsRes = await getWatchlists(userId);
//
//   // Get all items associated with the user's watchlists
//   const items = await db
//     .select({
//       id: watchlistItems.id,
//       watchlistId: watchlistItems.watchlistId,
//       tvId: watchlistItems.tvId,
//       movieId: watchlistItems.movieId
//     })
//     .from(watchlistItems)
//     .leftJoin(watchlist, eq(watchlist.id, watchlistItems.watchlistId))
//     .where(eq(watchlist.userId, userId));
//
//   const watchlists: WatchlistI[] = watchlistsRes.map((watchlist) => {
//     const filteredItems = items
//       .filter((item) => item.watchlistId === watchlist.id)
//       .map((item) => ({
//       }));
//
//     return {
//       ...watchlist,
//       items: filteredItems,
//     };
//   });
//
//   return watchlists;
// }

export async function getAllTv(): Promise<DiscoverItem[] | undefined> {
  try {
    const rows = await db
      .select({
        tmdbId: tvSummaries.tmdbId,
        title: tvSummaries.name,
        posterBlurDataUrl: tvSummaries.posterBlurDataUrl,
      })
      .from(tvSummaries);

    return rows.map((r) => ({
      tmdbId: r.tmdbId,
      mediaType: "tv",
      title: r.title,
      posterBlurDataUrl: r.posterBlurDataUrl ?? undefined,
    }));
  } catch (err) {
    console.error("Error fetching backfilled TV Shows from DB");
  }
}

export async function getAllMovies(): Promise<DiscoverItem[] | undefined> {
  try {
    const rows = await db
      .select({
        tmdbId: movieSummaries.tmdbId,
        title: movieSummaries.title,
        posterBlurDataUrl: movieSummaries.posterBlurDataUrl,
        backdropPath: movieSummaries.backdropPath,
      })
      .from(movieSummaries);

    return rows.map((r) => ({
      tmdbId: r.tmdbId,
      mediaType: "movie",
      title: r.title,
      posterBlurDataUrl: r.posterBlurDataUrl ?? undefined,
      backdropPath: r.backdropPath ?? undefined,
    }));
  } catch (err) {
    console.error("Error fetching backfilled Movies from DB");
  }
}

export const getAllDiscoverTitles = async () => {
  const [tvRows, movieRows] = await Promise.all([getAllMovies(), getAllTv()]);
  return [...(tvRows ?? []), ...(movieRows ?? [])];
};

export const getJustWatchInfoFromDb = async (
  tmdbId: number,
  mediaType: "tv" | "movie"
) => {
  try {
    if (mediaType === "movie") {
      const rows = await db
        .select({
          justWatchInfo: movieSummaries.justWatchInfo,
        })
        .from(movieSummaries)
        .where(and(eq(movieSummaries.tmdbId, tmdbId)))
        .limit(1);

      return rows[0] as JustWatchInfo | undefined;
    } else if (mediaType === "tv") {
      const rows = await db
        .select({
          justWatchInfo: tvSummaries.justWatchInfo,
        })
        .from(tvSummaries)
        .where(and(eq(tvSummaries.tmdbId, tmdbId)))
        .limit(1);

      return rows[0] as JustWatchInfo | undefined;
    }
  } catch (err) {
    console.error(
      `Error fetching backfilled JustWatchInfo from DB. ${mediaType}/${tmdbId}\n`,
      err
    );
  }
};

export async function isRateLimited(ip: string, route: string) {
  const now = Date.now();
  const cutoff = new Date(now - WINDOW);

  // Escalating lockout check
  const violation = await db.query.rateLimitViolation.findFirst({
    where: eq(rateLimitViolation.ip, ip),
  });

  if (violation) {
    const last = new Date(violation.lastViolation).getTime();
    const lockoutTime = Math.min(violation.count * 30_000, 10 * 60_000); // max 10 minutes

    if (now - last < lockoutTime) {
      console.warn(
        `[RateLimit] IP ${ip} is currently locked out for ${lockoutTime / 1000}s (violation count: ${violation.count})`
      );
      return false; // still locked out
    }
  }

  // Check request frequency
  const recentRequests = await db.query.rateLimitLog.findMany({
    where: and(
      eq(rateLimitLog.ip, ip),
      eq(rateLimitLog.route, route),
      gt(rateLimitLog.createdAt, cutoff)
    ),
  });

  if (recentRequests.length >= LIMIT) {
    console.warn(
      `[RateLimit] IP ${ip} exceeded limit (${LIMIT} reqs in ${WINDOW / 1000}s) on route ${route}`
    );

    // Log or escalate violation
    await db
      .insert(rateLimitViolation)
      .values({
        ip,
        count: 1,
        lastViolation: new Date(),
      })
      .onConflictDoUpdate({
        target: rateLimitViolation.ip,
        set: {
          count: sql`${rateLimitViolation.count} + 1`,
          lastViolation: new Date(),
        },
      });

    return false;
  }

  // Allowed request — log it
  await db.insert(rateLimitLog).values({
    id: `${ip}-${Date.now()}-${nanoid(6)}`,
    ip,
    route,
  });

  return true;
}
