"use client";
import { WatchlistI } from "@/types";
import Link from "next/link";
import { WatchlistDropdown } from "./watchlist-dropdown";

export function Watchlist({ watchlist }: { watchlist: WatchlistI }) {
  return (
    <div className="p-3 bg-secondary/40 rounded-2xl backdrop-blur-3xl">
      {watchlist ? (
        <>
          <h2 className="text-xl text-center">{watchlist.watchlistName}</h2>
          {watchlist.items.length > 0 ? (
            <div className="w-full p-2">
              <div className="space-y-2">
                {watchlist.items.map((item) => (
                  <div
                    className="grid grid-cols-3 justify-items-stretch bg-secondary/50 hover:bg-secondary/60 transition duration-100 p-3 rounded-xl  items-center space-x-5"
                    key={item.id}
                  >
                    <Link href={`/${item.itemType}/${item.tmdbId}`}>
                      <div>{item.title}</div>
                    </Link>
                    <div className="gap-x-1.5 gap-y-1 w-full flex flex-row">
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
