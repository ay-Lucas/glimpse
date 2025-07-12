import {
  MovieResult,
  PersonCombinedCreditsResponse,
  TvResult,
} from "@/types/request-types-camelcase";
import { getTopPopularCastCredits } from "../utils";
import MediaCarousel from "@/components/media-carousel";
import { SlideCard } from "@/components/slide-card";

export default function KnownForCredits({
  credits,
}: {
  credits: PersonCombinedCreditsResponse;
}) {
  const mixedCombinedCredits = [
    ...(credits.cast ?? []),
    ...(credits.crew ?? []),
  ];
  const uniqueCombinedCredits = new Set(
    mixedCombinedCredits.filter(
      (item) => typeof item.id === "number" && item.id > 0
    )
  );

  const seen = new Set<number>();
  const uniqueCast = credits.cast?.filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });
  const top10PopularCredits = getTopPopularCastCredits(10, uniqueCast ?? []);
  console.log(top10PopularCredits);
  const knownForCredits =
    top10PopularCredits && top10PopularCredits.length > 5
      ? top10PopularCredits
      : Array.from(uniqueCombinedCredits.values());

  if (!credits.cast?.length) return;

  return (
    <div className="media-card">
      <h2 className={`pb-3 text-2xl font-bold`}>Known For</h2>
      <MediaCarousel
        breakpointType="poster"
        items={(knownForCredits ?? []).map((item): JSX.Element => {
          const title = (item as MovieResult).title ?? (item as TvResult).name;
          const mediaType =
            item.mediaType === "movie" || item.mediaType === "tv"
              ? item.mediaType
              : "movie";
          return (
            <SlideCard
              alt={`poster of ${title}`}
              aspectClass="aspect-[2/3]"
              tmdbId={item.id}
              mediaType={mediaType}
              baseUrl="/tmdb/t/p/w500"
              imagePath={item.posterPath}
              title={title}
              unoptimized
              overview={item.overview}
              tmdbVoteAverage={item.voteAverage}
              tmdbVoteCount={item.voteCount}
            />
          );
        })}
      />
    </div>
  );
}
