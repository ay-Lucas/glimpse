"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
  SidebarRail,
  SidebarTrigger,
  SidebarClose,
} from "@/components/ui/sidebar";

import { navigationMenuItems, NavItem } from "./top-nav";
import { cn } from "@/lib/utils";

import Link from "next/link";
import { Fragment } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Top-level component                                                        */
/* -------------------------------------------------------------------------- */

export function MobileNav() {
  /*  The sidebar is closed by default — no need to call nav.setOpen(false)   */
  return (
    /*  lg:hidden keeps the sidebar strictly on mobile / tablet  */
    <Sidebar className="md:hidden">
      <SidebarContent>
        <SidebarClose className="w-full justify-end pr-2 pt-3" />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationMenuItems.map((item) => (
                <MenuEntry key={item.label} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

/* -------------------------------------------------------------------------- */
/*  Single entry — renders either a link or a nested submenu                  */
/* -------------------------------------------------------------------------- */

function MenuEntry({ item }: { item: NavItem }) {
  const sidebar = useSidebar();
  const pathname = usePathname();
  const active = pathname === item.href || pathname.startsWith(item.href + "/");

  // broaden active state for parent with children
  const childIsActive = item.submenus?.some((sub) =>
    sub.items.some((it) => pathname === it.href)
  );

  const common = cn(
    "flex w-full items-center gap-2 rounded-md px-2 py-2 transition-colors",
    (active || childIsActive) &&
      "!bg-sidebar-ring backdrop-blur-xl shadow-xl text-accent-foreground"
  );

  const Icon = item.icon;

  // plain link
  if (!item.submenus) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild className={common}>
          <Link href={item.href} onClick={() => sidebar.toggleSidebar()}>
            {Icon && <Icon className="h-5 w-5" />}
            {item.label}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  // expandable branch
  return (
    <Collapsible defaultOpen={childIsActive} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          {/* add `group` here ↓ */}
          <SidebarMenuButton
            className={cn(
              common,
              "group justify-between" //  ← group for descendant selectors
            )}
          >
            <span className="flex items-center gap-2">
              {Icon && <Icon className="h-5 w-5" />}
              {item.label}
            </span>

            {/* rotate when the PARENT (group) is open */}
            <ChevronRight className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
          <SidebarMenuSub>
            {item.submenus.map((sub) => (
              <Fragment key={sub.label}>
                <div className="px-4 pt-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {sub.label}
                </div>

                {sub.items.map((it) => (
                  <SidebarMenuSubItem key={it.href}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname === it.href}
                    >
                      <Link
                        href={it.href}
                        onClick={() => sidebar.toggleSidebar()}
                      >
                        {it.label}
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </Fragment>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
