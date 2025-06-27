import MediaBanner from "@/app/(media)/_components/media-banner";
import { fetchMovieDetails, fetchTvDetails } from "@/app/(media)/actions";
import { bannerColor } from "@/lib/bannerColor";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Fragment } from "react";
import { Cast, Crew } from "@/types/request-types-camelcase";
import Image from "next/image";
import Link from "next/link";
import { BASE_SMALL_BACKDROP_URL } from "@/lib/constants";

export default async function CreditsPage({
  mediaType,
  id,
}: {
  mediaType: "movie" | "tv";
  id: string;
}) {
  const tmdbId = Number(id)
  const data =
    mediaType === "movie"
      ? await fetchMovieDetails(tmdbId)
      : await fetchTvDetails(tmdbId);
  const backdropPath = data.backdropPath ?? "";
  const darkVibrantBackdropHex = (data as any).darkVibrantBackdropHex ?? "";

  const color = await bannerColor(
    backdropPath,
    darkVibrantBackdropHex
  );

  if (!data.credits)
    throw new Error("fetchTvDetails returned undefined");

  const { cast, crew } = data.credits;
  const title = (data as any).title || (data as any).name;
  const releaseDate = (data as any).releaseDate || (data as any).firstAirDate;


  // console.log("Seasons page rendered!")
  const sortedCast = cast
    ?.filter((c): c is Required<Pick<Cast, "id" | "name" | "character" | "profilePath" | "order">> =>
      c.id != null && !!c.name && !!c.character && !!c.profilePath && !!c.order
    )
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))


  // 2) Group crew by department
  const crewByDept =
    crew
      ?.filter((m): m is Required<Pick<Crew, "department" | "job" | "id" | "name">> =>
        !!m.department && !!m.job && !!m.id && !!m.name
      )
      .reduce<Record<string, Crew[]>>((acc, member) => {
        acc[member.department] = acc[member.department] || []
        acc[member.department]?.push(member)
        return acc
      }, {})

  return (
    <main className="pt-3">
      <MediaBanner name={title} firstAirDate={releaseDate} id={tmdbId} color={color} mediaType={mediaType} />
      <div className="container h-full pt-3">
        {(cast || crew) && (
          <Tabs defaultValue="cast" className="bg-background/60 rounded-md backdrop-blur-md min-h-screen p-3">
            <TabsList className="py-7 px-2">
              <TabsTrigger value="cast" className="text-xl font-bold">Cast</TabsTrigger>
              <TabsTrigger value="crew" className="text-xl font-bold">Crew</TabsTrigger>
            </TabsList>
            <TabsContent value="cast">
              <div>
                {/* <h2 className="text-2xl font-bold mb-4">Cast</h2> */}
                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {sortedCast?.map((c) => (
                    <li key={c.id} className="space-y-2">
                      {c.profilePath ? (
                        <Link href={`/person/${c.id}`}>
                          <Image
                            src={`${BASE_SMALL_BACKDROP_URL}${c.profilePath}`}
                            alt={c.name}
                            width={185}
                            height={278}
                            className="rounded-md object-cover"
                          />
                        </Link>
                      ) : (
                        <div className="w-full h-[278px] bg-gray-700 rounded-md" />
                      )}
                      <p className="font-semibold truncate">{c.name}</p>
                      <p className="text-sm text-gray-400 truncate">
                        as {c.character}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="crew">
              {crewByDept && (
                Object.entries(crewByDept).map(([dept, members]) => (
                  <Fragment key={dept}>
                    <h3 className="text-xl font-semibold mt-6 mb-2">{dept}</h3>
                    <table className="w-full table-fixed mb-6">
                      <colgroup>
                        <col className="w-1/2" />
                        <col className="w-1/2" />
                      </colgroup>
                      <thead>
                        <tr className="text-left text-gray-400 uppercase text-xs">
                          <th className="py-2">Name</th>
                          <th className="py-2">Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((m) => (
                          <tr key={m.id} className="border-t hover:bg-muted/50">
                            <td className="py-2 text-blue-400 ">
                              <Link href={`/person/${m.id}`} key={m.id} className="hover:underline">
                                {m.name}
                              </Link>
                            </td>
                            <td className="py-2">{m.job}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Fragment>
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </main>
  )
}
