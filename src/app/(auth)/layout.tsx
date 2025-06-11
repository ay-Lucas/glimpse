import { ReactNode } from "react";
import SessionProvider from "@/components/session-provider";
import { auth } from "@/auth";
import Background from "./_components/background";
import { getBackdrops } from "./_components/backdrops";
import { WatchlistProvider } from "@/context/watchlist";
import { getBlurData } from "@/lib/blur-data-generator";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();
  const backdrops = await getBackdrops();
  const firstBackdrop = backdrops.at(0);

  return (
    <SessionProvider session={session}>
      <WatchlistProvider>
        <main className="min-h-screen">
          <div className="absolute flex left-0 top-0 h-full w-full items-center">
            {backdrops && firstBackdrop && (
              <Background
                images={backdrops}
                firstBackdropBlurData={await getBlurData(firstBackdrop)}
              />
            )}
            <div className="container items-center">
              <div>{children}</div>
            </div>
          </div>
        </main>
      </WatchlistProvider>
    </SessionProvider>
  );
}
