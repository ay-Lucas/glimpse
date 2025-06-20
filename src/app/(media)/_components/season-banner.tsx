import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function SeasonBanner({ name, id, firstAirDate, color }: { name: string, id: number, firstAirDate: Date | null, color: string }) {
  const formattedFirstAirDate = firstAirDate
    ? new Intl.DateTimeFormat("en-US", {
      year: "numeric",
    }).format(new Date(firstAirDate))
    : null;
  // console.log(tv.tmdbId)
  return (
    <div className={`w-screen flex justify-center items-center py-2 shadow-md`}
      style={{ backgroundColor: color }}
    >
      <div className="">
        <h1 className="text-3xl font-semibold text-white">{name} ({formattedFirstAirDate})</h1>
        <Link className="flex items-center hover:text-gray-400  -ml-1 w-fit" href={`/tv/${id}`}><ChevronLeft size={24} /><h2 className="text-lg font-semibold">Back to main</h2></Link>
      </div>
    </div>
  );
}
