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
      <div className="min-h-screen w-full flex flex-col justify-center items-center text-center pb-20 px-4 bg-gradient-to-t from-background from-35% via-background/95 via-40% to-transparent">
        {backdropPaths && backdropPaths[0] && (
          <Backdrops
            images={backdropPaths}
            firstBackdropBlurData={firstBackdropBlur ?? DEFAULT_BLUR_DATA_URL}
          />
        )}
      </div>
      <div className="absolute flex left-0 top-0 h-full w-full items-center justify-center">
        {children}
      </div>
    </main>
  );
}
