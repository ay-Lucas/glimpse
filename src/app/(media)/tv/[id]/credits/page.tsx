import { fetchDiscoverTvIds, fetchTvDetails } from "@/app/(media)/actions";
import CreditsSection from "@/app/(media)/_components/credits-page";
import { toDateString } from "@/lib/dates";
import MediaBanner from "@/app/(media)/_components/media-banner";

export const revalidate = 43200; // 12 hours

export async function generateStaticParams() {
  const discoverTvIds = await fetchDiscoverTvIds();
  return discoverTvIds;
}

export default async function TvCreditsRoute({
  params: { id },
}: {
  params: { id: number };
}) {
  const tv = await fetchTvDetails(Number(id));
  const firstAirDate = toDateString(tv.firstAirDate);
  return (
    <main className="pt-3">
      <MediaBanner
        name={tv.name}
        firstAirDate={firstAirDate}
        id={Number(id)}
        backdropPath={tv.backdropPath}
        mediaType={"tv"}
      />
      <CreditsSection
        mediaType="tv"
        showId={id}
        cast={tv.credits?.cast ?? []}
        crew={tv.credits?.crew ?? []}
        releaseDate={firstAirDate}
        title={tv.name}
      />
    </main>
  );
}
