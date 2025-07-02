import { fetchTopPeopleIds, fetchPersonDetails } from "@/app/(media)/actions";
import {
  BASE_ORIGINAL_IMAGE_URL,
  BASE_POSTER_IMAGE_URL,
  BASE_PROFILE_IMAGE_URL,
  DEFAULT_BLUR_DATA_URL,
  TMDB_GENDERS,
} from "@/lib/constants";
import { PersonDetails } from "@/components/person-details";
import Image from "next/image";
import Link from "next/link";
import { TvResult, MovieResult } from "@/types/request-types-camelcase";
import ImageCarousel from "@/components/image-carousel";
import { Card } from "@/components/card";
import { getTopPopularCredits } from "./utils";
import PersonRank from "./_components/person-rank";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PersonLinks from "./_components/person-links";

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
  const top10PopularCredits = getTopPopularCredits(10, person.combinedCredits);
  const knownForCredits =
    top10PopularCredits && top10PopularCredits.length > 3
      ? top10PopularCredits
      : uniqueCombinedCredits.values().toArray();
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
              <PersonLinks
                externalIds={person.externalIds}
                tmdbId={person.id}
              />
            )}
            {person.taggedImages.results?.length ? (
              <section className="media-card">
                <ImageCarousel
                  breakpoints="taggedImages"
                  title={
                    <h2 className={`text-2xl font-bold`}>Tagged Images</h2>
                  }
                  loading="lazy"
                  items={(person.taggedImages.results ?? []).map((item) => {
                    const mediaType = item.media?.mediaType;
                    const isTv =
                      mediaType === "tv" || mediaType === "tv_episode";

                    return (
                      <div key={item.id ?? item.filePath}>
                        <Image
                          src={`${BASE_ORIGINAL_IMAGE_URL}${item.filePath}`}
                          width={300}
                          height={240}
                          alt={`tagged image of ${person.name}`}
                          className="rounded-lg"
                          unoptimized
                        />

                        {isTv && (
                          <div className="mt-2">
                            <p className="flex w-full items-center gap-x-5">
                              <span>{(item.media as any).name}</span>
                              {mediaType === "tv_episode" && (
                                <span className="font-semibold">
                                  S{item.media!.seasonNumber} E
                                  {item.media!.episodeNumber}
                                </span>
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                />
              </section>
            ) : (
              ""
            )}
            {person.images.profiles?.length ? (
              <section className="media-card">
                <ImageCarousel
                  breakpoints="page"
                  title={<h2 className={`text-2xl font-bold`}>Images</h2>}
                  loading="lazy"
                  items={person.images.profiles?.map((item, index) => (
                    <Image
                      src={`${BASE_PROFILE_IMAGE_URL}${item.filePath}`}
                      width={228}
                      height={342}
                      alt={`tagged image of ${person.name}`}
                      unoptimized
                      className="rounded-lg"
                      key={index}
                    />
                  ))}
                />
              </section>
            ) : (
              <div />
            )}
            {knownForCredits.length > 0 && (
              <div className="media-card">
                <ImageCarousel
                  breakpoints="page"
                  title={<h2 className={`text-2xl font-bold`}>Known For</h2>}
                  loading="lazy"
                  items={
                    knownForCredits.map(
                      (item): JSX.Element => (
                        <Link
                          href={`/${item.mediaType}/${item.id}`}
                          key={item.id}
                        >
                          <Card
                            imagePath={item.posterPath ?? null}
                            baseUrl={BASE_POSTER_IMAGE_URL}
                            title={
                              (item as MovieResult).title ??
                              (item as TvResult).name
                            }
                            overview={item.overview}
                          />
                        </Link>
                      )
                    )!
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
