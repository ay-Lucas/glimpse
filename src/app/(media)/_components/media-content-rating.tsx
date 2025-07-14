import {
  MovieReleaseDatesResponse,
  ShowContentRatingResponse,
} from "@/types/request-types-camelcase";
import AdultFlag from "./adult-flag";
import { FALLBACK_REGION, pickMediaContentRating } from "@/lib/contentRating";
import LocalRating from "./local-rating";

export const dynamic = "force-dynamic";

export default function MediaContentRating({
  contentRatings,
  isAdult,
  mediaType,
}: {
  contentRatings: ShowContentRatingResponse | MovieReleaseDatesResponse | null;
  isAdult: boolean;
  mediaType: "tv" | "movie";
}) {
  const initialValue = pickMediaContentRating(
    contentRatings?.results ?? [],
    mediaType,
    FALLBACK_REGION
  );
  return (
    <div className="flex justify-start space-x-1">
      <LocalRating
        initialValue={initialValue}
        mediaType={mediaType}
        ratings={contentRatings?.results ?? null}
      />
      {isAdult && <AdultFlag isAdult={isAdult} />}
    </div>
  );
}
