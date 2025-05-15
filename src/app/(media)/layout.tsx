import { ReactNode } from "react";
import { auth } from "@/auth";
import dynamic from "next/dynamic";

const WatchlistProviderClient = dynamic(
  () =>
    import("@/context/watchlist").then((module) => module.WatchlistProvider),
  {
    ssr: false,
  },
);

const SessionProviderClient = dynamic(
  () => import("@/components/session-provider"),
  {
    ssr: false,
  },
);

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  return (
    <SessionProviderClient session={session}>
      <WatchlistProviderClient>{children}</WatchlistProviderClient>
    </SessionProviderClient>
  );
}
