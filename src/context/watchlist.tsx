"use client";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { deleteWatchlistItem, getWatchlistsAndItems } from "@/lib/actions";
import { WatchlistI } from "@/types";
import { useSession } from "next-auth/react";

interface WatchlistContextType {
  watchlists: WatchlistI[];
  deleteItem: (
    watchlistId: string,
    watchlistItemId: string,
    userId: string,
  ) => Promise<void>;
  fetchWatchlists: () => Promise<void>;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(
  undefined,
);

export const WatchlistProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [watchlists, setWatchlists] = useState<WatchlistI[]>([]);

  const fetchWatchlists = async () => {
    const watchlist: WatchlistI[] = await getWatchlistsAndItems(
      session?.user.id!,
    );
    setWatchlists([...watchlist]);
    console.log("updated watchlists: ", watchlist);
  };
  // Render on mount and on user signin / login
  useEffect(() => {
    if (session?.user.id) fetchWatchlists();
  }, [session?.user.id]);

  const deleteItem = async (watchlistId: string, watchlistItemId: string) => {
    await deleteWatchlistItem(watchlistId, watchlistItemId);
    await fetchWatchlists();
  };

  return (
    <WatchlistContext.Provider
      value={{ watchlists, deleteItem, fetchWatchlists }}
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
