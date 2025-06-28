"use client";
import { Button } from "./ui/button";
import { FullMovie, FullTv, WatchlistI } from "@/types/camel-index";
import { useWatchlist } from "@/context/watchlist";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Checkbox } from "./ui/checkbox";
import { MouseEvent, useEffect, useState } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { LucideListPlus } from "lucide-react";

export default function AddToWatchlistDropdown({
  userId,
  item,
  rating,
  mediaType,
}: {
  userId: string;
  item: FullTv | FullMovie;
  mediaType: "tv" | "movie";
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

  const handleCheckboxChange = (
    checked: CheckedState,
    watchlistId: string,
    mediaType: "movie" | "tv",
  ) => {
    setCheckboxStates((prevStates) => ({
      ...prevStates,
      [watchlistId]: checked,
    }));
    if (checked) {
      switch (mediaType) {
        case "movie":
          addItemToWatchlist(watchlistId, item, rating, "movie");
          break;
        case "tv":
          addItemToWatchlist(watchlistId, item, rating, "tv");
          break;
      }
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
      <DropdownMenuPortal>
        <DropdownMenuContent className="bg-black p-3">
          {watchlists.map((watchlist, index) => {

            const isChecked = Boolean(checkboxStates[watchlist.id])

            return (
              <>
                <DropdownMenuItem key={index} className="p-2 flex items-center space-x-2 cursor-pointer "
                  onSelect={(e) => {
                    // Prevent the default “close the menu” behavior
                    e.preventDefault()
                    // toggle
                    handleCheckboxChange(
                      isChecked ? false : true,
                      watchlist.id,
                      mediaType
                    )
                  }}

                >
                  <Checkbox
                    checked={checkboxStates[watchlist.id]}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(checked, watchlist.id, mediaType)
                    }
                    className="h-5 w-5"
                    onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing
                  />
                  <p>{watchlist.watchlistName}</p>
                </DropdownMenuItem>
                {index !== watchlists.length - 1 &&
                  <DropdownMenuSeparator />}
              </>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
