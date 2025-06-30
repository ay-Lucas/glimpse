import { fetchTopPeopleIds, fetchPersonDetails } from "@/app/(media)/actions";
import {
  BASE_POSTER_IMAGE_URL,
  DEFAULT_BLUR_DATA_URL,
  TMDB_GENDERS,
} from "@/lib/constants";
import { PersonDetails } from "@/components/person-details";
import Image from "next/image";
import Link from "next/link";
import { getTrendingPages } from "@/app/discover/actions";
import { PersonCombinedCreditsResponse, PersonResult, TvResult, MovieResult } from "@/types/request-types-camelcase";
import ImageCarousel from "@/components/image-carousel";
import { Card } from "@/components/card";
import { getPersonPopularityStats, getPersonRank } from "@/app/(media)/actions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HiQuestionMarkCircle } from "react-icons/hi";

export const revalidate = 43200; // 12 hours

//TODO: SSG all actors on discover page
export async function generateStaticParams() {
  if (process.env.IS_LOCALHOST === "true") {
    return []
  }
  return await fetchTopPeopleIds()
}

function getTopPopularCredits(limit: number, credits: PersonCombinedCreditsResponse) {
  const prominent = credits.cast?.filter(c => {
    if (c.mediaType === 'movie') {
      // order is TMDB’s cast index: 0 is the lead, 1–7 are your co-stars, 8+ tends to be day players & cameos
      return (typeof c.order === 'number' && c.order < 5);
    }

    if (c.mediaType === 'tv') {
      return (
        (typeof c.order === 'number' && c.order < 5)
        || (typeof (c as any).episodeCount === 'number' && (c as any).episodeCount >= 10)
      );
    }

    return false;
  });
  const sorted = prominent?.sort((a, b) => {
    // primary: billing order (lower = more starred)
    const oa = typeof a.order === 'number' ? a.order : Infinity;
    const ob = typeof b.order === 'number' ? b.order : Infinity;
    if (oa !== ob) return oa - ob;
    // secondary: popularity (higher first)
    return (b.popularity ?? 0) - (a.popularity ?? 0);
  });

  return sorted?.slice(0, limit);
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
  console.log(top10PopularCredits)
  const knownForCredits = top10PopularCredits && top10PopularCredits.length > 3 ? top10PopularCredits : uniqueCombinedCredits.values().toArray();
  const rank = await getPersonRank(person.popularity ?? 0);
  const total = (await getPersonPopularityStats()).sortedScores.length;
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
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex space-x-3 items-center">
                      <div className="text-lg font-bold text-gray-400 flex space-x-1 items-center">
                        <HiQuestionMarkCircle size={17} />
                        <p className="pr-2">Rank</p>
                        <p className="text-white">
                          {rank && rank <= total ? `#${rank} of ${total}` : `> ${total}`}
                        </p>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent><p>{rank ? `Out of the ${total} most popular actors, ${person.name} ranks ${rank}` : `${person.name} does not rank within the top ${total}`}</p>
                  </TooltipContent>
                </Tooltip>
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
