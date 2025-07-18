import {
  MovieReleaseDatesResponse,
  ReleaseDate,
} from "@/types/request-types-camelcase";
import { MovieReleasesTabs } from "./release-date-tabs";

const releaseTypeLabels: Record<number, string> = {
  1: "Premiere",
  2: "Theatrical (limited)",
  3: "Theatrical",
  4: "Digital",
  5: "Physical",
  6: "TV",
};
function getReleaseTypeLabel(type: number): string {
  return releaseTypeLabels[type] ?? "Unknown";
}

interface GroupedRelease {
  type: number;
  label: string;
  dates: Array<{
    date: string;
    formatted: string;
    items: Array<ReleaseDate & { iso31661: string }>;
  }>;
}

export default function MovieReleases({
  releaseDatesRes,
}: {
  releaseDatesRes: MovieReleaseDatesResponse;
}) {
  const byType: Record<
    number,
    Record<string, Array<ReleaseDate & { iso31661: string }>>
  > = {};

  for (const country of releaseDatesRes.results) {
    for (const rd of country.releaseDates) {
      const typeGroup = (byType[rd.type] ??= {});
      const dateArray = (typeGroup[rd.releaseDate] ??= []);
      dateArray.push({ ...rd, iso31661: country.iso31661 });
    }
  }

  const grouped: GroupedRelease[] = Object.entries(byType).map(
    ([typeStr, dateMap]) => {
      const type = Number(typeStr);
      return {
        type,
        label: getReleaseTypeLabel(type),
        dates: Object.entries(dateMap).map(([date, items]) => ({
          date,
          formatted: new Intl.DateTimeFormat("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          }).format(new Date(date)),
          items,
        })),
      };
    }
  );

  if (grouped.length === 0) return null;
  return <MovieReleasesTabs grouped={grouped} />;
}

// <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
