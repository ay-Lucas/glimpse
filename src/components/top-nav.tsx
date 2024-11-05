import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AvatarDropdown } from "./avatar-dropdown";
import { Search } from "./search";
import { auth } from "@/auth";
import {
  LucideFileArchive,
  LucideList,
  LucideMailPlus,
  LucidePlusSquare,
  LucideSearch,
  LucideTv,
} from "lucide-react";

export async function TopNav() {
  const session = await auth();
  return (
    <div className="sticky top-0 left-0 border-b border-transparent/10 z-10 backdrop-blur-sm bg-background/80">
      <nav className="grid grid-cols-3 items-center p-1 px-4 text-md font-bold">
        <section className="col-span-2 md:col-span-1 flex z-10 items-center lg:space-x-5">
          <Link className="hidden lg:inline" href="/">
            Glimpse
          </Link>
          <Search />
        </section>
        <div className="hidden md:flex md:opacity-100 items-center justify-center">
          <Link href="/discover" className="items-center">
            <Button variant="ghost" className="md:text-lg font-semibold">
              <LucideTv className="mr-2 p-0.5 mb-1" />
              Discover
            </Button>
          </Link>
          <Link href={"/watchlist"} className="items-center">
            <Button className="md:text-lg" variant="ghost">
              <LucideList className="mr-2" />
              Watchlist
            </Button>
          </Link>
        </div>
        <section className="grid justify-end space-x-4 items-center group-active:bg-background/70 ">
          {session ? (
            <AvatarDropdown />
          ) : (
            <Button asChild size="sm">
              <Link href="/signin">Sign in</Link>
            </Button>
          )}
        </section>
      </nav>
    </div>
  );
}
