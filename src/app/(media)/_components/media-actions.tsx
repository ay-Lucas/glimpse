"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Play } from "lucide-react";
import { MovieResult, TvResult } from "@/types/request-types-camelcase";
import WatchlistDropdown from "./watchlist-dropdown";

interface Props {
  tmdbId: number;
  data: TvResult | MovieResult | null;
  videoPath?: string;
  mediaType: "tv" | "movie";
  variant?: "default" | "icon";
}

export default function MediaActions({
  tmdbId,
  data,
  videoPath,
  mediaType,
  variant = "default",
}: Props) {
  const canPlay = Boolean(videoPath?.trim());
  return (
    <div className="flex justify-center space-x-3 md:justify-start">
      {canPlay && (
        <Link href={`${tmdbId}?show=true`} passHref>
          <Button variant="outline" className="flex items-center space-x-2">
            <Play size={20} />
            <span>Play Trailer</span>
          </Button>
        </Link>
      )}
      <WatchlistDropdown
        data={data}
        mediaType={mediaType}
        tmdbId={tmdbId}
        variant={variant}
      />
    </div>
  );
}
