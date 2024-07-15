import Link from "next/link";
import { Button } from "./ui/button";

export function BottomNav() {
  return (
    <nav className="w-full opacity-100 md:w-0 md:opacity-0 sticky bottom-0 left-0 border-b border-transparent/10 z-10 backdrop-blur-sm bg-background/80">
      <div className="items-center flex justify-center">
        <Button variant="ghost" className="md:text-lg">
          <Link href="/discover">Discover</Link>
        </Button>
        <Button variant="ghost" className="md:text-lg">
          <Link href="/discover/movies">Movies</Link>
        </Button>
        <Button variant="ghost" className="md:text-lg">
          <Link href="/discover/series">Series</Link>
        </Button>
      </div>
    </nav>
  );
}
