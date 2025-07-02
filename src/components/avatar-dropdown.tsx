"use client";

import { Github, LogOut, LucideList, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
import { useSupabase } from "@/context/supabase";
import { SignOutButton } from "./sign-out-button";

export function AvatarDropdown() {
  const { session } = useSupabase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus-visible:outline-none">
          <Avatar>
            <AvatarImage
              src="https://github.com/shadcn.png"
              className="w-10 rounded-3xl"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {session?.user && (
          <>
            <DropdownMenuItem>
              <p className="h-full w-full px-2 py-1.5">{session.user.email}</p>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem>
          <Link href={"/watchlist"} className="h-full w-full">
            <button
              type="submit"
              className="flex w-full px-2 py-1.5 focus:bg-accent"
            >
              <LucideList className="mr-2 h-4 w-4" />
              Watchlist
            </button>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <Link href="/settings" className="h-full w-full">
            <button
              type="submit"
              className="flex w-full px-2 py-1.5 focus:bg-accent"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </button>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            href={"https://github.com/ay-lucas/glimpse"}
            className="h-full w-full"
          >
            <button
              type="submit"
              className="flex w-full px-2 py-1.5 focus:bg-accent"
            >
              <Github className="mr-2 h-4 w-4" />
              Github
            </button>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
