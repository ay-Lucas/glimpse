"use client";
import { Watchlist } from "@/components/watchlist";
import { useWatchlist } from "@/context/watchlist";
import { WatchlistWithMedia } from "@/lib/repositories/watchlist";

export default function WatchlistSection({
  initialWatchlists,
}: {
  initialWatchlists: WatchlistWithMedia[];
}) {
  const { watchlists } = useWatchlist();
  const listsToRender = watchlists.length > 0 ? watchlists : initialWatchlists;
  return (
    <>
      {listsToRender.length > 0 ? (
        listsToRender.map((watchlist) => (
          <Watchlist watchlist={watchlist} key={watchlist.id} />
        ))
      ) : (
        <div className="text-center">You have 0 watchlists</div>
      )}
    </>
  );
}
