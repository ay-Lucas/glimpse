import Link from "next/link";
import { Button } from "@/components/ui/button";

export const revalidate = 43200; // 12 hours

export default async function HomePage() {
  return (
    <div>
      {/* <div className="min-h-screen w-full flex flex-col justify-center items-center text-center pb-20 px-4 bg-gradient-to-t from-background from-35% via-background/95 via-40% to-transparent"> */}
      <h1 className="mb-4 text-6xl font-bold">Welcome to Glimpse</h1>
      <p className="mb-6 max-w-lg text-xl font-semibold">
        Discover your next favorite TV show or movie...
      </p>
      <Link href="/discover">
        <Button
          variant="default"
          className="transition-transform hover:-translate-y-1"
        >
          Discover now
        </Button>
      </Link>
    </div>
  );
}
