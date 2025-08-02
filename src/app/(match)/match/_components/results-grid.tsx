/* components/ResultsGrid.tsx */
import TmdbRating from "@/app/(media)/_components/tmdb-rating";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { capitalizeFirst } from "@/lib/strings";
import { CandidateResponse } from "@/types/camel-index";
import Image from "next/image";
import Link from "next/link";

export default function ResultsGrid({
  items,
  loading,
}: {
  items: CandidateResponse[];
  loading: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {loading
        ? Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] animate-pulse rounded-xl bg-white/10 backdrop-blur-sm"
            />
          ))
        : items.map((m) => (
            <div className="group">
              <div className="hidden h-0 w-full justify-center text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 md:flex md:h-fit">
                {/* <Badge className="absolute bottom-full left-1/2 z-10 bg-cyan-600/80 text-[10px] backdrop-blur-md"> */}
                <span>{m.score}</span>
              </div>
              <Card
                key={m.id}
                className="group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm transition hover:ring-2 hover:ring-cyan-400"
              >
                {m.posterPath ? (
                  <Link href={`/${m.mediaType}/${m.id}`}>
                    <Image
                      src={`/tmdb/t/p/w342${m.posterPath}`}
                      alt={m.title}
                      unoptimized
                      width={342}
                      height={500}
                      className="aspect-[2/3] w-full object-cover"
                    />
                  </Link>
                ) : (
                  <div className="flex aspect-[2/3] w-full items-center justify-center bg-muted/20 text-xs">
                    No image
                  </div>
                )}

                {/* reason pill */}
                {/* <Badge className="absolute left-0 top-0 bg-cyan-600/80 text-[11px] backdrop-blur-md"> */}
                <div className="absolute left-0 top-0 flex bg-black/60 backdrop-blur-sm">
                  <div className="flex w-full items-center justify-between px-2 py-1 text-xs text-white">
                    {m.reason && m.reason}
                    {/* {m.reason.length > 30 ? m.reason.slice(0, 27) + "…" : m.reason} */}
                  </div>
                  <div className="flex flex-col">
                    <Badge
                      className={`h-fit font-semibold ${m.mediaType === "tv" ? "bg-blue-500" : "bg-red-700"} text-white`}
                    >
                      <p className="flex flex-col">
                        {capitalizeFirst(m.mediaType)}
                      </p>
                    </Badge>
                  </div>
                </div>

                {/* media ribbon */}
                {/* {m.mediaType === "tv" && ( */}
                {/*   <div className="absolute -left-10 top-4 rotate-[-45deg] bg-fuchsia-600/80 px-20 py-0.5 text-center text-[10px] uppercase tracking-wider text-white shadow-lg shadow-fuchsia-400/20"> */}
                {/*     Series */}
                {/*   </div> */}
                {/* )} */}
                {/**/}
                {/* footer */}
                <CardContent className="absolute bottom-0 flex w-full items-center justify-between bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
                  <Link href={`/${m.mediaType}/${m.id}`}>
                    <span className="pr-1">{m.title}</span>
                  </Link>
                  <TmdbRating
                    mediaType={m.mediaType}
                    tmdbId={m.id}
                    tmdbVoteAverage={m.voteAverage}
                    tmdbVoteCount={m.voteCount}
                    size="small"
                  />
                </CardContent>
              </Card>
            </div>
          ))}
    </div>
  );
}
