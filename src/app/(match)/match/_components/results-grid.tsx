/* components/ResultsGrid.tsx */
import TmdbRating from "@/app/(media)/_components/tmdb-rating";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { capitalizeFirst } from "@/lib/strings";
import { CandidateResponse } from "@/types/camel-index";
import Image from "next/image";
import Link from "next/link";
import { useId } from "react";

export default function ResultsGrid({
  items,
  loading,
}: {
  items: CandidateResponse[];
  // items: {
  //   id: number;
  //   title: string;
  //   posterPath: string | null;
  //   reason: string;
  //   voteAverage: number;
  //   mediaType: "movie" | "tv";
  // }[];
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
              <div className="absolute top-0 flex w-full items-center justify-between bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
                {m.reason && m.reason}
                <Badge className="p-1 font-semibold">
                  {capitalizeFirst(m.mediaType)}
                </Badge>
                {/* {m.reason.length > 30 ? m.reason.slice(0, 27) + "…" : m.reason} */}
              </div>

              <Badge className="absolute right-2 top-2 bg-cyan-600/80 text-[10px] backdrop-blur-md">
                {m.score}
              </Badge>

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
          ))}
    </div>
  );
}
