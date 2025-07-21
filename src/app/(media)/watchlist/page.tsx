export const dynamic = "force-dynamic";

import CreateWatchlist from "./_components/create-watchlist";
import WatchlistSection from "./_components/watchlist-section";
import { getWatchlistsWithMedia } from "@/lib/repositories/watchlist";

export default async function WatchlistPage() {
  const watchlists = await getWatchlistsWithMedia();

  return (
    <main>
      <div className="pt-3 md:container md:pt-10">
        <div className="flex justify-center pb-2">
          <div className="flex items-center space-x-2">
            <h1 className="text-center text-2xl font-bold">Watchlists</h1>
            <CreateWatchlist />
          </div>
        </div>
        <div className="mx-auto grid gap-6 md:pt-10">
          <WatchlistSection initialWatchlists={watchlists} />
        </div>
      </div>
    </main>
  );
}
