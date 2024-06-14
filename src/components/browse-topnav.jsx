import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { BsGithub } from "react-icons/bs";
import { AvatarDropdown } from "./avatar-dropdown";
import { Search } from "./search";
import "@/styles/globals.css";

export function TopNav({ loggedIn = false }) {
  return (
    <div className="fixed top-0 left-0 right-0 border-b z-10 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-screen-2xl items-center justify-between p-2.5 text-xl font-semibold ">
        <div>
          <Link href="/">Glimpse</Link>
        </div>
        <section className="flex space-x-4 items-center">
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
