"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Watchlist } from "@/components/watchlist";
import { useWatchlist } from "@/context/watchlist";
import type { WatchlistWithMedia } from "@/lib/repositories/watchlist";

export default function WatchlistSection({
  initialWatchlists,
}: {
  initialWatchlists: WatchlistWithMedia[];
}) {
  const { watchlists } = useWatchlist();
  const listsToRender = watchlists.length ? watchlists : initialWatchlists;

  // 1) Early-return when empty
  if (listsToRender.length === 0) {
    return <div className="text-center">You have 0 watchlists</div>;
  }

  // 2) Build a single "tabs" array
  const tabs = [
    {
      key: "all",
      label: "All Lists",
      items: listsToRender,
    },
    ...listsToRender.map((wl) => ({
      key: wl.id,
      label: wl.name,
      items: [wl] as WatchlistWithMedia[],
    })),
  ];

  return (
    <Tabs defaultValue="all">
      <TabsList>
        {tabs.map(({ key, label }) => (
          <TabsTrigger value={key} key={key}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="relative mt-4">
        {tabs.map(({ key, items }) => (
          <TabsContent
            key={key}
            value={key}
            forceMount
            className={`absolute inset-0 space-y-3 transition-opacity duration-200 ease-in-out data-[state=active]:opacity-100 data-[state=inactive]:opacity-0`}
          >
            {items.map((wl) => (
              <Watchlist watchlist={wl} key={wl.id} />
            ))}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}
