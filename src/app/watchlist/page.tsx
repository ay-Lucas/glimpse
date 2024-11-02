import { auth } from "@/auth";
import { watchlist } from "@/db/schema";
import { getWatchlistsAndItems } from "@/lib/actions";
import { WatchlistI } from "@/types";
import Link from "next/link";

export default async function WatchlistPage() {
  const session = await auth();
  const watchlists = await getWatchlistsAndItems(session?.user.id!);

  return (
    <main>
      <div className="md:container pt-10">
        <h1 className="text-2xl text-center">Watchlists</h1>
        <div className="flex justify-center pt-10">
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
function Watchlist({ watchlist }: { watchlist: WatchlistI }) {
  return (
    <div className="p-3 bg-secondary/40 rounded-2xl">
      <h2 className="text-xl text-center">{watchlist.watchlistName}</h2>
      <div className="w-full py-2">
        <div className="space-y-2">
          {watchlist &&
            watchlist.items.map((item) => (
              <div
                className="bg-secondary/50 hover:bg-secondary/70 transition duration-100 p-3 rounded-xl flex flex-row justify-between items-center space-x-5"
                key={item.id}
              >
                <Link href={`/${item.itemType}/${item.tmdbId}`}>
                  <div>{item.title}</div>
                </Link>
                <div className="flex flex-wrap justify-center gap-x-1.5 gap-y-1">
                  {item.genres?.map((genre, index: number) => (
                    <ul
                      key={index}
                      className="bg-gray-700/60 shadow-lg rounded-lg px-2 py-1 select-none transition hover:bg-gray-700"
                    >
                      {genre}
                    </ul>
                  ))}
                </div>
                {/* <div>{item.genres.join(", ")}</div> */}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
function WatchlistItem() {}
