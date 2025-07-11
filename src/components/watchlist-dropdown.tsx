"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWatchlist } from "@/context/watchlist";
import { EllipsisVertical } from "lucide-react";
import EditWatchlist from "@/app/(media)/watchlist/_components/edit-watchlist";

export function WatchlistDropdown({
  watchlistId,
  watchlistName,
  watchlistDescription,
  isDefaultWatchlist,
  isPublic,
  tmdbId,
  mediaType,
}: {
  watchlistId: string;
  watchlistName: string;
  watchlistDescription: string;
  isDefaultWatchlist: boolean;
  isPublic: boolean;
  tmdbId: number;
  mediaType: "tv" | "movie";
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus-visible:outline-none">
          <EllipsisVertical />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <DeleteWatchlistItem
            tmdbId={tmdbId}
            watchlistId={watchlistId}
            mediaType={mediaType}
          />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <EditWatchlist
            watchlistId={watchlistId}
            watchlistName={watchlistName}
            isDefaultWatchlist={isDefaultWatchlist}
            watchlistDescription={watchlistDescription}
            isPublic={isPublic}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DeleteWatchlistItem({
  tmdbId,
  watchlistId,
  mediaType,
}: {
  tmdbId: number;
  watchlistId: string;
  mediaType: "tv" | "movie";
}) {
  const { deleteItem } = useWatchlist();

  return (
    <button
      onClick={() => deleteItem(watchlistId, tmdbId, mediaType)}
      className="flex w-full px-2 py-1.5 focus:bg-accent"
    >
      Delete
    </button>
  );
}
