"use server";

import { AuthError } from "next-auth";
import {
  addUserToDb,
  auth,
  isExistingUser,
  passwordToSalt,
  signIn,
  signOut,
} from "@/auth";
import { redirect } from "next/navigation";
import { loginSchema, watchlistNameSchema } from "@/types/schema";
import { db } from "@/db/index";
import { and, asc, eq } from "drizzle-orm";
import { users, watchlist, watchlistItems } from "@/db/schema";
import { WatchlistI, WatchlistSchemaI } from "@/types";
import { Item } from "@/types";
const defaultValues = {
  email: "",
  password: "",
};

export async function signin(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    const validatedFields = loginSchema.safeParse({
      email: email,
      password: password,
    });

    if (!validatedFields.success) {
      return {
        message: "validation error",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    if (await isExistingUser(validatedFields.data.email))
      await signIn("credentials", formData);
    else {
      console.log("User Does Not Exist");
      return;
    }

    return {
      message: "success",
      errors: {},
    };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.message.includes("CredentialsSignin")) {
        return {
          message: "credentials error",
          errors: {
            ...defaultValues,
            credentials: "incorrect email or password",
          },
        };
      }
      return {
        message: "unknown error",
        errors: {
          ...defaultValues,
          unknown: error.message,
        },
      };
    }
    throw error;
  }
}

export async function signout() {
  await signOut();
}

export async function deleteItemFromWatchlist(
  watchlistId: string,
  watchlistItemId: string,
) {
  await deleteWatchlistItem(watchlistId, watchlistItemId);
}

export async function signup(prevState: any, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const validatedFields = loginSchema.safeParse({
    email: email,
    password: password,
  });

  if (!validatedFields.success) {
    // console.log(validatedFields.error.message);
    return {
      message: "validation error",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const userExists = await isExistingUser(validatedFields.data.email);
  if (userExists) {
    console.log("User already exists");
    redirect("/signin");
  }
  const hashedPassword = passwordToSalt(validatedFields.data.password);
  await addUserToDb(validatedFields.data.email, hashedPassword);
  console.log('New user "' + email + '" registerd');
  await signIn("credentials", formData);
  const session = await auth();
  createWatchlist(session?.user.id!, "Default");
  setFirstWatchlistAsDefault(session?.user.id!);
  console.log("Signing in..");
}

export async function addToWatchlist(watchlistId: string, item: Item) {
  const itemType = item.media_type === "tv" ? "tv" : "movie";
  const result = await db
    .insert(watchlistItems)
    .values({
      tmdbId: item.tmdbId ?? "",
      watchlistId: watchlistId, // Ensure watchlistId is a string (UUID format)
      title: item.title ?? "", // Ensure title is a non-null string
      itemType: itemType, // "tv" or "movie"
      genres: item.genres?.map((genre) => genre.name || "none") ?? [], // Array of genre names (string[])
      tmdbVoteAverage: item.voteAverage
        ? parseFloat(item.voteAverage.toString())
        : null, // Parse as float
      rating: item.rating ?? null, // Rating is either string or null
      popularity: Number(item.popularity.toFixed()) ?? null, // Popularity as integer or null
      language: item.language || null, // Language as string or null
      numberOfSeasons: item.numberOfSeasons ?? null, // Integer or null
      numberOfEpisodes: item.numberOfEpisodes ?? null, // Integer or null
      summary: item.overview ?? null, // Summary is string or null
      posterPath: item.posterPath,
      backdropPath: item.backdropPath,
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
  watchlistItem: Item,
  userId: string,
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
      watchlistItem.tmdbId,
    );
    if (existingItem.length > 0) {
      console.log("Item already exists");
      return null;
    }
    let result = await addToWatchlist(defaultWatchlist?.id!, watchlistItem);
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

export async function getWatchlists(userId: string) {
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
