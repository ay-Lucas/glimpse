"use server";

import { watchlistNameSchema } from "@/types/schema";
import { db } from "@/db/index";
import { and, asc, eq, gt, sql } from "drizzle-orm";
import {
  rateLimitViolation,
  users,
  watchlist,
  watchlistItems,
} from "@/db/schema";
import {
  FullMovie,
  FullTv,
  JustWatchInfo,
  WatchlistI,
  WatchlistSchemaI,
} from "@/types/camel-index";
import { rateLimitLog } from "@/db/schema";
import { nanoid } from "nanoid";
import { Genre } from "@/types/types";
import { movieSummaries } from "@/db/schema";
import { tvSummaries } from "@/db/schema";
import { DiscoverItem } from "@/types/camel-index";


const LIMIT = 10;
const WINDOW = 60_000;

export async function deleteItemFromWatchlist(
  watchlistId: string,
  watchlistItemId: string,
) {
  await deleteWatchlistItem(watchlistId, watchlistItemId);
}

export async function addMovieToWatchlist(
  watchlistId: string,
  data: FullMovie,
  rating: string,
) {
  const result = await db
    .insert(watchlistItems)
    .values({
      tmdbId: data.id,
      watchlistId: watchlistId,
      title: data.title ?? "",
      itemType: "movie",
      genres:
        (data.genres as Genre[])?.map((genre) => genre.name || "none") ?? [], // Array of genre names (string[])
      tmdbVoteAverage: data.voteAverage
        ? parseFloat(data.voteAverage.toString())
        : null,
      rating: rating,
      popularity: Number(data.popularity?.toFixed()), // Popularity as integer or null
      language: data.originalLanguage,
      summary: data.overview,
      posterPath: data.posterPath,
      backdropPath: data.backdropPath,
    })
    .returning();

  return result;
}

export async function addTvToWatchlist(
  watchlistId: string,
  data: FullTv,
  rating: string,
) {
  const result = await db
    .insert(watchlistItems)
    .values({
      tmdbId: data.id,
      watchlistId: watchlistId,
      title: data.name ?? "",
      itemType: "tv",
      genres: data.genres?.map((genre) => genre.name || "none") ?? [], // Array of genre names (string[])
      tmdbVoteAverage: data.voteAverage
        ? parseFloat(data.voteAverage.toString())
        : null, // Parse as float
      rating: rating ?? null, // Rating is either string or null
      popularity: Number(data.popularity?.toFixed()) ?? null, // Popularity as integer or null
      language: data.originalLanguage || null, // Language as string or null
      numberOfSeasons: data.numberOfSeasons ?? null, // Integer or null
      numberOfEpisodes: data.numberOfEpisodes ?? null, // Integer or null
      summary: data.overview ?? null, // Summary is string or null
      posterPath: data.posterPath,
      backdropPath: data.backdropPath,
    })
    .returning();

  return result;
}

async function getUserIdByEmail(email: string): Promise<string | null> {
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user ? user.id : null; // Returns the userId or null if not found
}
export async function createWatchlist(userId: string, watchlistName: string) {
  const result = await db
    .insert(watchlist)
    .values({
      userId,
      watchlistName,
    })
    .returning();

  return result; // Returns the newly created watchlist entry
}

/** This function determines the type of the `watchlistItemId` parameter and uses the appropriate
 * field (`itemId` or `tmdbId`) to locate and delete the item in the `watchlistItems` table.
 */
export async function deleteWatchlistItem(
  watchlistId: string,
  watchlistItemId: string | number,
) {
  const result = await db
    .delete(watchlistItems)
    .where(
      and(
        eq(watchlistItems.watchlistId, watchlistId),
        typeof watchlistItemId === "string"
          ? eq(watchlistItems.itemId, watchlistItemId)
          : eq(watchlistItems.tmdbId, watchlistItemId),
      ),
    )
    .returning();
  return result;
}

export async function deleteWatchlistItemTmdbId(
  watchlistId: string,
  tmdbId: number,
) {
  const result = await db
    .delete(watchlistItems)
    .where(
      and(
        eq(watchlistItems.watchlistId, watchlistId),
        eq(watchlistItems.tmdbId, tmdbId),
      ),
    )
    .returning();
  return result;
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
    .where(and(eq(watchlist.userId, userId), eq(watchlist.default, true)))
    .limit(1); // Limit to 1 to ensure a single result

  return defaultWatchlist || null; // Return the watchlist or null if not found
}

