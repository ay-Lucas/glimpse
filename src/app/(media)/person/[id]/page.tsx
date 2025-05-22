import { getPersonDetails } from "@/app/(media)/actions";
import { auth } from "@/auth";
import { getWatchlists } from "@/lib/actions";
import { getBlurData } from "@/lib/blur-data-generator";
import {
  BASE_ORIGINAL_IMAGE_URL,
  BASE_POSTER_IMAGE_URL,
  DEFAULT_BLUR_DATA_URL,
} from "@/lib/constants";
import { PersonDetails } from "@/components/person-details";
import Image from "next/image";

export const revalidate = 3600;
export default async function PersonPage({
  params,
}: {
  params: { type: "person"; id: number };
}) {
  const person = await getPersonDetails({ id: params.id });

  const session = await auth();
  let userWatchlists;
  if (session) {
    userWatchlists = await getWatchlists(session.user.id);
  }

  const posterBlurData = person.profile_path
    ? await getBlurData(`${BASE_ORIGINAL_IMAGE_URL}${person.profile_path}`)
    : null;

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
                {person.profile_path && (
                  <Image
                    quality={60}
                    width={190}
                    height={285}
                    src={`${BASE_POSTER_IMAGE_URL}${person.profile_path}`}
                    className={`object-cover rounded-xl md:rounded-l-xl mx-auto w-[238px] h-[357px]`}
                    priority
                    placeholder="blur"
                    blurDataURL={posterBlurData ?? DEFAULT_BLUR_DATA_URL}
                    loading="eager"
                    alt="poster image"
                  />
                )}
                <PersonDetails
                  name={person.name}
                  biography={person.biography}
                  birthDate={person.birthday}
                  deathDay={person.deathday}
                  popularity={person.popularity}
                  placeOfBirth={person.place_of_birth}
                  knownForDept={person.known_for_department}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
