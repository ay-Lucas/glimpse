import PersonBio from "./person-bio";

export function PersonDetails({
  name,
  biography,
  birthDate,
  popularity,
  deathDay,
  knownForDept,
  placeOfBirth,
  paramsId,
}: {
  name?: string;
  biography?: string;
  birthDate?: string | null;
  popularity?: number;
  deathDay?: string | null;
  knownForDept?: string | null;
  placeOfBirth?: string | null;
  paramsId?: number;
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

  const role = new Map([["Acting", "Actor"]]);

  return (
    <div className="flex flex-col justify-between space-y-1 items-center md:items-start">
      <h2 className="text-3xl md:text-5xl font-medium text-center md:text-start pb-2">
        {deathDay !== null ? `${name} (${birthYear} - ${deathYear})` : name}
      </h2>
      <div className="flex flex-col text-lg items-start justify-center md:justify-start">
        {knownForDept && <span>{role.get(knownForDept)}</span>}
        {birthDate && (
          <div>
            <span>Born: {formattedBirthDate} </span>
            <>{placeOfBirth && <span>in {placeOfBirth}</span>}</>
          </div>
        )}
        {deathDay && <span>Died: {formattedDeathDate}</span>}
        {age && <span>Age: {age}</span>}
        <div className="inline-flex items-center">
          <span className="mr-2">
            Popularity: {Math.round(popularity ?? 0)}
          </span>
          <>{/* <span>•</span> */}</>
        </div>
      </div>
      <br />
      <div className="">
        <PersonBio bio={biography ?? ""} />
      </div>
    </div>
  );
}
