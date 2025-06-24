"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AvatarDropdown } from "./avatar-dropdown";
import { Search } from "./search";
import { LucideList, LucideTv } from "lucide-react";
import { useSupabase } from "@/context/supabase";

export function TopNav() {
  const { session, client } = useSupabase()

  return (
    <div className="sticky top-0 left-0 border-b border-transparent/10 z-10 backdrop-blur-sm bg-background/80">
      <nav className="grid grid-cols-3 items-center p-1 px-4 text-md font-bold">
        <section className="flex z-10 items-center lg:space-x-5 ">
          <Link className="hidden lg:inline" href="/">
            Glimpse
          </Link>
          <Search />
        </section>
        <div className="flex flex-nowrap md:opacity-100 items-center justify-center">
          <Link href="/discover" className="items-center">
            <Button variant="ghost" className="sm:text-lg font-semibold">
              <LucideTv className="sm:mr-2 p-0.5 mb-1" />
              <span className="hidden sm:flex">Discover</span>
            </Button>
          </Link>
          <Link href={"/watchlist"} className="items-center">
            <Button className="sm:text-lg font-semibold" variant="ghost">
              <LucideList className="sm:mr-2" />
              <span className="hidden sm:flex">Watchlist</span>
            </Button>
          </Link>
        </div>
        <section className="grid justify-end space-x-4 items-center">
          {/* {status === "loading" ? ( */}
          {/* <div>Checking…</div> */}
          {session?.user ?
            <AvatarDropdown /> :
            <Button asChild size="sm">
              <Link href="/signin">Sign in</Link>
            </Button>
          }
          {/* )} */}
        </section>
      </nav>
    </div>
  );
}
