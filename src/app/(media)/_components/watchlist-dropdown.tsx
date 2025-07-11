"use client";

import AddToWatchlistDropdown, {
  WatchlistButton,
} from "@/components/add-to-watchlist-button";
import { useSupabase } from "@/context/supabase";
import { MovieResult, TvResult } from "@/types/request-types-camelcase";
import Link from "next/link";

export default function WatchlistDropdown({
  tmdbId,
  data,
  mediaType,
  variant = "default",
}: {
  tmdbId: number;
  data: TvResult | MovieResult | null;
  mediaType: "tv" | "movie";
  variant?: "default" | "icon";
}) {
  const { user } = useSupabase();
  return (
    <>
      {user ? (
        <AddToWatchlistDropdown
          userId={user.id}
          item={data}
          tmdbId={tmdbId}
          mediaType={mediaType}
          variant={variant}
        />
      ) : (
        <Link href="/signin">
          <WatchlistButton variant={variant} />
        </Link>
      )}
    </>
  );
}
