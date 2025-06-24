import { ReactNode } from "react";
import Background from "./_components/background";
import { getBackdrops } from "./_components/backdrops";
import { WatchlistProvider } from "@/context/watchlist";
import { getBlurData } from "@/lib/blur-data-generator";

export default async function Layout({ children }: { children: ReactNode }) {
  const backdrops = await getBackdrops();
  const firstBackdrop = backdrops.at(0);

  return (
    <WatchlistProvider>
      <main className="min-h-screen">
        <div className="absolute flex left-0 top-0 h-full w-full items-center justify-center">
          {backdrops && firstBackdrop && (
            <Background
              images={backdrops}
              firstBackdropBlurData={await getBlurData(firstBackdrop)}
            />
          )}
          {children}
        </div>
      </main>
    </WatchlistProvider>
  );
}
