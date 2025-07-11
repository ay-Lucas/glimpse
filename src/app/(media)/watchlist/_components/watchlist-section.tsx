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

  if (listsToRender.length === 0) {
    return <div className="text-center">You have 0 watchlists</div>;
  }

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
      <div className="relative grid">
        {tabs.map(({ key, items }) => (
          <TabsContent
            key={key}
            value={key}
            forceMount
            className={`space-y-3 transition-opacity duration-300 ease-in-out data-[state=inactive]:pointer-events-none data-[state=active]:pointer-events-auto data-[state=inactive]:absolute data-[state=active]:relative data-[state=inactive]:inset-0 data-[state=active]:opacity-100 data-[state=inactive]:opacity-0`}
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
