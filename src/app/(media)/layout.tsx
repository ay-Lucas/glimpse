import { ReactNode } from "react";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { WatchlistProvider } from "@/context/watchlist";

export const revalidate = 43200; // 12 hours
export default async function Layout({ children }: { children: ReactNode }) {

  return (
    <SessionProvider>
      <WatchlistProvider>
        <div className="min-h-screen">{children}</div>
      </WatchlistProvider>
    </SessionProvider>
  );
}
