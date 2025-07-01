import { fetchTopPeopleIds, fetchPersonDetails } from "@/app/(media)/actions";
import {
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
import ImdbLogo from "@/assets/IMDB_Logo_2016.svg";
import PersonLinks from "./_components/person-links";

export const revalidate = 43200; // 12 hours

//TODO: SSG all actors on discover page
export async function generateStaticParams() {
  if (process.env.IS_LOCALHOST === "true") {
    return []
  }
  return await fetchTopPeopleIds()
}

export default async function PersonPage({
  params,
}: {
  params: { type: "person"; id: number };
}) {
  const person = await fetchPersonDetails(params.id);

  if (!person)
    throw new Error("fetchPersonDetails returned undefined");

  const gender = TMDB_GENDERS.get(person.gender ?? 0)
  const mixedCombinedCredits = [...person.combinedCredits.cast ?? [], ...person.combinedCredits.crew ?? []]
  const uniqueCombinedCredits = new Set(mixedCombinedCredits.filter(item => typeof item.id === "number" && item.id > 0));
  const top10PopularCredits = getTopPopularCredits(10, person.combinedCredits)
  const knownForCredits = top10PopularCredits && top10PopularCredits.length > 3 ? top10PopularCredits : uniqueCombinedCredits.values().toArray();
  console.log(person.externalIds)
  const imdbLogo =
    <ImdbLogo
      alt="IMDb Logo"
      width={40}
      height={40}
      className="opacity-75"
    />
  const ids = person.externalIds;
  console.log(ids)
  return (
    <main>
      <div className="h-full w-full overflow-x-hidden pb-20">
        <div className="fixed z-0 top-0 left-0 h-full w-full items-center justify-center bg-gradient-to-t from-background to-gray-800 via-background" />
        <div className="h-[6vh] md:h-[10vh]"></div>
        <div className="relative px-3 md:container items-end pt-16">
          <div className="items-end pb-5 md:pt-0 px-0 lg:px-40 space-y-5">

            <section className="grid grid-cols-1 md:grid-cols-[238px,1fr] gap-5 items-start media-card">
              {person.profilePath ? (
                <figure className="w-full">
                  <Image
                    quality={60}
                    width={238}
                    height={357}
                    src={`${BASE_POSTER_IMAGE_URL}${person.profilePath}`}
                    className="object-cover rounded-lg w-full h-full"
                    priority
                    placeholder="blur"
                    blurDataURL={DEFAULT_BLUR_DATA_URL}
                    alt={`${person.name} poster`}
                    loading="eager"
                  />
                </figure>
              ) : <div className="w-[238px] h-[357px]"></div>}
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl md:text-5xl font-bold text-center md:text-left">
                    {person.name}
                  </h1>
                </div>
                {person.name &&
                  <Suspense fallback={<Skeleton className="h-[28px] w-[204px]" />}>
                    <PersonRank name={person.name} popularity={person.popularity} />
                  </Suspense>
                }
                <PersonDetails
                  name={person.name}
                  biography={person.biography}
                  birthDate={person.birthday}
                  deathDay={person.deathday}
                  popularity={person.popularity}
                  placeOfBirth={person.placeOfBirth}
                  knownForDept={person.knownForDepartment}
                  gender={gender ?? "unknown"}
                  knownCredits={uniqueCombinedCredits.size}
                />
              </div>
            </section>
            {(person.externalIds && person.id) &&
              <PersonLinks externalIds={person.externalIds} tmdbId={person.id} />
            }
            {person.images.profiles?.length &&
              <section className="media-card">
                <ImageCarousel
                  breakpoints="page"
                  title={<h2 className={`text-2xl font-bold`}>Images</h2>}
                  loading="lazy"
                  items={
                    person.images.profiles?.map(item =>
                      <Image src={`${BASE_PROFILE_IMAGE_URL}${item.filePath}`} width={400} height={400} alt={`tagged image of ${person.name}`} />
                      // <Image src={`${BASE_PROFILE_IMAGE_URL}${item.filePath}`} width={400} height={632} alt={`tagged image of ${person.name}`} />
                    )
                  }
                />
              </section>
            }
            <div className="media-card">
              <ImageCarousel
                breakpoints="page"
                title={<h2 className={`text-2xl font-bold`}>Known For</h2>}
                loading="lazy"
                items={knownForCredits.map((item, index): JSX.Element => (
                  <Link href={`/${item.mediaType}/${item.id}`} key={item.id}>
                    <Card
                      imagePath={item.posterPath ?? null}
                      baseUrl={BASE_POSTER_IMAGE_URL}
                      title={(item as MovieResult).title ?? (item as TvResult).name}
                      overview={item.overview} />
                  </Link>
                ))!} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
