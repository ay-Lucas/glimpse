"use client";
import { addToDefaultWatchlist } from "@/lib/actions";
import { Button } from "./ui/button";
import Link from "next/link";
import { WatchlistItemI } from "@/types";
import { Item } from "@/app/[type]/[id]/page";

export async function AddToWatchlistButton({
  watchlistItem,
  userId,
  isLoggedIn,
}: {
  watchlistItem: Item;
  userId: string;
  isLoggedIn: boolean;
}) {
  return (
    <>
      {isLoggedIn && watchlistItem !== undefined ? (
        <form
          action={async () =>
            await addToDefaultWatchlist(watchlistItem, userId)
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
