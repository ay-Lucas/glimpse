import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { AvatarDropdown } from "./avatar-dropdown";
import { Search } from "./search";
import { getMultiSearch } from "@/app/discover/actions";
export async function TopNav({ loggedIn = false }) {
  return (
    <div className="sticky top-0 left-0 border-b border-transparent/10 z-10 backdrop-blur-sm bg-background/80">
      <nav className="grid grid-cols-3 items-center p-1 px-4 text-md font-bold">
        <section className="col-span-2 md:col-span-1 flex z-10 items-center lg:space-x-5">
          <Link className="hidden lg:inline" href="/">
            Glimpse
          </Link>
          <Search getMultiSearch={getMultiSearch} />
        </section>
        <div className="hidden md:flex md:opacity-100 items-center justify-center">
          <Button variant="ghost" className="md:text-lg">
            <Link href="/discover">Discover</Link>
          </Button>
          <Button variant="ghost" className="md:text-lg">
            <Link href="/discover/movies">Movies</Link>
          </Button>{" "}
          <Button variant="ghost" className="md:text-lg">
            <Link href="/discover/series">Series</Link>
          </Button>
        </div>
        <section className="grid justify-end space-x-4 items-center group-active:bg-background/70 ">
          {/* <ThemeToggle className="hidden md:visible" /> */}
          {loggedIn ? (
            <Button asChild size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
          ) : (
            <AvatarDropdown />
          )}
        </section>
      </nav>
    </div>
  );
}
