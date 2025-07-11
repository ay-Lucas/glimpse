import { MovieResult, TvResult } from "@/types/request-types-camelcase";
import { BASE_POSTER_IMAGE_URL } from "@/lib/constants";
import MediaCarousel from "@/components/media-carousel";
import { SlideCard } from "@/components/slide-card";

export async function Recommended({
  recommendations,
}: {
  recommendations: Array<MovieResult | TvResult>;
}) {
  const validItems = recommendations.filter((item) => item.posterPath);

  const items = validItems.map(
    (item: MovieResult | TvResult, index: number) => {
      const title = item.mediaType === "tv" ? item.name : item.title;
      const releaseDateStr =
        item.mediaType === "tv" ? item.firstAirDate : item.releaseDate;
      const releaseDate = releaseDateStr ? new Date(releaseDateStr) : null;
      return (
        <SlideCard
          rating={null}
          alt={`poster of ${title}`}
          aspectClass="aspect-[2/3]"
          title={title}
          overview={item.overview}
          tmdbVoteAverage={item.voteAverage}
          tmdbVoteCount={item.voteCount}
          releaseDate={releaseDate}
          mediaType={item.mediaType}
          tmdbId={item.id}
          imagePath={item.posterPath}
          baseUrl={BASE_POSTER_IMAGE_URL}
          key={index}
          data={item as any} // Stupid but muh brain hurts
        />
      );
    }
  );
  return (
    <>
      {items?.length > 0 && (
        <div className="space-y-4">
          <h2 className={`text-2xl font-bold`}>Recommended</h2>
          <MediaCarousel items={items} breakpointType="poster" />
        </div>
      )}
    </>
  );
}
