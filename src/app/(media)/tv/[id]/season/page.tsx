import SeasonCard from "@/app/(media)/tv/_components/season-card";
import { fetchDiscoverTvIds, fetchTvDetails } from "@/app/(media)/actions";

export const revalidate = 43200; // 12 hours

export async function generateStaticParams() {
  const discoverTvIds = await fetchDiscoverTvIds();
  return discoverTvIds;
}

export default async function SeasonPage({
  params,
}: {
  params: { id: number };
}) {
  const tmdbId = params.id;
  const tv = await fetchTvDetails(tmdbId);
  return (
    <ul className="mt-6 flex flex-col items-center justify-center space-y-3 px-2">
      {tv.seasons.length > 0 &&
        tv.seasons?.map((s, index) => (
          <li key={index} className="w-full max-w-4xl">
            <SeasonCard showId={tmdbId} season={s} />
          </li>
        ))}
    </ul>
  );
}
