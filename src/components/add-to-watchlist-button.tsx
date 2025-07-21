"use client";
import { Button } from "./ui/button";
import { useWatchlist } from "@/context/watchlist";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Checkbox } from "./ui/checkbox";
import { forwardRef, Fragment, useEffect, useState } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { BookmarkPlus } from "lucide-react";
import { MovieResult, TvResult } from "@/types/request-types-camelcase";

export default function AddToWatchlistDropdown({
  userId,
  tmdbId,
  mediaType,
  variant,
}: {
  userId: string;
  tmdbId: number;
  mediaType: "tv" | "movie";
  variant: "default" | "icon";
}) {
  const { addItemToWatchlist, deleteItem, watchlists } = useWatchlist();
  const [open, setOpen] = useState(false);

  // Track checkbox states for each watchlist item by ID
  const [checkboxStates, setCheckboxStates] = useState<
    Record<string, CheckedState>
  >(() => getCheckboxStates());

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const handleCheckboxChange = (
    checked: CheckedState,
    watchlistId: string,
    mediaType: "movie" | "tv"
  ) => {
    setCheckboxStates((prevStates) => ({
      ...prevStates,
      [watchlistId]: checked,
    }));
    if (checked) {
      addItemToWatchlist(watchlistId, tmdbId, mediaType);
    } else {
      deleteItem(watchlistId, tmdbId, mediaType);
    }
  };

  function getCheckboxStates() {
    const s: Record<string, CheckedState> = {};
    watchlists.forEach((wl) => {
      const list = mediaType === "tv" ? wl.items.tvShows : wl.items.movies;
      s[wl.id] = list.some(
        (m) => (mediaType === "tv" ? m.tvId : m.movieId) === tmdbId
      );
    });
    return s;
  }
  // Sync checkbox states with watchlistsWithItem and userWatchlists whenever they change
  useEffect(() => {
    const initialStates = getCheckboxStates();
    setCheckboxStates(initialStates);
  }, [watchlists, tmdbId, mediaType]);

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <WatchlistButton variant={variant} />
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent className="bg-black p-3">
          {watchlists.map((watchlist, index) => {
            const isChecked = Boolean(checkboxStates[watchlist.id]);

            return (
              <Fragment key={index}>
                <DropdownMenuItem
                  className="flex cursor-pointer items-center space-x-2 p-2"
                  onSelect={(e) => {
                    // Prevent the default “close the menu” behavior
                    e.preventDefault();
                    // toggle
                    handleCheckboxChange(
                      isChecked ? false : true,
                      watchlist.id,
                      mediaType
                    );
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
                  <p>{watchlist.name}</p>
                </DropdownMenuItem>
                {index !== watchlists.length - 1 && <DropdownMenuSeparator />}
              </Fragment>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
type WatchlistButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: "default" | "icon";
};

export const WatchlistButton = forwardRef<
  HTMLButtonElement,
  WatchlistButtonProps
>(({ variant, ...props }, ref) => {
  // pick the CVA size: "default" or "icon"
  const size = variant === "icon" ? "icon" : "default";
  const buttonVariant = variant === "icon" ? "ghost" : "outline";
  return (
    <Button
      ref={ref}
      variant={buttonVariant}
      size={size}
      className={`${size === "icon" ? "h-6 w-6" : ""}`}
      {...props} // now onClick etc. flow to the real <button>
    >
      {variant === "default" ? (
        <>
          <BookmarkPlus size={20} />
          <span>Add to Watchlist</span>
        </>
      ) : (
        <BookmarkPlus size={20} />
      )}
    </Button>
  );
});
WatchlistButton.displayName = "WatchlistButton";
