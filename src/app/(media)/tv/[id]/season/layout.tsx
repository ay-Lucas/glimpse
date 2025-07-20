import MediaBanner from "@/app/(media)/_components/media-banner";
import { fetchTvDetails, fetchSeasonData } from "@/app/(media)/actions";
import { toDateString } from "@/lib/dates";
import { ReactNode } from "react";

export default async function TvSeasonsLayout({
  params,
  children,
}: {
  params: { id: number; number: number };
  children: ReactNode;
}) {
  const seasonNumber = params.number;
  const tmdbId = params.id;
  const tv = await fetchTvDetails(tmdbId);
  const season = await fetchSeasonData(seasonNumber, seasonNumber);
  return (
    <main className="pt-3">
      <MediaBanner
        backdropPath={tv.backdropPath}
        name={tv.name}
        firstAirDate={toDateString(tv.firstAirDate)}
        id={tv.id}
        mediaType="tv"
      />
      {children}
    </main>
  );
}
