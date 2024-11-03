"use client";
import { WatchlistI } from "@/types";
import Link from "next/link";
import { WatchlistDropdown } from "./watchlist-dropdown";

export function Watchlist({ watchlist }: { watchlist: WatchlistI }) {
  return (
    <div className="p-3 bg-background border-secondary border rounded-2xl backdrop-blur-3xl">
      {watchlist ? (
        <>
          {watchlist.items.length > 0 ? (
            <div className="w-full p-3">
              <h2 className="text-2xl text-center border-secondary">
                {watchlist.watchlistName}
              </h2>
              <div className="grid space-y-2">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-3 py-2 items-center justify-items-start">
                  <div className="col-span-1">
                    <span className="text-gray-500">Title</span>
                  </div>
                  <div className="col-span-1">
                    <span className="text-gray-500">Genres</span>
                  </div>
                  {/* <div className="col-span-1"> */}
                  {/*   <span className="text-gray-500">Rating</span> */}
                  {/* </div> */}
                </div>
                {watchlist.items.map((item) => (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 border-secondary border p-3 rounded-xl items-center justify-items-start hover:border-primary/20 transition">
                      <Link
                        href={`/${item.itemType}/${item.tmdbId}`}
                        className=""
                      >
                        <div>{item.title}</div>
                      </Link>
                      <div className="col-span-2 flex space-x-2">
                        {item.genres?.map((genre, index: number) => (
                          <ul
                            key={index}
                            className="bg-gray-700/60 shadow-lg rounded-lg px-2 py-1 select-none transition hover:bg-gray-700"
                          >
                            {genre}
                          </ul>
                        ))}
                      </div>
                      <div className="justify-self-end">
                        <WatchlistDropdown
                          watchlistId={item.watchlistId}
                          watchlistItemId={item.itemId}
                        />
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-center">(Empty)</div>
          )}
        </>
      ) : (
        <div>You have no playlists</div>
      )}
    </div>
  );
}
