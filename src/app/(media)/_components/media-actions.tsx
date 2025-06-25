"use client"
import { Button } from "@/components/ui/button";
import { getWatchlists } from "@/lib/actions";
import Link from "next/link";
import { Play } from "lucide-react";
import { FullMovie, FullTv, WatchlistSchemaI } from "@/types/camel-index";
import AddToWatchlistDropdown from "@/components/add-to-watchlist-button";
import { useEffect, useState } from "react";
import { getBrowserSupabase } from "@/services/supabase/client";
import { User } from "@supabase/supabase-js";

export default function MediaActions({
  tmdbId,
  data,
  rating,
  videoPath,
  mediaType
}: {
  tmdbId: number;
  data: FullMovie | FullTv;
  rating: string;
  videoPath?: string;
  mediaType: "tv" | "movie";
}) {
  const session = getBrowserSupabase();
  const [watchlists, setWatchlists] = useState<WatchlistSchemaI[] | null>(null);
  const [user, setUser] = useState<User | null>()
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      setWatchlists(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    (async () => {
      try {
        const userRes = await session.auth.getUser()
        setUser(userRes.data.user);
        if (user?.id) {
          const lists = await getWatchlists(user?.id);
          setWatchlists(lists);
        }
      } catch (error) {
        console.error("Failed to fetch watchlists:", error);
        setWatchlists([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [session]);

  // if (status === "loading") {
  //   return <div>Checking authentication…</div>;
  // }

  return (
    <div className="flex justify-center md:justify-start space-x-3">
      {videoPath !== undefined && videoPath.trim() && (
        <Link href={`${tmdbId}?show=true`}>
          <Button variant="outline" className="flex items-center space-x-2">
            <Play size={20} />
            <span>Play Trailer</span>
          </Button>
        </Link>
      )}
      {user ? (
        loading ? (
          <Button variant="secondary" disabled>
            Loading…
          </Button>
        ) : watchlists && watchlists.length > 0 ? (
          <AddToWatchlistDropdown
            userId={user.id}
            item={data}
            rating={rating ?? ""}
            mediaType="movie"
          />
        ) : (
          <Link href="/watchlists/create">
            <Button variant="secondary">Create Watchlist</Button>
          </Link>
        )
      ) : (
        <Link href="/signin">
          <Button variant="secondary">Add to Watchlist</Button>
        </Link>
      )}
    </div>
  );
}
