"use client";
import { Button } from "@/components/ui/button";
import { Watchlist } from "@/components/watchlist";
import { useWatchlist } from "@/context/watchlist";

function CreateWatchlistButton({ handleClick }: { handleClick: () => void }) {
  return (
    <Button onClick={handleClick} variant="default">
      Create Watchlist
    </Button>
  );
}

export default function WatchlistPage() {
  const { watchlists, addWatchlist } = useWatchlist();
  return (
    <main>
      <div className="pt-10 md:container">
        <div className="grid grid-cols-3 items-center">
          <h1 className="col-start-2 col-end-3 text-center text-2xl">
            Watchlists
          </h1>
          <div className="col-start-3 col-end-4 justify-self-end">
            <CreateWatchlistButton handleClick={addWatchlist} />
          </div>
        </div>
        <div className="mx-auto grid gap-6 pt-10">
          {watchlists && watchlists.length > 0 ? (
            watchlists.map((watchlist, index) => (
              <Watchlist watchlist={watchlist} key={index} />
            ))
          ) : (
            <div className="text-center">You have 0 watchlists</div>
          )}
        </div>
      </div>
    </main>
  );
}
