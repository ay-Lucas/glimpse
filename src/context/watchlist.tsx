"use client";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { deleteWatchlist, deleteWatchlistItem } from "@/lib/actions";
import { useSupabase } from "./supabase";
import { addWatchlistItemAndUpsertMedia } from "@/lib/repositories/service";
import {
  WatchlistWithMedia,
  getWatchlistsWithMedia,
} from "@/lib/repositories/watchlist";

interface WatchlistContextType {
  watchlists: WatchlistWithMedia[];
  deleteItem: (
    watchlistId: string,
    tmdbId: number,
    mediaType: "tv" | "movie"
  ) => Promise<void>;
  fetchWatchlists: () => Promise<void>;
  onDeleteWatchlist: (watchlistId: string) => Promise<void>;
  addItemToWatchlist: (
    watchlistId: string,
    tmdbId: number,
    mediaType: "tv" | "movie"
  ) => Promise<boolean>;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(
  undefined
);

export const WatchlistProvider = ({ children }: { children: ReactNode }) => {
  const { session } = useSupabase();
  const [watchlists, setWatchlists] = useState<WatchlistWithMedia[]>([]);

  const fetchWatchlists = async () => {
    const data = (await getWatchlistsWithMedia()) ?? [];
    setWatchlists(data);
  };
  // Render on mount and on user signin / login
  useEffect(() => {
    if (session?.user.id) fetchWatchlists();
  }, [session?.user.id]);

  const deleteItem = async (
    watchlistId: string,
    tmdbId: number,
    mediaType: "tv" | "movie"
  ) => {
    await deleteWatchlistItem({ watchlistId, mediaType, tmdbId });
    await fetchWatchlists();
  };

  // const addWatchlist = async () => {
  //   const res = await createWatchlist(session?.user.id!, "Empty");
  //   if (res) {
  //     fetchWatchlists();
  //   }
  // };

  const onDeleteWatchlist = async (watchlistId: string) => {
    const res = await deleteWatchlist(session!.user.id, watchlistId);
    if (res) {
      const updatedWatchlists = watchlists.filter(
        (item) => item.id !== watchlistId
      );
      setWatchlists(updatedWatchlists);
    }
  };
  const addItemToWatchlist = async (
    watchlistId: string,
    tmdbId: number,
    mediaType: "tv" | "movie"
  ) => {
    const item = await addWatchlistItemAndUpsertMedia(
      watchlistId,
      mediaType,
      tmdbId
    );
    fetchWatchlists();
    return item !== undefined;
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlists,
        deleteItem,
        fetchWatchlists,
        onDeleteWatchlist,
        addItemToWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
};
