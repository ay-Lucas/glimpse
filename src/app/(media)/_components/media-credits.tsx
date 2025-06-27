"use client"

import CastCard from "@/components/cast-card"
import ImageCarousel from "@/components/image-carousel"
import { Button } from "@/components/ui/button"
import { BASE_CAST_IMAGE_URL, DEFAULT_BLUR_DATA_URL } from "@/lib/constants"
import { Cast, Crew } from "@/types/request-types-camelcase"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"; // adjust path if needed
import Link from "next/link"
import { Fragment, useMemo, useState } from "react"
import { ChevronRight } from "lucide-react"
import Image from "next/image"

interface CreditsProps {
  cast: Cast[]
  crew: Crew[]
}

export function Credits({ cast, crew }: CreditsProps) {
  // 1) Filter + sort cast by `order`
  const sortedCast = useMemo(
    () =>
      cast
        .filter((c): c is Required<Pick<Cast, "id" | "name" | "character" | "profilePath" | "order">> =>
          c.id != null && !!c.name && !!c.character && !!c.profilePath && !!c.order
        )
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [cast]
  )

  // 2) Group crew by department
  const crewByDept = useMemo(() => {
    return crew
      .filter((m): m is Required<Pick<Crew, "department" | "job" | "id" | "name">> =>
        !!m.department && !!m.job && !!m.id && !!m.name
      )
      .reduce<Record<string, Crew[]>>((acc, member) => {
        acc[member.department] = acc[member.department] || []
        acc[member.department]?.push(member)
        return acc
      }, {})
  }, [crew])

  const MAX_INLINE = 4;
  const [open, setOpen] = useState(false);
  return (
    <section className="space-y-12">
      {/* ——— CAST GRID ——— */}

      <ImageCarousel
        title={
          <h2 className={`text-2xl font-bold`}>Cast</h2>
        }
        items={cast?.map((item, index: number) => (
          <Link href={`/person/${item.id}`} key={index}>
            <CastCard
              name={item.name}
              character={item.character}
              imagePath={`${BASE_CAST_IMAGE_URL}${item.profilePath}`}
              index={index}
              blurDataURL={DEFAULT_BLUR_DATA_URL}
              className="pt-2"
            />
          </Link>
        ))}
        breakpoints="cast"
      />

      {/* ——— CREW TABLES ——— */}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="pb-5 space-y-2 flex">
            <button className="pb-4 pt-3 flex items-end hover:text-gray-400">
              <h2 className={`text-2xl font-bold`}>All Cast and Crew</h2>
              <ChevronRight size={30} />
            </button>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogTitle>All Cast</DialogTitle>
          <div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Cast</h2>
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
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
                      <div className="w-full h-[278px] bg-gray-700 rounded-md" />
                    )}
                    <p className="font-semibold truncate">{c.name}</p>
                    <p className="text-sm text-gray-400 truncate">
                      as {c.character}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <h2 className="text-2xl font-bold mb-4">Crew</h2>
            {Object.entries(crewByDept).map(([dept, members]) => (
              <Fragment key={dept}>
                <h3 className="text-xl font-semibold mt-6 mb-2">{dept}</h3>
                <table className="w-full table-fixed mb-6">
                  <colgroup>
                    <col className="w-1/2" />
                    <col className="w-1/2" />
                  </colgroup>
                  <thead>
                    <tr className="text-left text-gray-400 uppercase text-xs">
                      <th className="py-2">Name</th>
                      <th className="py-2">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m) => (
                      <tr key={m.id} className="border-t hover:bg-muted/50">
                        <td className="py-2 text-blue-400 ">
                          <Link href={`/person/${m.id}`} key={m.id} className="hover:underline">
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
          </div>
          <div className="mt-4 text-right">
            <DialogClose asChild>
              <Button size="sm">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
