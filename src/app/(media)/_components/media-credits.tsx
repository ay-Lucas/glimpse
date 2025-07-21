"use client";

import { Button } from "@/components/ui/button";
import { Cast, Crew } from "@/types/request-types-camelcase";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"; // adjust path if needed
import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CreditsProps {
  cast: Cast[];
  crew: Crew[];
}

export function Credits({ cast, crew }: CreditsProps) {
  // 1) Filter + sort cast by `order`
  const sortedCast = useMemo(
    () =>
      cast
        .filter(
          (
            c
          ): c is Required<
            Pick<Cast, "id" | "name" | "character" | "profilePath" | "order">
          > =>
            c.id != null &&
            !!c.name &&
            !!c.character &&
            !!c.profilePath &&
            !!c.order
        )
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [cast]
  );

  // 2) Group crew by department
  const crewByDept = useMemo(() => {
    return crew
      .filter(
        (m): m is Required<Pick<Crew, "department" | "job" | "id" | "name">> =>
          !!m.department && !!m.job && !!m.id && !!m.name
      )
      .reduce<Record<string, Crew[]>>((acc, member) => {
        acc[member.department] = acc[member.department] || [];
        acc[member.department]?.push(member);
        return acc;
      }, {});
  }, [crew]);

  const MAX_INLINE = 4;
  const [open, setOpen] = useState(false);
  return (
    <section className="space-y-12">
      {/* ——— CREW TABLES ——— */}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="flex space-y-2 pb-5">
            <button className="flex items-end pb-4 pt-3 hover:text-gray-400">
              <h2 className={`text-2xl font-bold`}>All Cast and Crew</h2>
              <ChevronRight size={30} />
            </button>
          </div>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] max-w-[95vw] overflow-y-auto sm:max-w-[90vw] lg:max-w-5xl">
          <Tabs defaultValue="cast">
            <TabsList>
              <TabsTrigger value="cast">Cast</TabsTrigger>
              <TabsTrigger value="crew">Crew</TabsTrigger>
            </TabsList>
            <TabsContent value="cast">
              <DialogTitle>All Cast</DialogTitle>
              <div>
                <h2 className="mb-4 text-2xl font-bold">Cast</h2>
                <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {sortedCast.map((c) => (
                    <li key={c.id} className="space-y-2">
                      {c.profilePath ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w185${c.profilePath}`}
                          alt={c.name}
                          width={185}
                          height={278}
                          unoptimized
                          className="rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-[278px] w-full rounded-md bg-gray-700" />
                      )}
                      <p className="truncate font-semibold">{c.name}</p>
                      <p className="truncate text-sm text-gray-400">
                        as {c.character}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <h2 className="mb-4 text-2xl font-bold">Crew</h2>
            </TabsContent>
            <TabsContent value="crew">
              {Object.entries(crewByDept).map(([dept, members]) => (
                <Fragment key={dept}>
                  <h3 className="mb-2 mt-6 text-xl font-semibold">{dept}</h3>
                  <table className="mb-6 w-full table-fixed">
                    <colgroup>
                      <col className="w-1/2" />
                      <col className="w-1/2" />
                    </colgroup>
                    <thead>
                      <tr className="text-left text-xs uppercase text-gray-400">
                        <th className="py-2">Name</th>
                        <th className="py-2">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m) => (
                        <tr key={m.id} className="border-t hover:bg-muted/50">
                          <td className="py-2 text-blue-400">
                            <Link
                              href={`/person/${m.id}`}
                              key={m.id}
                              className="hover:underline"
                            >
                              {m.name}
                            </Link>
                          </td>
                          <td className="py-2">{m.job}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Fragment>
              ))}
              <div className="mt-4 text-right">
                <DialogClose asChild>
                  <Button size="sm">Close</Button>
                </DialogClose>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </section>
  );
}
