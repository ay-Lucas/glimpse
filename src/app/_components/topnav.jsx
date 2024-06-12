import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { BsGithub } from "react-icons/bs";
import "@/styles/globals.css";
export function TopNav() {
  return (
    <div className="fixed top-0 left-0 right-0 border-b z-10 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-screen-2xl items-center justify-between p-2.5 text-xl font-semibold ">
        <div>
          <Link href="/">Glimpse</Link>
        </div>
        <section className="flex space-x-4 items-center">
          <Button variant="ghost" size="icon">
            <Link href="https://github.com/ay-Lucas">
              <BsGithub size={20} />
            </Link>
          </Button>
          <ThemeToggle />
          <Button asChild size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
        </section>
      </nav>
    </div>
  );
}
