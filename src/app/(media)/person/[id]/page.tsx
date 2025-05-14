import "@/styles/globals.css";
import { getPersonData } from "@/app/(media)/actions";
import { Poster } from "../../_components/poster";
import { auth } from "@/auth";
import { getWatchlists } from "@/lib/actions";
import { getBlurData } from "@/lib/blur-data-generator";
import { BASE_IMAGE_URL } from "@/lib/constants";
import { PersonDetails } from "@/components/person-details";

export default async function PersonPage({
  params,
}: {
  params: { type: "person"; id: number };
}) {
  console.log("person");
  const data = await getPersonData({ id: params.id });

  const session = await auth();
  let userWatchlists;
  if (session) {
    userWatchlists = await getWatchlists(session.user.id);
  }

  const posterBlurData = data.profile_path
    ? await getBlurData(`${BASE_IMAGE_URL}${data.profile_path}`)
    : null;

  const info = data as any;
  return (
    <main>
      <div className="h-full w-full overflow-x-hidden">
        <div className="absolute top-0 left-0 mb-10 w-screen h-screen">
          <div className="absolute z-0 top-0 left-0 h-full w-full items-center justify-center bg-gradient-to-b from-background to-background/50 via-gray-900" />
        </div>

        <div className="h-[6vh] md:h-[25vh]"></div>
        <div className="relative px-3 md:container items-end pt-16">
          <div className="items-end pb-5 md:pt-0 px-0 lg:px-40 space-y-5">
            <div>
              <div className="flex flex-col md:flex-row h-full md:h-3/4 z-10 md:items-center md:space-x-5 pb-3">
                {data.profile_path && (
                  <Poster
                    src={`https://image.tmdb.org/t/p/original${data.profile_path}`}
                    blurDataUrl={posterBlurData?.base64 ?? ""}
                  />
                )}
                <PersonDetails
                  name={info.name}
                  biography={data.biography}
                  birthDate={data.birthday}
                  deathDay={data.deathday}
                  popularity={data.popularity}
                  placeOfBirth={data.place_of_birth}
                  knownForDept={data.known_for_department}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
