import { ReactNode } from "react";
import { WatchlistProvider } from "@/context/watchlist";

export default async function Layout({ children }: { children: ReactNode }) {

  return (
    <WatchlistProvider>
      <div className="min-h-screen">{children}</div>
    </WatchlistProvider>
  );
}