export async function addToDefaultWatchlist(
  userId: string,
  data: FullTv | FullMovie,
  rating: string,
  mediaType: "tv" | "movie",
) {
  try {
    let defaultWatchlist;
    defaultWatchlist = await getDefaultWatchlist(userId);
    if (!defaultWatchlist) {
      setFirstWatchlistAsDefault(userId);
      defaultWatchlist = await getDefaultWatchlist(userId);
    }
    const existingItem = await getWatchlistItem(
      userId,
      defaultWatchlist?.id!,
      data.id,
    );
    if (existingItem.length > 0) {
      console.log("Item already exists");
      return null;
    }
    let result;
    switch (mediaType) {
      case "movie":
        result = await addMovieToWatchlist(
          defaultWatchlist?.id!,
          data as FullMovie,
          rating,
        );
        break;
      case "tv":
        result = await addTvToWatchlist(
          defaultWatchlist?.id!,
          data as FullTv,
          rating,
        );
        break;
      default:
        result = null;
        console.error(
          `Failed to add ${(data as any).name || (data as any).title} to default watchlist`,
        );
    }
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function setWatchlistName(
  userId: string,
  watchlistId: string,
  newWatchlistName: string,
) {
  const validatedFields = watchlistNameSchema.safeParse({
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
      .set({ watchlistName: validatedFields.data.name })
      .where(and(eq(watchlist.userId, userId), eq(watchlist.id, watchlistId)))
      .returning();

    if (watchlistToChange?.watchlistName === newWatchlistName)
      return watchlistToChange;
  } catch (error) {
    console.log("Failed to set watchlist name", error);
  }
}

export async function getUserFromDbUUID(UUID: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, UUID),
  });
  return user;
}

async function setFirstWatchlistAsDefault(userId: string): Promise<void> {
  // Step 1: Check if the user already has a default watchlist
  const [existingDefault] = await db
    .select()
    .from(watchlist)
    .where(and(eq(watchlist.userId, userId), eq(watchlist.default, true)))
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
      .set({ default: true })
      .where(eq(watchlist.id, firstWatchlist.id));
  }
}

async function getWatchlistItems(userId: string, watchlistId: string) {
  const items = await db
    .select({
      id: watchlistItems.id,
      watchlistId: watchlistItems.watchlistId,
      itemId: watchlistItems.itemId,
      tmdbId: watchlistItems.tmdbId,
      title: watchlistItems.title,
      itemType: watchlistItems.itemType,
      genres: watchlistItems.genres,
      watchlistName: watchlist.watchlistName,
      tmdbVoteAverage: watchlistItems.tmdbVoteAverage,
      rating: watchlistItems.rating,
      popularity: watchlistItems.popularity,
      language: watchlistItems.language,
      numberOfSeasons: watchlistItems.numberOfSeasons,
      numberOfEpisodes: watchlistItems.numberOfEpisodes,
      summary: watchlistItems.summary,
      posterPath: watchlistItems.posterPath,
      backdropPath: watchlistItems.backdropPath,
    })
    .from(watchlistItems)
    .leftJoin(watchlist, eq(watchlistItems.watchlistId, watchlistId)) // Corrected join syntax with eq
    .where(eq(watchlist.userId, userId)); // where expects a single condition argument

  return items;
}
async function getWatchlistItem(
  userId: string,
  watchlistId: string,
  tmdbId: number,
) {
  const items = await db
    .select({
      id: watchlistItems.id,
      watchlistId: watchlistItems.watchlistId,
      itemId: watchlistItems.itemId,
      tmdbId: watchlistItems.tmdbId,
      title: watchlistItems.title,
      itemType: watchlistItems.itemType,
      genres: watchlistItems.genres,
      tmdbVoteAverage: watchlistItems.tmdbVoteAverage,
      rating: watchlistItems.rating,
      popularity: watchlistItems.popularity,
      language: watchlistItems.language,
      numberOfSeasons: watchlistItems.numberOfSeasons,
      numberOfEpisodes: watchlistItems.numberOfEpisodes,
      summary: watchlistItems.summary,
      posterPath: watchlistItems.posterPath,
      backdropPath: watchlistItems.backdropPath,
    })
    .from(watchlistItems)
    .leftJoin(watchlist, eq(watchlistItems.watchlistId, watchlistId)) // Corrected join syntax with eq
    .where(
      and(eq(watchlist.userId, userId), eq(watchlistItems.tmdbId, tmdbId)),
    ); // where expects a single condition argument

  return items;
}
export async function getWatchlist(
  userId: string,
  watchlistId: string,
): Promise<WatchlistSchemaI[]> {
  const items = await db
    .select({
      id: watchlist.id,
      watchlistName: watchlist.watchlistName,
      userid: watchlist.userId,
      createdAt: watchlist.createdAt,
      default: watchlist.default,
    })
    .from(watchlist)
    .where(and(eq(watchlist.userId, userId), eq(watchlist.id, watchlistId)))
    .limit(1);
  return items;
}

export async function getWatchlists(
  userId: string,
): Promise<WatchlistSchemaI[]> {
  const items = await db
    .select({
      id: watchlist.id,
      watchlistName: watchlist.watchlistName,
      userid: watchlist.userId,
      createdAt: watchlist.createdAt,
      default: watchlist.default,
    })
    .from(watchlist)
    .where(eq(watchlist.userId, userId));
  return items;
}

