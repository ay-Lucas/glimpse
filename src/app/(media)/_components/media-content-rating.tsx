"use client";
import { Fragment, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { useContentRating } from "@/context/content-rating";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UniqueRegionContentRating } from "@/lib/contentRating";
import { countryCodeToEnglishName } from "@/lib/utils";
import { FlagIcon } from "./flag-icon";

interface MediaContentProps {
  region?: string;
  rating: string[];
  descriptors?: String[];
  text?: "sm" | "md";
  numColumns: number;
}

export function MediaContentRating({
  rating,
  region,
  descriptors,
  numColumns,
  text = "sm",
}: MediaContentProps) {
  const descriptorsLabel = descriptors?.join(", ");
  const fontSize = text === "sm" ? "text-sm" : "text-md";
  const fullRegionName = region ? countryCodeToEnglishName(region) : null;
  return (
    <>
      {region && (
        <div className={`${fontSize} flex items-center gap-3`}>
          <FlagIcon
            code={region}
            className="h-6 w-9"
            aria-label={fullRegionName || region}
          />
          {fullRegionName}
        </div>
      )}
      <div className="flex flex-wrap gap-1">
        {rating.map((r, index) => (
          <Badge
            variant={`${index % 2 === 0 ? "default" : "secondary"}`}
            className={fontSize}
            key={index}
          >
            {r}
          </Badge>
        ))}
      </div>
      {descriptors && descriptors?.length > 0 ? (
        <div className={fontSize}>{descriptorsLabel}</div>
      ) : numColumns === 3 ? (
        <div></div>
      ) : (
        <></>
      )}
    </>
  );
}

export function LocalMediaContentRatingModal() {
  const { contentRating } = useContentRating();
  if (!contentRating) return <Badge variant="default">NR</Badge>;
  const { rating } = contentRating;

  return (
    <AllContentRatingsModal>
      <div className="flex flex-wrap justify-start gap-1">
        <MediaContentRating rating={[rating]} numColumns={2} />
        <button>
          <Badge variant={"secondary"} className="hover:text-gray-400">
            <span className="text-md flex items-center">
              All
              <span className="w-4">
                <ChevronRight size={23} />
              </span>
            </span>
          </Badge>
        </button>
      </div>
    </AllContentRatingsModal>
  );
}

export function ContentRatingList() {
  const { allRatings } = useContentRating();
  const regionMap = new Map<string, UniqueRegionContentRating>();
  allRatings.forEach((r) => {
    const regionContentRatings = regionMap.get(r.region);
    const isDuplicate = regionContentRatings?.rating.includes(r.rating);
    const ratingsArray =
      regionContentRatings && !isDuplicate
        ? [...regionContentRatings.rating, r.rating]
        : [r.rating];

    const uniqueRegion: UniqueRegionContentRating = {
      countryCode: r.region,
      country: countryCodeToEnglishName(r.region),
      rating: ratingsArray,
      descriptors: r.descriptors,
    };
    regionMap.set(r.region, uniqueRegion);
  });
  const uniqueRegionRatings = Array.from(regionMap.values()).sort((a, b) =>
    a.country.localeCompare(b.country)
  );

  const anyRatingHasDesc = allRatings.some(
    (rating) => rating.descriptors.length > 0
  );
  const numColumns = anyRatingHasDesc ? 3 : 2;
  console.log(allRatings);
  return (
    <div className="grid gap-3">
      <div
        className={`grid ${anyRatingHasDesc ? "grid-cols-[minmax(150px,1fr)_minmax(75px,1fr)_minmax(100px,1fr)]" : "grid-cols-[1fr_1fr]"} gap-3`}
      >
        <div className="text-md font-bold">Country</div>
        <div className="text-md font-bold">Rating</div>
        {anyRatingHasDesc && (
          <div className="text-md font-bold">Descriptors</div>
        )}
      </div>
      {uniqueRegionRatings.map((contentRating, index) => {
        const { rating, countryCode: region, descriptors } = contentRating;
        return (
          <Fragment key={contentRating.countryCode}>
            <div
              className={`grid ${anyRatingHasDesc ? "grid-cols-[minmax(150px,1fr)_minmax(75px,1fr)_minmax(100px,1fr)]" : "grid-cols-[1fr_1fr]"} gap-3`}
            >
              <MediaContentRating
                rating={rating}
                region={region}
                descriptors={descriptors}
                text="md"
                numColumns={numColumns}
                key={index}
              />
            </div>
            {index !== uniqueRegionRatings.length - 1 && (
              <div className="border-b border-r-gray-500"></div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

export function AllContentRatingsModal({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>{children}</div>
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] max-w-[99vw] justify-center overflow-y-auto overflow-x-hidden rounded-xl md:max-w-[500x] lg:w-fit">
        <DialogHeader className="pt-3">
          <DialogTitle>All Content Ratings By Country</DialogTitle>
        </DialogHeader>
        <ContentRatingList />
      </DialogContent>
    </Dialog>
  );
}
