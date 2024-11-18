import { Skeleton } from "@/components/ui/skeleton";
import { Item } from "@/types";
import { Suspense } from "react";
import { getRecommendations } from "../[id]/actions";
import { Recommended } from "./recommended";

export async function RecommededSection({
  isReleased,
  item,
}: {
  isReleased: boolean;
  item: Item;
}) {
  if (!isReleased || item.media_type === "person") return null;
  const recommendations = await getRecommendations(
    item.tmdbId,
    item.media_type!,
  );
  return (
    <Suspense fallback={<Skeleton className="w-full h-[356px] rounded-xl" />}>
      <div>
        <h2 className="text-2xl font-bold -mb-9">Recommended</h2>
        <div className="pt-2 pb-4 pl-8 md:pl-3 -ml-8 md:ml-0 md:w-full w-screen">
          <Recommended
            type={item.media_type!}
            rating={item.rating!}
            data={recommendations}
            id={item.tmdbId}
          />
        </div>
      </div>
    </Suspense>
  );
}
