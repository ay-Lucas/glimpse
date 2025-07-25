"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AvatarDropdown } from "./avatar-dropdown";
import { Search } from "./search";
import { Film, List, TelescopeIcon, Tv } from "lucide-react";
import { useSupabase } from "@/context/supabase";

import type { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Item = {
  href: string;
  icon: LucideIcon;
  label: string;
  match?: (path: string) => boolean; // optional custom matcher
};

const items: Item[] = [
  { href: "/discover", icon: TelescopeIcon, label: "Discover" },
  { href: "/tv", icon: Tv, label: "TV" },
  // { href: "/movie", icon: Film, label: "Movie" },
  { href: "/watchlist", icon: List, label: "Watchlist" },
];

export function TopNav() {
  const { session, client } = useSupabase();
  const pathname = usePathname();
  const isActive = (item: Item) => {
    if (item.match) return item.match(pathname);
    // default: highlight when on the exact page or any sub-route
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };
  return (
    <div className="sticky left-0 top-0 z-10 w-full border-b border-transparent/10 bg-background/80 backdrop-blur-sm">
      <nav className="grid grid-cols-3 items-center p-1 text-md font-bold sm:px-4">
        <section className="z-10 flex items-center lg:space-x-5">
          <Link className="hidden lg:inline" href="/">
            Glimpse
          </Link>
          <Search />
        </section>
        <div className="flex flex-nowrap items-center justify-center space-x-1 md:opacity-100">
          {items.map(({ href, icon: Icon, label }) => {
            const active = isActive({ href, icon: Icon, label });
            return (
              <Button
                key={href}
                asChild
                size={"sm"}
                variant={active ? "default" : "ghost"}
                className={cn(
                  "items-center font-semibold sm:text-lg",
                  active && "text-primary-foreground data-[state=on]:bg-primary"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Link href={href}>
                  <Icon className="sm:mr-1" size={23} />
                  <span className="hidden sm:flex">{label}</span>
                </Link>
              </Button>
            );
          })}
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
