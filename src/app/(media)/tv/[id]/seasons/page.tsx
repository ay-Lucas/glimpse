import SeasonCard from "@/app/(media)/_components/season-card";
import { getFullTv, getTvDetails } from "@/app/(media)/actions";
import { BASE_ORIGINAL_IMAGE_URL } from "@/lib/constants";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Vibrant } from "node-vibrant/node";

export default async function Seasons({ params }: { params: { id: number } }) {

  const tv = await getFullTv(params.id) ?? await getTvDetails({ id: params.id });

  const formattedFirstAirDate = tv.firstAirDate
    ? new Intl.DateTimeFormat("en-US", {
      year: "numeric",
    }).format(new Date(tv.firstAirDate))
    : null;

  const backdrop = `${BASE_ORIGINAL_IMAGE_URL}${tv.backdropPath}`

  const palette = backdrop
    ? await Vibrant.from(backdrop).getPalette()
    : null;

  const primaryHex = palette?.Vibrant?.hex
    ?? palette?.Muted?.hex
    ?? '#000';
  console.log(primaryHex)

  const rgb = palette?.DarkVibrant?.rgb;
  const overlay = `rgba(${rgb?.[0]}, ${rgb?.[1]}, ${rgb?.[2]}, 0.9)`;  // 50% opacity
  //
  // const seasonPromises = Array.from(
  //   { length: tv.numberOfSeasons! },
  //   (_, index) => getSeasonData(params.id, index + 1)
  // );
  // const episodesData: TvSeasonResponse[] = await Promise.all(seasonPromises);
  // console.log(episodesData)
  return (
    <main className="pt-3">
      <div className={`w-screen flex justify-center items-center py-2 shadow-md`}
        style={{ backgroundColor: overlay }}
      >
        <div className="">
          <h1 className="text-3xl font-semibold text-white">{tv.name} ({formattedFirstAirDate})</h1>
          <Link className="flex items-center hover:text-gray-400  -ml-1 w-fit" href={`/tv/${params.id}`}><ChevronLeft size={24} /><h2 className="text-lg font-semibold">Back to main</h2></Link>
        </div>
      </div>
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
