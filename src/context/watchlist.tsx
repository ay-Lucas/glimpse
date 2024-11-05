"use client";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import {
  createWatchlist,
  deleteWatchlist,
  deleteWatchlistItem,
  getWatchlistsAndItems,
} from "@/lib/actions";
import { WatchlistI, WatchlistItemI } from "@/types";
import { useSession } from "next-auth/react";

interface WatchlistContextType {
  watchlists: WatchlistI[];
  deleteItem: (
    watchlistId: string,
    watchlistItemId: string,
    userId: string,
  ) => Promise<void>;
  fetchWatchlists: () => Promise<void>;
  addWatchlist: () => Promise<void>;
  onDeleteWatchlist: (watchlistId: string) => Promise<void>;
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
  };
  // Render on mount and on user signin / login
  useEffect(() => {
    if (session?.user.id) fetchWatchlists();
  }, [session?.user.id]);

  const deleteItem = async (watchlistId: string, watchlistItemId: string) => {
    await deleteWatchlistItem(watchlistId, watchlistItemId);
    await fetchWatchlists();
  };

  const addWatchlist = async () => {
    const res = await createWatchlist(session?.user.id!, "Empty");
    if (res) {
      // watchlists.push(res as any[0]);
      // let items: WatchlistItemI[] = [];
      //
      // const newWatchlist = {
      //   ...res[0]!,
      //   items: items,
      // };
      // setWatchlists(watchlists.concat(newWatchlist));
      fetchWatchlists();
    }
  };

  const onDeleteWatchlist = async (watchlistId: string) => {
    const res = await deleteWatchlist(session!.user.id, watchlistId);
    if (res) {
      console.log(res);
      const updatedWatchlists = watchlists.filter(
        (item) => item.id !== watchlistId,
      );
      setWatchlists(updatedWatchlists);
    }
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlists,
        deleteItem,
        fetchWatchlists,
        addWatchlist,
        onDeleteWatchlist,
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
