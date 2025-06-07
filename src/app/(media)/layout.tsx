import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { WatchlistProvider } from "@/context/watchlist";

export default async function Layout({ children }: { children: ReactNode }) {

  return (
    <SessionProvider>
      <WatchlistProvider>
        <div className="min-h-screen">{children}</div>
      </WatchlistProvider>
    </SessionProvider>
  );
}
