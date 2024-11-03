"use client";
import { WatchlistI } from "@/types";
import Link from "next/link";
import { WatchlistDropdown } from "./watchlist-dropdown";
import Image from "next/image";

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
                <div className="grid grid-cols-[1fr_75px_1fr_1fr_1fr_auto] gap-6 px-3 py-2 items-center">
                  <span className="text-gray-500">Title</span>
                  <span className="text-gray-500">Poster</span>
                  <span className="text-gray-500">Genres</span>
                  <span className="text-gray-500">Vote Avg</span>
                  <span className="text-gray-500">Popularity</span>
                </div>
                {watchlist.items.map((item, index) => (
                  <div
                    key={item.itemId}
                    className="grid grid-cols-[1fr_75px_1fr_1fr_1fr_auto] gap-6 border-secondary border p-3 rounded-xl items-center hover:border-primary/20 transition"
                  >
                    <Link
                      href={`/${item.itemType}/${item.tmdbId}`}
                      className="flex items-center"
                    >
                      <div>{item.title}</div>
                    </Link>
                    <Image
                      width={75}
                      height={75}
                      src={`https://image.tmdb.org/t/p/original/${item.posterPath}`}
                      alt={`${item.title} poster`}
                      quality={75}
                      className="object-cover w-[75px] h-[75px] rounded-[40%]"
                    />
                    <div className="flex flex-wrap gap-1">
                      {item.genres?.map((genre, genreIndex) => (
                        <span
                          key={genreIndex}
                          className="shadow-lg rounded-lg px-2 py-1 select-none transition border bg-primary-foreground border-secondary"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                    <div className="ml-7">
                      {(item.tmdbVoteAverage * 10).toFixed(0)}%
                    </div>
                    <div className="ml-7">
                      {(item.popularity * 10).toFixed(0)}
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
