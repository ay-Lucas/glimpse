import { Button } from "@/components/ui/button";
import { getWatchlists } from "@/lib/actions";
import { Session } from "next-auth";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Play } from "lucide-react";
import { FullMovie } from "@/types/camel-index";

const AddToWatchlistDropdownClient = dynamic(
  () => import("@/components/add-to-watchlist-button"),
  { ssr: false },
);
export default async function MediaActions({
  tmdbId,
  session,
  data,
  rating,
  videoPath,
}: {
  tmdbId: number;
  session?: Session;
  data: FullMovie;
  rating: string;
  videoPath?: string;
}) {
  const userWatchlists = session ? await getWatchlists(session.user.id) : null;
  return (
    <div className="flex justify-center md:justify-start space-x-3">
      {videoPath !== undefined && videoPath.trim() && (
        <Link href={`/movie/${tmdbId}?show=true`}>
          <Button variant="outline" className="flex items-center space-x-2">
            <Play size={20} />
            <span>Play Trailer</span>
          </Button>
        </Link>
      )}
      {userWatchlists && session ? (
        <AddToWatchlistDropdownClient
          userId={session.user.id}
          item={data}
          rating={rating ?? ""}
          mediaType="movie"
        />
      ) : (
        <Link href={"/signin"}>
          <Button variant="secondary">Add to Watchlist</Button>
        </Link>
      )}
    </div>
  );
}
