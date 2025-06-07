import SeasonBanner from "@/app/(media)/_components/season-banner";
import SeasonCard from "@/app/(media)/_components/season-card";
import { fetchDiscoverTvIds, fetchTvDetails } from "@/app/(media)/actions";
import { bannerColor } from "@/lib/bannerColor";

export const revalidate = 43200; // 12 hours
export const dynamic = "force-static"


export async function generateStaticParams() {
  const discoverTvIds = await fetchDiscoverTvIds();
  return discoverTvIds
}

export default async function Seasons({ params }: { params: { id: number } }) {
  const tmdbId = params.id
  const tv = await fetchTvDetails(tmdbId);
  const backdropPath = tv.backdropPath ?? "";
  const darkVibrantBackdropHex = tv.darkVibrantBackdropHex ?? "";

  const color = await bannerColor(
    backdropPath,
    darkVibrantBackdropHex
  );

  // console.log("Seasons page rendered!")

  return (
    <main className="pt-3">
      <SeasonBanner name={tv.name} firstAirDate={tv.firstAirDate ?? null} id={tv.tmdbId} color={color} />
      <ul className="container mt-6 space-y-3">
        {tv.seasons && (
          tv.seasons?.map((s, index) => (
            <li key={index}>
              <SeasonCard episodeCount={s.episodeCount} id={s.id} name={s.name} overview={s.overview} posterPath={s.posterPath} seasonNumber={s.seasonNumber} airDate={s.airDate} key={s.id} voteAverage={s.voteAverage} />
            </li>
          ))
        )}
      </ul>
    </main>
  )
}
