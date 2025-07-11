"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import WatchlistForm from "./watchlist-form";
import { useState } from "react";

export default function EditWatchlist({
  watchlistId,
  watchlistName,
  watchlistDescription,
  isDefaultWatchlist,
  isPublic,
}: {
  watchlistId: string;
  watchlistName: string;
  watchlistDescription: string;
  isDefaultWatchlist: boolean;
  isPublic: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form className="w-full">
        <DialogTrigger asChild>
          <button className="flex w-full px-2 py-1.5 focus:bg-accent">
            <h2>Edit</h2>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Watchlist</DialogTitle>
            <DialogDescription>Enter the name or description</DialogDescription>
          </DialogHeader>
          <WatchlistForm
            onSaved={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            watchlistId={watchlistId}
            initialName={watchlistName}
            initialDescription={watchlistDescription}
            initialIsPublic={isPublic}
          />
        </DialogContent>
      </form>
    </Dialog>
  );
}
