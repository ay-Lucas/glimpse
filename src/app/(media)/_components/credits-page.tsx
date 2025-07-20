import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Cast, Crew, GuestStar } from "@/types/request-types-camelcase";
import Image from "next/image";
import Link from "next/link";
import { BASE_SMALL_BACKDROP_URL } from "@/lib/constants";

export default async function CreditsSection({
  mediaType,
  showId,
  cast,
  crew,
  title,
  releaseDate,
}: {
  mediaType: "movie" | "tv";
  showId: number;
  cast: Cast[] | GuestStar[];
  crew: Crew[];
  title: string;
  releaseDate: string | null;
}) {
  // console.log("Seasons page rendered!")
  const sortedCast = cast
    ?.filter(
      (
        c
      ): c is Required<
        Pick<Cast, "id" | "name" | "character" | "profilePath" | "order">
      > =>
        c.id != null &&
        !!c.name &&
        !!c.character &&
        !!c.profilePath &&
        !!c.order
    )
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // 2) Group crew by department
  const crewByDept = crew
    ?.filter(
      (m): m is Required<Pick<Crew, "department" | "job" | "id" | "name">> =>
        !!m.department && !!m.job && !!m.id && !!m.name
    )
    .reduce<Record<string, Crew[]>>((acc, member) => {
      acc[member.department] = acc[member.department] || [];
      acc[member.department]?.push(member);
      return acc;
    }, {});

  return (
    <div className="h-full px-1 pt-3 md:container sm:px-2">
      {(cast || crew) && (
        <Tabs
          defaultValue="cast"
          className="min-h-screen rounded-md bg-background/60 p-3 backdrop-blur-md"
        >
          <TabsList className="px-2 py-7">
            <TabsTrigger value="cast" className="text-xl font-bold">
              Cast
            </TabsTrigger>
            <TabsTrigger value="crew" className="text-xl font-bold">
              Crew
            </TabsTrigger>
          </TabsList>
          <TabsContent value="cast">
            <div>
              {/* <h2 className="text-2xl font-bold mb-4">Cast</h2> */}
              <ul className="grid grid-cols-3 gap-6 xs:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
                {sortedCast?.map((c) => (
                  <li key={`${c.creditId}`} className="space-y-0">
                    {c.profilePath ? (
                      <Link href={`/person/${c.id}`}>
                        <Image
                          src={`${BASE_SMALL_BACKDROP_URL}${c.profilePath}`}
                          alt={c.name ?? "cast"}
                          width={185}
                          height={278}
                          className="rounded-md object-cover"
                        />
                      </Link>
                    ) : (
                      <div className="h-[278px] w-full rounded-md bg-gray-700" />
                    )}
                    <p className="flex-wrap pt-1 font-semibold">{c.name}</p>
                    {c.character?.length && (
                      <p className="flex-wrap text-sm text-gray-400">
                        as {c.character}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="crew" className="">
            <div className="grid justify-center lg:grid-cols-2">
              {crewByDept &&
                Object.entries(crewByDept).map(([dept, members]) => (
                  <div
                    key={dept}
                    className="mx-auto max-w-[500px] items-center"
                  >
                    <h3 className="my-2 flex-wrap text-xl font-semibold">
                      {dept}
                    </h3>
                    <table className="mb-6 w-full table-fixed">
                      <colgroup>
                        <col className="w-1/2" />
                        <col className="w-1/2" />
                      </colgroup>
                      <thead>
                        <tr className="text-left text-xs uppercase text-gray-400">
                          <th className="py-2">Name</th>
                          <th className="py-2">Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((m) => (
                          <tr
                            key={m.creditId}
                            className="border-t hover:bg-muted/50"
                          >
                            <td className="py-1 text-blue-400">
                              <Link
                                href={`/person/${m.id}`}
                                className="hover:underline"
                              >
                                {m.name}
                              </Link>
                            </td>
                            <td className="flex-wrap py-1">{m.job}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
