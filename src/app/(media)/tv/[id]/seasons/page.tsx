import MediaBanner from "@/app/(media)/_components/media-banner";
import SeasonCard from "@/app/(media)/_components/season-card";
import { fetchDiscoverTvIds, fetchTvDetails } from "@/app/(media)/actions";

export const revalidate = 43200; // 12 hours

export async function generateStaticParams() {
  const discoverTvIds = await fetchDiscoverTvIds();
  return discoverTvIds;
}

export default async function Seasons({ params }: { params: { id: number } }) {
  const tmdbId = params.id;
  const tv = await fetchTvDetails(tmdbId);
  const backdropPath = tv.backdropPath ?? "";

  const firstAirDate = tv.firstAirDate ? new Date(tv.firstAirDate) : null;

  // console.log("Seasons page rendered!")

  return (
    <main className="pt-3">
      <MediaBanner
        backdropPath={tv.backdropPath}
        name={tv.name}
        firstAirDate={firstAirDate}
        id={tv.id}
        mediaType="tv"
      />
      <ul className="mt-6 grid place-content-center space-y-3 px-2">
        {tv.seasons &&
          tv.seasons?.map((s, index) => (
            <li key={index} className="max-w-4xl">
              <SeasonCard
                episodeCount={s.episodeCount}
                id={s.id}
                name={s.name}
                overview={s.overview}
                posterPath={s.posterPath}
                seasonNumber={s.seasonNumber}
                airDate={s.airDate}
                key={s.id}
                voteAverage={s.voteAverage}
              />
            </li>
          ))}
      </ul>
    </main>
  );
}
