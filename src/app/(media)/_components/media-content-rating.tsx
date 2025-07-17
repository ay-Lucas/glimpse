"use client";
import { ReactNode } from "react";
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
  return (
    <>
      {region && (
        <Badge variant="outline" className={fontSize}>
          {region}
        </Badge>
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
      region: r.region,
      rating: ratingsArray,
      descriptors: r.descriptors,
    };
    regionMap.set(r.region, uniqueRegion);
  });
  const uniqueRegionRatings = Array.from(regionMap.values());
  console.log(uniqueRegionRatings);

  const anyRatingHasDesc = allRatings.some(
    (rating) => rating.descriptors.length > 0
  );
  const numColumns = anyRatingHasDesc ? 3 : 2;
  return (
    <div
      // className={`grid ${anyRatingHasDesc ? "grid-cols-3" : "grid-cols-2"} gap-3`}
      //className={`grid grid-cols-3 gap-3`}
      className={`grid ${anyRatingHasDesc ? "grid-cols-[1fr_100px_1fr]" : "grid-cols-[1fr_1fr]"} gap-3`}
    >
      <div className="text-md font-bold">Country</div>
      <div className="text-md font-bold">Rating</div>
      {anyRatingHasDesc && <div className="text-md font-bold">Descriptors</div>}
      {uniqueRegionRatings.map((contentRating, index) => {
        const { rating, region, descriptors } = contentRating;
        const fullRegionName = countryCodeToEnglishName(region);
        return (
          <MediaContentRating
            rating={rating}
            region={fullRegionName}
            descriptors={descriptors}
            text="md"
            numColumns={numColumns}
            key={index}
          />
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
      <DialogContent className="max-h-[95vh] w-fit max-w-[95vw] justify-center overflow-y-auto overflow-x-hidden rounded-xl sm:max-w-[575px]">
        <DialogHeader>
          <DialogTitle>All Content Ratings By Country</DialogTitle>
        </DialogHeader>
        <ContentRatingList />
      </DialogContent>
    </Dialog>
  );
}
