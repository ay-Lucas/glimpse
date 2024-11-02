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
import { loginSchema } from "@/types/schema";
import { db } from "@/db/index";
import { and, asc, eq } from "drizzle-orm";
import { users, watchlist, watchlistItems } from "@/db/schema";
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
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "credentials error",
            errors: {
              ...defaultValues,
              credentials: "incorrect email or password",
            },
          };
        default:
          return {
            message: "unknown error",
            errors: {
              ...defaultValues,
              unknown: "unknown error",
            },
          };
      }
    }
    throw error;
  }
}

export async function signout() {
  await signOut();
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

export async function addToWatchlist(
  watchlistId: string,
  tmdbId: number,
  title: string,
  itemType: "tv" | "movie",
  genres: string[],
) {
  const result = await db
    .insert(watchlistItems)
    .values({ watchlistId, tmdbId, title, itemType, genres })
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
async function createWatchlist(userId: string, name: string) {
  const result = await db
    .insert(watchlist)
    .values({
      userId,
      name,
    })
    .returning();

  return result; // Returns the newly created watchlist entry
}

export async function deleteWatchlistItem(
  watchlistId: string,
  watchlistItemId: string,
) {
  const result = await db
    .delete(watchlistItems)
    .where(
      and(
        eq(watchlistItems.watchlistId, watchlistId),
        eq(watchlistItems.itemId, watchlistItemId),
      ),
    )
    .returning();
  return result;
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
  tmdbId: number,
  title: string,
  itemType: "tv" | "movie",
  genres: string[],
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
      tmdbId,
    );
    if (existingItem.length > 0) {
      console.log("Item already exists");
      return null;
    }
    console.log(existingItem);
    let result = await addToWatchlist(
      defaultWatchlist?.id!,
      tmdbId,
      title,
      itemType,
      genres,
    );
    console.log("added" + result + " to Default watchlist");
    console.log(await getWatchlistItems(userId, defaultWatchlist?.id!));
    return result;
  } catch (error) {
    console.log(error);
  }
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
    })
    .from(watchlistItems)
    .leftJoin(watchlist, eq(watchlistItems.watchlistId, watchlistId)) // Corrected join syntax with eq
    .where(
      and(eq(watchlist.userId, userId), eq(watchlistItems.tmdbId, tmdbId)),
    ); // where expects a single condition argument

  return items;
}
