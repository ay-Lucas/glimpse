"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWatchlist } from "@/context/watchlist";
import { EllipsisVertical } from "lucide-react";
import { Session } from "next-auth";

export function WatchlistDropdown({
  watchlistItemId,
  watchlistId,
  session,
}: {
  watchlistItemId: string;
  watchlistId: string;
  session: Session;
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
            watchlistId={watchlistId}
            watchlistItemId={watchlistItemId}
            session={session}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DeleteWatchlistItem({
  watchlistItemId,
  watchlistId,
  session,
}: {
  watchlistItemId: string;
  watchlistId: string;
  session: Session;
}) {
  const { deleteItem } = useWatchlist();

  const handleDelete = async () => {
    await deleteItem(watchlistId, watchlistItemId, session?.user.id!);
  };

  return (
    <button
      onClick={handleDelete}
      className="flex px-2 py-1.5 w-full focus:bg-accent"
    >
      Delete
    </button>
  );
}
