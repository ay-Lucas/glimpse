"use client"
import { Button } from "@/components/ui/button";
import { getWatchlists } from "@/lib/actions";
import Link from "next/link";
import { Play } from "lucide-react";
import { FullMovie, FullTv, WatchlistSchemaI } from "@/types/camel-index";
import { useSession } from "next-auth/react";
import AddToWatchlistDropdown from "@/components/add-to-watchlist-button";
import { useEffect, useState } from "react";

export default function MediaActions({
  tmdbId,
  data,
  rating,
  videoPath,
}: {
  tmdbId: number;
  data: FullMovie | FullTv;
  rating: string;
  videoPath?: string;
}) {
  const { data: session, status } = useSession({ required: false });
  const [watchlists, setWatchlists] = useState<WatchlistSchemaI[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!session?.user?.id) {
      setWatchlists(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    (async () => {
      try {
        const lists = await getWatchlists(session.user.id);
        setWatchlists(lists);
      } catch (error) {
        console.error("Failed to fetch watchlists:", error);
        setWatchlists([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [session]);

  if (status === "loading") {
    return <div>Checking authentication…</div>;
  }

  const isLoggedIn = Boolean(session?.user?.id);

  return (
    <div className="flex justify-center md:justify-start space-x-3">
      {videoPath !== undefined && videoPath.trim() && (
        <Link href={`/movie/${tmdbId}?show=true`}>
          <Button variant="outline" className="flex items-center space-x-2">
            <Play size={20} />
            <span>Play Trailer</span>
          </Button>
        </Link>
      )}
      {isLoggedIn ? (
        loading ? (
          <Button variant="secondary" disabled>
            Loading…
          </Button>
        ) : watchlists && watchlists.length > 0 ? (
          <AddToWatchlistDropdown
            userId={session?.user.id!}
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
