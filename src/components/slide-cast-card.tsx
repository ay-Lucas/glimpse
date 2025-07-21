import { Cast, GuestStar } from "@/types/request-types-camelcase";
import { SlideImageCard } from "./slide-image-card";
import Link from "next/link";

export function SlideCastCard({ cast }: { cast: Cast | GuestStar }) {
  return (
    <Link href={`/person/${cast.id}`}>
      <SlideImageCard
        key={cast.id}
        unoptimized={true}
        baseUrl="/tmdb/t/p/w342"
        imagePath={cast.profilePath ?? null}
        alt={`poster of ${cast.name}`}
        aspectClass="aspect-[2/3]"
      />
      <div className="mt-2 pb-4 text-start">
        <p className="text-sm font-semibold">{cast.name}</p>
        {cast.character && cast.character?.length > 0 && (
          <p className="text-sm text-gray-400">as {cast.character}</p>
        )}
      </div>
    </Link>
  );
}
