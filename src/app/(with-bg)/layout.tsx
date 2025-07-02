import { DEFAULT_BLUR_DATA_URL } from "@/lib/constants";
import { ReactNode } from "react";
import { getBackdrops } from "./utils";
import Backdrops from "./_components/backdrops";

export const revalidate = 43200; // 12 hours

export default async function Layout({ children }: { children: ReactNode }) {
  const { backdropPaths, firstBackdropBlur } = await getBackdrops();

  return (
    <main className="min-h-screen">
      {/* <div className="-z-40 absolute flex left-0 top-0 h-full w-full items-center"> */}
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-t from-background from-35% via-background/95 via-40% to-transparent px-4 pb-20 text-center">
        {backdropPaths && backdropPaths[0] && (
          <Backdrops
            images={backdropPaths}
            firstBackdropBlurData={firstBackdropBlur ?? DEFAULT_BLUR_DATA_URL}
          />
        )}
      </div>
      <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
        {children}
      </div>
    </main>
  );
}
