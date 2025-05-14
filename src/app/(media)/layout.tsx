import { ReactNode } from "react";
import SessionProvider from "@/components/session-provider";
import { auth } from "@/auth";
import { WatchlistProvider } from "@/context/watchlist";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <WatchlistProvider>{children}</WatchlistProvider>
    </SessionProvider>
  );
}
