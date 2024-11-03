"use client";
import { addToDefaultWatchlist } from "@/lib/actions";
import { Button } from "./ui/button";
import Link from "next/link";

export async function AddToWatchlistButton({
  userId,
  title,
  itemType,
  watchlistName = "Default",
  isLoggedIn,
  tmdbId,
  genres,
}: {
  userId: string | undefined;
  title: string;
  itemType: string;
  watchlistName: string;
  isLoggedIn: boolean;
  tmdbId: number;
  genres: string[];
}) {
  return (
    <>
      {isLoggedIn &&
      userId !== undefined &&
      (itemType === "tv" || itemType === "movie") ? (
        <form
          action={async () =>
            (itemType === "tv" || itemType === "movie") &&
            (await addToDefaultWatchlist(
              userId,
              tmdbId,
              title,
              itemType,
              genres,
            ))
          }
        >
          <Button variant="secondary">Add to Watchlist</Button>
        </form>
      ) : (
        <Link href={"/signin"}>
          <Button variant="secondary">Add to Watchlist</Button>
        </Link>
      )}
    </>
  );
}
