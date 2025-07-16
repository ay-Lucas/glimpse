"use client";
import {
  RatingResponse,
  ReleaseDateResponse,
} from "@/types/request-types-camelcase";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { pickMediaContentRating } from "@/lib/contentRating";
import { InfoIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useContentRating } from "@/context/content-rating";

export default function MediaContentRating({
  contentRatings,
  mediaType,
}: {
  contentRatings: RatingResponse[] | ReleaseDateResponse[] | null;
  mediaType: "tv" | "movie";
}) {
  const { contentRating } = useContentRating();
  if (!contentRating) return <Badge variant="default">NR</Badge>;

  return (
    <div className="flex flex-wrap justify-start space-x-1">
      <Badge variant="default">{contentRating.rating}</Badge>
      <Badge variant="outline">{contentRating.region}</Badge>
      <div className="text-sm">
        {contentRating.descriptors.map((item, index) => (
          <span key={index}>{item}</span>
        ))}
      </div>
    </div>
  );
}

export function ClickOrHoverRatingDesc({
  description,
}: {
  description: string[];
}) {
  const [open, setOpen] = useState(false);
  <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <button
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        aria-label="More info"
        className="rounded p-1 hover:bg-muted"
      >
        <InfoIcon className="h-4 w-4" />
      </button>
    </PopoverTrigger>
    <PopoverContent side="top" align="start" className="w-56">
      <p className="text-sm">{description}</p>
    </PopoverContent>
  </Popover>;
}
