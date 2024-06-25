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
    <div className="sticky top-0 left-0 border-b border-transparent/10 z-10 backdrop-blur-sm">
      <nav className="flex w-full items-center justify-between p-1 px-4 text-md font-semibold">
        <div>
          <Link href="/">Glimpse</Link>
        </div>
        <section className="flex space-x-4 items-center group-active:bg-background/70">
          <Search />
          <Button variant="ghost" size="icon">
            <Link href="https://github.com/ay-Lucas">
              <BsGithub size={20} />
            </Link>
          </Button>
          <ThemeToggle />
          {loggedIn ? (
            <Button asChild size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
          ) : (
            <AvatarDropdown
              avatar={
                <Avatar className="p-1">
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