export async function getWatchlistsAndItems(
  userId: string,
): Promise<WatchlistI[]> {
  // Get the user's watchlists
  const watchlistsRes = await getWatchlists(userId);

  // Get all items associated with the user's watchlists
  const items = await db
    .select({
      id: watchlistItems.id,
      watchlistId: watchlistItems.watchlistId,
      itemId: watchlistItems.itemId,
      tmdbId: watchlistItems.tmdbId,
      title: watchlistItems.title,
      itemType: watchlistItems.itemType,
      genres: watchlistItems.genres,
      tmdbVoteAverage: watchlistItems.tmdbVoteAverage,
      rating: watchlistItems.rating,
      popularity: watchlistItems.popularity,
      language: watchlistItems.language,
      numberOfSeasons: watchlistItems.numberOfSeasons,
      numberOfEpisodes: watchlistItems.numberOfEpisodes,
      summary: watchlistItems.summary,
      posterPath: watchlistItems.posterPath,
      backdropPath: watchlistItems.backdropPath,
    })
    .from(watchlistItems)
    .leftJoin(watchlist, eq(watchlist.id, watchlistItems.watchlistId))
    .where(eq(watchlist.userId, userId));

  const watchlists: WatchlistI[] = watchlistsRes.map((watchlist) => {
    const filteredItems = items
      .filter((item) => item.watchlistId === watchlist.id)
      .map((item) => ({
        id: item.id,
        watchlistId: item.watchlistId as string,
        itemId: item.itemId as string,
        tmdbId: item.tmdbId,
        title: item.title,
        itemType: item.itemType as "tv" | "movie",
        genres: item.genres,
        tmdbVoteAverage: Number(item.tmdbVoteAverage) || 0,
        rating: item.rating ?? "",
        popularity: item.popularity ?? 0,
        language: item.language ?? "",
        numberOfSeasons: item.numberOfSeasons ?? 0,
        numberOfEpisodes: item.numberOfEpisodes ?? 0,
        summary: item.summary ?? "",
        posterPath: item.posterPath ?? null,
        backdropPath: item.backdropPath ?? null,
      }));

    return {
      ...watchlist,
      items: filteredItems,
    };
  });

  return watchlists;
}

export async function getAllTv(): Promise<DiscoverItem[] | undefined> {
  try {
    const rows = await db
      .select({
        tmdbId: tvSummaries.tmdbId,
        title: tvSummaries.name,
        posterBlurDataUrl: tvSummaries.posterBlurDataUrl,
      })
      .from(tvSummaries)

    return rows.map((r) => ({
      tmdbId: r.tmdbId,
      mediaType: "tv",
      title: r.title,
      posterBlurDataUrl: r.posterBlurDataUrl ?? undefined,
    }));
  }
  catch (err) {
    console.error("Error fetching backfilled TV Shows from DB")
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
      .from(movieSummaries)

    return rows.map((r) => ({
      tmdbId: r.tmdbId,
      mediaType: "movie",
      title: r.title,
      posterBlurDataUrl: r.posterBlurDataUrl ?? undefined,
      backdropPath: r.backdropPath ?? undefined,
    }));
  }
  catch (err) {
    console.error("Error fetching backfilled Movies from DB")
  }
}

export const getAllDiscoverTitles = async () => {
  const [tvRows, movieRows] = await Promise.all([getAllMovies(), getAllTv()]);
  return [...tvRows ?? [], ...movieRows ?? []]
}

export const getJustWatchInfoFromDb = async (tmdbId: number, mediaType: "tv" | "movie") => {
  try {
    if (mediaType === "movie") {
      const rows = await db
        .select({
          justWatchInfo: movieSummaries.justWatchInfo
        })
        .from(movieSummaries)
        .where(and(eq(movieSummaries.tmdbId, tmdbId)))
        .limit(1)

      return rows[0] as JustWatchInfo | undefined

    } else if (mediaType === "tv") {
      const rows = await db
        .select({
          justWatchInfo: tvSummaries.justWatchInfo
        })
        .from(tvSummaries)
        .where(and(eq(tvSummaries.tmdbId, tmdbId)))
        .limit(1)

      return rows[0] as JustWatchInfo | undefined
    }
  }
  catch (err) {
    console.error(`Error fetching backfilled JustWatchInfo from DB. ${mediaType}/${tmdbId}\n`, err)
  }
}

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
        `[RateLimit] IP ${ip} is currently locked out for ${lockoutTime / 1000}s (violation count: ${violation.count})`,
      );
      return false; // still locked out
    }
  }

  // Check request frequency
  const recentRequests = await db.query.rateLimitLog.findMany({
    where: and(
      eq(rateLimitLog.ip, ip),
      eq(rateLimitLog.route, route),
      gt(rateLimitLog.createdAt, cutoff),
    ),
  });

  if (recentRequests.length >= LIMIT) {
    console.warn(
      `[RateLimit] IP ${ip} exceeded limit (${LIMIT} reqs in ${WINDOW / 1000}s) on route ${route}`,
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
