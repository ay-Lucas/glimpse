import { Github, LogOut, LucideList, Settings } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { signout } from "@/lib/actions";
import Link from "next/link";
import { auth } from "@/auth";

export async function AvatarDropdown() {
  const session = await auth();
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
              <p className="w-full h-full px-2 py-1.5">{session.user.email}</p>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem>
          <Link href={"/watchlist"} className="w-full h-full">
            <button
              type="submit"
              className="flex px-2 py-1.5 w-full focus:bg-accent"
            >
              <LucideList className="mr-2 h-4 w-4" />
              Watchlist
            </button>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <Link href="/settings" className="w-full h-full">
            <button
              type="submit"
              className="flex px-2 py-1.5 w-full focus:bg-accent"
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
            className="w-full h-full"
          >
            <button
              type="submit"
              className="flex px-2 py-1.5 w-full focus:bg-accent"
            >
              <Github className="mr-2 h-4 w-4" />
              Github
            </button>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <form action={signout} className="w-full h-full">
            <button
              type="submit"
              className="flex px-2 py-1.5 w-full focus:bg-accent"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
