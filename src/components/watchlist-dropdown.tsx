"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { deleteItemFromWatchlist } from "@/lib/actions";
import { useWatchlist } from "@/context/watchlist";
import { useSession } from "next-auth/react";
import {
  Ellipsis,
  EllipsisVertical,
  LucideOption,
  MenuIcon,
  Option,
  OptionIcon,
} from "lucide-react";
import { IoOptions, IoOptionsOutline } from "react-icons/io5";

export function WatchlistDropdown({
  watchlistItemId,
  watchlistId,
}: {
  watchlistItemId: string;
  watchlistId: string;
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
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DeleteWatchlistItem({
  watchlistItemId,
  watchlistId,
}: {
  watchlistItemId: string;
  watchlistId: string;
}) {
  const { data: session, status } = useSession();
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
