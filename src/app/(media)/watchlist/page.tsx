export const dynamic = "force-dynamic";

import CreateWatchlist from "./_components/create-watchlist";
import WatchlistSection from "./_components/watchlist-section";
import { getWatchlistsWithMedia } from "@/lib/repositories/watchlist";

export default async function WatchlistPage() {
  const watchlists = await getWatchlistsWithMedia();

  return (
    <main>
      <div className="pt-10 md:container">
        <div className="grid grid-cols-3 items-center">
          <h1 className="col-start-2 col-end-3 text-center text-2xl">
            Watchlists
          </h1>
          <div className="col-start-3 col-end-4 justify-self-end">
            <CreateWatchlist />
          </div>
        </div>
        <div className="mx-auto grid gap-6 pt-10">
          <WatchlistSection initialWatchlists={watchlists} />
        </div>
      </div>
    </main>
  );
}
