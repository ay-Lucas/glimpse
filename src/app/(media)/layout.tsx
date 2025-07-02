import { ReactNode } from "react";
import { WatchlistProvider } from "@/context/watchlist";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <WatchlistProvider>
      <TooltipProvider>
        <div className="min-h-screen">{children}</div>
      </TooltipProvider>
    </WatchlistProvider>
  );
}
