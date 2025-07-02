import { Expandable } from "@/app/(media)/_components/expandable";

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
  knownCredits,
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
  function getFormattedDate(dateStr: string) {
    return new Intl.DateTimeFormat("us", {
      timeZone: "UTC",
      month: "long",
      year: "numeric",
      day: "numeric",
    }).format(new Date(dateStr));
  }

  function getAge(birthDate: string) {
    const miliseconds = new Date().valueOf() - new Date(birthDate).valueOf();
    const years = miliseconds / 1000 / 60 / 60 / 24 / 365;
    return years.toString().split(".")[0];
  }
  const age = birthDate ? getAge(birthDate) : null;
  const birthDateLabel = birthDate ? getFormattedDate(birthDate) : null;
  const deathDateLabel = deathDay ? getFormattedDate(deathDay) : null;
  return (
    <section className="flex flex-col space-y-6">
      <div className="grid grid-cols-3 gap-x-3 gap-y-6 text-left md:grid-cols-3">
        <div>
          <div className="text-xs font-bold uppercase text-gray-400">Born</div>
          <time dateTime={birthDate!} className="mt-1 block">
            {birthDateLabel ?? "unknown"}
          </time>
        </div>
        {deathDateLabel && (
          <div>
            <div className="text-xs font-bold uppercase text-gray-400">
              Died
            </div>
            <time dateTime={birthDate!} className="mt-1 block">
              {deathDateLabel}
            </time>
          </div>
        )}
        <div>
          <div className="text-xs font-bold uppercase text-gray-400">Age</div>
          <div>{age ?? "unknown"}</div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase text-gray-400">
            Gender
          </div>
          <div>{gender}</div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase text-gray-400">
            Place Of Birth
          </div>
          <div>{placeOfBirth ?? "unknown"}</div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase text-gray-400">
            Known For
          </div>
          <div>{knownForDept}</div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase text-gray-400">
            Known Credits
          </div>
          <div>{knownCredits}</div>
        </div>
      </div>
      {biography && (
        <div>
          <div className="text-xs font-bold uppercase text-gray-400">
            Biography
          </div>
          <Expandable>{biography}</Expandable>
        </div>
      )}
    </section>
  );
}
