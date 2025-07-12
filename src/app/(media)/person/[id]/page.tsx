import { fetchTopPeopleIds, fetchPersonDetails } from "@/app/(media)/actions";
import {
  BASE_POSTER_IMAGE_URL,
  DEFAULT_BLUR_DATA_URL,
  TMDB_GENDERS,
} from "@/lib/constants";
import { PersonDetails } from "@/components/person-details";
import Image from "next/image";
import PersonRank from "./_components/person-rank";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import MediaLinks from "../../_components/media-links";
import KnownForCredits from "./_components/person-credits-carousel";
import ImagesToggleSection from "./_components/images-toggle";

export const revalidate = 43200; // 12 hours

//TODO: SSG all actors on discover page
export async function generateStaticParams() {
  if (process.env.IS_LOCALHOST === "true") {
    return [];
  }
  return await fetchTopPeopleIds();
}

export default async function PersonPage({
  params,
}: {
  params: { type: "person"; id: number };
}) {
  const person = await fetchPersonDetails(params.id);

  if (!person) throw new Error("fetchPersonDetails returned undefined");

  const gender = person.gender ? TMDB_GENDERS.get(person.gender) : null;
  const mixedCombinedCredits = [
    ...(person.combinedCredits.cast ?? []),
    ...(person.combinedCredits.crew ?? []),
  ];
  const uniqueCombinedCredits = new Set(
    mixedCombinedCredits.filter(
      (item) => typeof item.id === "number" && item.id > 0
    )
  );
  const showIdsAndTitles = person.combinedCredits.cast?.map((item) => {
    return { id: item.id, title: (item as any).name || (item as any).title };
  });
  const showIdMap = new Map<number, string>(
    showIdsAndTitles?.map((c) => [c.id, c.title])
  );
  return (
    <main>
      <div className="h-full w-full overflow-x-hidden pb-20">
        <div className="fixed left-0 top-0 z-0 h-full w-full items-center justify-center bg-gradient-to-t from-background via-background to-gray-800" />
        <div className="h-[6vh] md:h-[10vh]"></div>
        <div className="relative items-end px-3 pt-16 md:container">
          <div className="items-end space-y-5 px-0 pb-5 md:pt-0 lg:px-40">
            <section className="media-card grid grid-cols-1 items-start gap-5 md:grid-cols-[238px,1fr]">
              {person.profilePath ? (
                <figure className="w-full">
                  <Image
                    quality={60}
                    width={238}
                    height={357}
                    src={`${BASE_POSTER_IMAGE_URL}${person.profilePath}`}
                    className="h-full w-full rounded-lg object-cover"
                    priority
                    placeholder="blur"
                    blurDataURL={DEFAULT_BLUR_DATA_URL}
                    alt={`${person.name} poster`}
                    loading="eager"
                  />
                </figure>
              ) : (
                <div className="h-[357px] w-[238px]"></div>
              )}
              <div className="space-y-4">
                <div>
                  <h1 className="text-center text-3xl font-bold md:text-left md:text-5xl">
                    {person.name}
                  </h1>
                </div>
                {person.name && (
                  <Suspense
                    fallback={<Skeleton className="h-[28px] w-[204px]" />}
                  >
                    <PersonRank
                      name={person.name}
                      popularity={person.popularity}
                    />
                  </Suspense>
                )}
                <PersonDetails
                  name={person.name}
                  biography={person.biography}
                  birthDate={person.birthday}
                  deathDay={person.deathday}
                  popularity={person.popularity}
                  placeOfBirth={person.placeOfBirth}
                  knownForDept={person.knownForDepartment}
                  gender={gender ?? null}
                  knownCredits={uniqueCombinedCredits.size}
                />
              </div>
            </section>
            {person.externalIds && person.id && (
              <MediaLinks
                externalIds={person.externalIds}
                tmdbId={person.id}
                mediaType="person"
              />
            )}
            <ImagesToggleSection
              personName={person.name ?? ""}
              profileImages={person.images.profiles ?? []}
              taggedImages={person.taggedImages.results ?? []}
              showIdMap={showIdMap}
            />
            <KnownForCredits credits={person.combinedCredits} />
          </div>
        </div>
      </div>
    </main>
  );
}
