"use client";
import { Button } from "@/components/ui/button";
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
import { Plus, PlusSquare, PlusSquareIcon } from "lucide-react";

export default function CreateWatchlist() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button variant="default" size={"sm"}>
            <PlusSquareIcon /> Create Watchlist
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Watchlist</DialogTitle>
            <DialogDescription>Enter a name and description</DialogDescription>
          </DialogHeader>
          <WatchlistForm
            onSaved={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </form>
    </Dialog>
  );
}
