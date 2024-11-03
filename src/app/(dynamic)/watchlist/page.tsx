"use client";
import { Watchlist } from "@/components/watchlist";
import { useWatchlist, WatchlistProvider } from "@/context/watchlist";

export default function WatchlistPage() {
  const { watchlists } = useWatchlist();

  return (
    <main>
      <div className="md:container pt-10">
        <h1 className="text-2xl text-center w-full">Watchlists</h1>
        <div className="grid mx-auto gap-6 p-4 pt-10">
          {watchlists && watchlists.length > 0 ? (
            watchlists.map((watchlist, index) => (
              <Watchlist watchlist={watchlist} key={index} />
            ))
          ) : (
            <div>No Results</div>
          )}
        </div>
      </div>
    </main>
  );
}
