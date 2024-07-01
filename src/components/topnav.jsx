import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { BsGithub } from "react-icons/bs";
import { AvatarDropdown } from "@/app/browse/_components/avatar-dropdown";
import { Search } from "@/app/browse/_components/search";
// import "@/styles/globals.css";

export function TopNav({ loggedIn = false }) {
  return (
    <div className="sticky top-0 left-0 border-b border-transparent/10 z-10 backdrop-blur-sm bg-background/80">
      <nav className="flex w-full items-center p-1 px-4 text-md font-bold justify-between">
        <div className="w-1/3 justify-start hidden md:flex">
          <Link href="/">Glimpse</Link>
        </div>
        <div className="flex mx-auto md:w-1/3 justify-center">
          <section className="flex flex-nowrap">
            <Button variant="ghost" className="md:text-lg">
              <Link href="/browse">Browse</Link>
            </Button>
            <Button variant="ghost" className="md:text-lg">
              <Link href="/movies">Movies</Link>
            </Button>
            <Button variant="ghost" className="md:text-lg">
              <Link href="/series">Series</Link>
            </Button>
          </section>
        </div>
        <section className="flex md:w-1/3 justify-end  space-x-4 items-center group-active:bg-background/70">
          {/* <Search /> */}
          <ThemeToggle className="hidden md:visible" />
          {loggedIn ? (
            <Button asChild size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
          ) : (
            <AvatarDropdown
              avatar={
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              }
            />
          )}
        </section>
      </nav>
    </div>
  );
}
