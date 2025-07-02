"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AvatarDropdown } from "./avatar-dropdown";
import { Search } from "./search";
import { LucideList, LucideTv } from "lucide-react";
import { useSupabase } from "@/context/supabase";

export function TopNav() {
  const { session, client } = useSupabase();

  return (
    <div className="sticky left-0 top-0 z-10 w-full border-b border-transparent/10 bg-background/80 backdrop-blur-sm">
      <nav className="text-md grid grid-cols-3 items-center p-1 px-4 font-bold">
        <section className="z-10 flex items-center lg:space-x-5">
          <Link className="hidden lg:inline" href="/">
            Glimpse
          </Link>
          <Search />
        </section>
        <div className="flex flex-nowrap items-center justify-center md:opacity-100">
          <Link href="/discover" className="items-center">
            <Button variant="ghost" className="font-semibold sm:text-lg">
              <LucideTv className="mb-1 p-0.5 sm:mr-2" />
              <span className="hidden sm:flex">Discover</span>
            </Button>
          </Link>
          <Link href={"/watchlist"} className="items-center">
            <Button className="font-semibold sm:text-lg" variant="ghost">
              <LucideList className="sm:mr-2" />
              <span className="hidden sm:flex">Watchlist</span>
            </Button>
          </Link>
        </div>
        <section className="grid items-center justify-end space-x-4">
          {/* {status === "loading" ? ( */}
          {/* <div>Checking…</div> */}
          {session?.user ? (
            <AvatarDropdown />
          ) : (
            <Button asChild size="sm">
              <Link href="/signin">Sign in</Link>
            </Button>
          )}
          {/* )} */}
        </section>
      </nav>
    </div>
  );
}
