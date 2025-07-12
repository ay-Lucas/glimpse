"use server";
import {
  createWatchlist,
  isUniqueWatchlistName,
  setWatchlistDetails,
} from "@/lib/actions";
import { getCurrentUserId } from "@/services/supabase/server";
import { watchlistSchema } from "@/types/schema";

export async function setWatchlist(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    watchlistId: formData.get("watchlistId"),
    description: formData.get("description") as string | null,
    isPublic: formData.get("isPublic"),
  };

  const result = watchlistSchema.safeParse(raw);

  if (!result.success) {
    // return the flattened fieldErrors
    return { errors: result.error.flatten().fieldErrors };
  }
  const { watchlistId, name, description, isPublic } = result.data;

  const userId = await getCurrentUserId();

  const isNameUnique = await isUniqueWatchlistName(watchlistId, name, userId);

  if (!isNameUnique) {
    return {
      errors: { name: ["You already have a watchlist with that name"] },
    };
  }

  if (!watchlistId) {
    await createWatchlist(userId, name, isPublic, description);
  } else {
    await setWatchlistDetails(watchlistId, name, isPublic, description);
  }

  return { success: true };
}
