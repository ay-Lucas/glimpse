import { ExpandableText } from "@/app/(media)/_components/expandable-overview";
import PersonBio from "./person-bio";
import { NUM_OF_POPULAR_PEOPLE_PAGES, TMDB_GENDERS } from "@/lib/constants";
import { getPersonPercentile, getPersonPopularityStats, getPersonRank } from "@/app/(media)/actions";

export async function PersonDetails({
  name,
  biography,
  birthDate,
  popularity,
  deathDay,
  knownForDept,
  placeOfBirth,
  paramsId,
  gender,
  knownCredits
}: {
  name?: string;
  biography?: string;
  birthDate?: string | null;
  popularity?: number;
  deathDay?: string | null;
  knownForDept?: string | null;
  placeOfBirth?: string | null;
  paramsId?: number;
  gender: string;
  knownCredits: number;
}) {
  let birthYear, deathYear, formattedDeathDate, age;
  const formattedBirthDate = new Intl.DateTimeFormat("us", {
    timeZone: "UTC",
    month: "long",
    year: "numeric",
    day: "numeric",
  }).format(new Date(birthDate!));

  if (deathDay !== null) {
    formattedDeathDate = new Intl.DateTimeFormat("us", {
      timeZone: "UTC",
      month: "long",
      year: "numeric",
      day: "numeric",
    }).format(new Date(deathDay!));
    birthYear = formattedBirthDate.split(", ")[1];
    deathYear = formattedDeathDate.split(", ")[1];
  }
  if (birthDate !== null && birthDate) {
    let miliseconds = new Date().valueOf() - new Date(birthDate).valueOf();
    let years = miliseconds / 1000 / 60 / 60 / 24 / 365;
    age = years.toString().split(".")[0];
  }
  console.log(formattedDeathDate)

  return (
    <section className="flex flex-col space-y-6">
      <div className="grid grid-cols-3 md:grid-cols-3 gap-y-6 gap-x-3 text-left">
        {formattedBirthDate && (
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase">
              Born
            </div>
            <time dateTime={formattedBirthDate} className="mt-1 block">
              {formattedBirthDate}
            </time>
          </div>
        )}
        <div>
          <div className="text-xs font-bold text-gray-400 uppercase">
            Age
          </div>
          <div>{age}</div>
        </div>
        <div>
          <div className="text-xs font-bold text-gray-400 uppercase">
            Gender
          </div>
          <div>{gender}</div>
        </div>
        <div>
          <div className="text-xs font-bold text-gray-400 uppercase">
            Place Of Birth
          </div>
          <div>{placeOfBirth ?? "unknown"}</div>
        </div>
        <div>
          <div className="text-xs font-bold text-gray-400 uppercase">
            Known For
          </div>
          <div>{knownForDept}</div>
        </div>
        <div>
          <div className="text-xs font-bold text-gray-400 uppercase">
            Known Credits
          </div>
          <div>{knownCredits}</div>
        </div>
      </div>
      {biography &&
        <div><div className="text-xs font-bold text-gray-400 uppercase">Biography</div>
          <ExpandableText text={biography} /></div>
      }
    </section>)
}
