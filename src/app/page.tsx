import Link from "next/link";
import { getBackgrounds } from "./(auth)/_components/backdrops";
import { getBlurData } from "@/lib/blur-data-generator";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
// import dynamic from "next/dynamic";
import Background from "./(auth)/_components/background";

export const revalidate = 43200; // 12 hours

// const BackgroundClient = dynamic(
//   () => import("./(auth)/_components/background"),
//   {
//     ssr: false,
//     loading: () => <Skeleton className="w-full h-full" />,
//   },
// );
//
export default async function HomePage() {
  const backdrops = await getBackgrounds();
  const firstBackdrop = backdrops.at(0);

  return (
    <main>
      <div className="-z-40 absolute flex left-0 top-0 h-full w-full items-center">
        <Suspense>
          {backdrops && firstBackdrop && (
            <Background
              images={backdrops}
              firstBackdropBlurData={await getBlurData(firstBackdrop)}
            />
          )}
        </Suspense>
      </div>
      <section className="min-h-screen flex flex-col justify-center items-center text-center pb-20 px-4 bg-gradient-to-t from-background from-35% via-background/95 via-40% to-transparent">
        <h1 className="text-6xl font-bold mb-4">Welcome to Glimpse</h1>
        <p className="text-xl mb-6 max-w-lg font-semibold">
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
      </section>
    </main>
  );
}
