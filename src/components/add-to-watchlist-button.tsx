"use client";
import { Button } from "./ui/button";
import { WatchlistI } from "@/types";
import { useWatchlist } from "@/context/watchlist";
import {
  DropdownMenu,
  DropdownMenuContent,
} from "@radix-ui/react-dropdown-menu";
import { DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Checkbox } from "./ui/checkbox";
import { useEffect, useState } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { LucideListPlus } from "lucide-react";
import {
  MovieResponseAppended,
  ShowResponseAppended,
} from "@/types/request-types";

export default function AddToWatchlistDropdown({
  userId,
  item,
  rating,
}: {
  userId: string;
  item: ShowResponseAppended | MovieResponseAppended;
  rating: string;
}) {
  const { addItemToWatchlist, deleteItem, watchlists } = useWatchlist();
  const [open, setOpen] = useState(false);

  // Track checkbox states for each watchlist item by ID
  const [checkboxStates, setCheckboxStates] = useState<
    Record<string, CheckedState>
  >(() => {
    const initialStates: Record<string, CheckedState> = {};
    watchlists.forEach((watchlist) => {
      initialStates[watchlist.id] = isItemOnWatchlist(watchlist);
    });
    return initialStates;
  });

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const handleCheckboxChange = (checked: CheckedState, watchlistId: string) => {
    setCheckboxStates((prevStates) => ({
      ...prevStates,
      [watchlistId]: checked,
    }));
    if (checked) {
      addItemToWatchlist(watchlistId, item, rating);
    } else {
      deleteItem(watchlistId, item.id, userId);
    }
  };

  function isItemOnWatchlist(watchlist: WatchlistI) {
    // watchlists?.some((item) => item.id === watchlist.id) || false
    const found = watchlist.items.find(
      (watchlistItem) => watchlistItem.tmdbId === item.id,
    );
    return found !== undefined;
  }
  // Sync checkbox states with watchlistsWithItem and userWatchlists whenever they change
  useEffect(() => {
    const initialStates: Record<string, CheckedState> = {};
    watchlists.forEach((watchlist) => {
      initialStates[watchlist.id] = isItemOnWatchlist(watchlist);
    });
    setCheckboxStates(initialStates);
  }, [watchlists]);

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          className="focus-visible:outline-none flex px-2 py-1.5 focus:bg-accent"
          variant="outline"
        >
          <LucideListPlus className="mr-2 p-0.5" />
          Add to Watchlist
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black p-3">
        {watchlists.map((watchlist, index) => (
          <DropdownMenuItem key={index} className="w-40">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={checkboxStates[watchlist.id]}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(checked, watchlist.id)
                }
                onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing
              />
              <span>{watchlist.watchlistName}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
