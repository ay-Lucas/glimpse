"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Play } from "lucide-react";
import { FullMovie, FullTv } from "@/types/camel-index";
import AddToWatchlistDropdown from "@/components/add-to-watchlist-button";
import { useSupabase } from "@/context/supabase";
import { useWatchlist } from "@/context/watchlist";

interface Props {
  tmdbId: number;
  data: FullMovie | FullTv;
  rating: string;
  videoPath?: string;
  mediaType: "tv" | "movie";
}

export default function MediaActions({
  tmdbId,
  data,
  rating,
  videoPath,
  mediaType,
}: Props) {
  const { session } = useSupabase();
  const user = session?.user;
  const { watchlists } = useWatchlist();

  const canPlay = Boolean(videoPath?.trim());
  const hasWatchlists = watchlists?.length > 0;

  return (
    <div className="flex justify-center md:justify-start space-x-3">
      {canPlay && (
        <Link href={`${tmdbId}?show=true`} passHref>
          <Button variant="outline" className="flex items-center space-x-2">
            <Play size={20} />
            <span>Play Trailer</span>
          </Button>
        </Link>
      )}

      {user ? (
        hasWatchlists ? (
          <AddToWatchlistDropdown
            userId={user.id}
            item={data}
            rating={rating}
            mediaType={mediaType}
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
