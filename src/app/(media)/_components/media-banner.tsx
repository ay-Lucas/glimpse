import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function MediaBanner({ name, id, firstAirDate, color, mediaType }: { name: string, id: number, firstAirDate: Date | null, color: string, mediaType: "tv" | "movie" }) {
  const formattedFirstAirDate = firstAirDate
    ? new Intl.DateTimeFormat("en-US", {
      year: "numeric",
    }).format(new Date(firstAirDate))
    : null;
  // console.log(tv.tmdbId)
  return (
    <div className={`flex w-full justify-center items-center py-2 shadow-md`}
      style={{ backgroundColor: color }}
    >
      <div className="">
        <h1 className="text-3xl font-semibold text-white">{name} ({formattedFirstAirDate})</h1>
        <Link className="flex items-center hover:text-gray-400  -ml-1 w-fit" href={`/${mediaType}/${id}`}><ChevronLeft size={24} /><h2 className="text-lg font-semibold">Back to main</h2></Link>
      </div>
    </div>
  );
}
