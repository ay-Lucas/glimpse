"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AvatarDropdown } from "./avatar-dropdown";
import { HomeIcon, List, Sparkles, TelescopeIcon, Tv } from "lucide-react";
import { useSupabase } from "@/context/supabase";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function TopNav() {
  const { session } = useSupabase();

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <nav className="mx-auto grid h-14 max-w-[1920px] grid-cols-[auto_1fr_auto] items-center gap-3 px-1 md:grid-cols-[auto_1fr_1fr_auto] md:gap-5 md:px-5 lg:px-10">
        {/* 1 Logo + search (desktop) */}
        <section className="z-10 flex items-center justify-start gap-2 sm:gap-3">
          <div className="flex justify-center md:hidden">
            <SidebarTrigger />
          </div>
          <Link href="/">
            <Button
              variant={"link"}
              className="p-1 text-base font-bold md:text-lg"
            >
              Glimpse
            </Button>
          </Link>
        </section>
        {/* 2 Center nav (desktop) */}
        <div className="hidden items-center justify-start md:flex">
          <TopNavigationMenu />
        </div>

        {/* 2 Center nav (desktop) */}
        {/* <section className="hidden items-center justify-center md:flex"> */}
        {/*   <TopNavigationMenu /> */}
        {/* </section> */}

        <div className="flex justify-end">
          <SearchCommand />
        </div>
        {/* 3 Auth / avatar (desktop) */}
        <section className="flex items-center justify-end">
          {session?.user ? (
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

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { TV_GENRES } from "@/lib/title-genres";
import React, { useCallback } from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { SearchCommand } from "./search-command-dialog";

export type SubItem = { href: string; label: string };
export type NavItem = {
  href: string;
  label: string;
  icon?: React.ElementType;
  submenus?: { items: SubItem[]; label?: string }[];
};

const TV_LISTS = [
  "Trending",
  "Popular",
  "Top Rated",
  "Upcoming TV",
  "On The Air",
] as const;

export const navigationMenuItems: NavItem[] = [
  { href: "/discover", icon: HomeIcon, label: "Home" },
  {
    href: "/tv",
    icon: Tv,
    label: "TV",
    submenus: [
      {
        items: TV_LISTS.map((l) => ({
          href: `/tv/lists#${l}`,
          label: l,
        })),
        label: "Lists",
      },
      {
        items: TV_GENRES.map((g) => ({
          href: `/tv/genres#${g.label}`,
          label: g.label,
        })),
        label: "Genres",
      },
    ],
  },
  { href: "/match", icon: Sparkles, label: "MoodMatch" },
  { href: "/watchlist", icon: List, label: "Watchlist" },
];

export const useIsActive = () => {
  const pathname = usePathname();
  return useCallback(
    (item: NavItem) =>
      pathname === item.href || pathname.startsWith(item.href + "/"),
    [pathname]
  );
};

function MenuEntry({ item }: { item: NavItem }) {
  const isActive = useIsActive();
  const activePathCss = "bg-accent text-foreground rounded-md";
  const common = cn(
    navigationMenuTriggerStyle(),
    isActive(item) && activePathCss
  );
  const Icon = item.icon;

  /* ── link without submenu ──────────────────────────────────────────────── */
  if (!item.submenus) {
    return (
      <NavigationMenuItem>
        <NavigationMenuLink asChild className={common}>
          <Link
            href={item.href}
            aria-current={isActive(item) ? "page" : undefined}
          >
            {Icon && <Icon className="mr-2 h-5 w-5" />}
            {item.label}
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    );
  }

  /* ── trigger + dropdown (e.g. TV) ─────────────────────────────────────── */
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className={common}>
        {Icon && <Icon className="mr-2 h-5 w-5" />}
        {item.label}
      </NavigationMenuTrigger>

      <NavigationMenuContent>
        <div className="p-4 md:w-[520px] lg:w-[560px]">
          <div className="grid gap-3 lg:grid-cols-2">
            {item.submenus.map((sub) => (
              <div key={sub.label}>
                {sub.label && (
                  <p className="mb-2 ml-1 px-1 text-xs font-semibold uppercase tracking-wide">
                    {sub.label}
                  </p>
                )}
                <ul className="space-y-1">
                  {sub.items.map((it) => (
                    <ListItem
                      key={it.href}
                      href={it.href}
                      title={it.label}
                      className="px-2 py-2 text-gray-400"
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

function TopNavigationMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navigationMenuItems.map((item) => (
          <MenuEntry key={item.label} item={item} />
        ))}
      </NavigationMenuList>

      <NavigationMenuIndicator />
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, ...props }, ref) => (
  <li>
    <NavigationMenuLink asChild>
      <a
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
          "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </a>
    </NavigationMenuLink>
  </li>
));
ListItem.displayName = "ListItem";
