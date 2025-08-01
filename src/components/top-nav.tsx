"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AvatarDropdown } from "./avatar-dropdown";
import { Search } from "./search";
import { List, Sparkles, TelescopeIcon, Tv } from "lucide-react";
import { useSupabase } from "@/context/supabase";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function TopNav() {
  const { session } = useSupabase();

  return (
    <div className="sticky left-0 top-0 z-10 w-full border-b border-transparent/10 bg-background/90 backdrop-blur-sm">
      <nav className="grid grid-cols-2 items-center p-1 sm:px-4 md:grid-cols-3">
        {/* 1 Logo + search (desktop) */}
        <section className="z-10 hidden items-center space-x-5 md:flex">
          <Link className="text-md font-bold" href="/">
            Glimpse
          </Link>
          <Search />
        </section>
        <section className="md:hidden">
          <SidebarTrigger />
        </section>

        {/* 2 Center nav (desktop) */}
        <section className="hidden justify-center md:flex">
          <TopNavigationMenu />
        </section>

        {/* 3 Auth / avatar (desktop) */}
        <section className="flex items-center justify-end space-x-4">
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

export type SubItem = { href: string; label: string };
export type NavItem = {
  href: string;
  label: string;
  icon?: React.ElementType;
  submenus?: { items: SubItem[]; label?: string }[];
};

const TV_LISTS = ["Upcoming TV", "On The Air", "Top Rated", "Popular"] as const;

export const navigationMenuItems: NavItem[] = [
  { href: "/discover", icon: TelescopeIcon, label: "Discover" },
  {
    href: "/tv",
    icon: Tv,
    label: "TV",
    submenus: [
      {
        items: TV_LISTS.map((l) => ({
          href: `/tv#${l}`,
          label: l,
        })),
        label: "Lists",
      },
      {
        items: TV_GENRES.map((g) => ({
          href: `/tv#${g.label}`,
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
  const activePathCss =
    "!bg-sidebar-ring backdrop-blur-xl shadow-xl transition-colors duration-200 !text-accent-foreground !outline-none";
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
          <Link href={item.href}>
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
        <ul className="grid gap-2 p-4 md:w-[400px] lg:w-[400px]">
          {item.submenus.map((sub) => (
            <ul className="grid lg:grid-cols-2" key={sub.label}>
              <div className="col-span-2 p-2 text-xl font-bold">
                {sub.label}
              </div>

              {sub.items.map((it) => (
                <ListItem
                  key={it.href}
                  href={it.href}
                  title={it.label}
                  className="px-2 py-2 text-gray-400"
                />
              ))}
            </ul>
          ))}
        </ul>
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
