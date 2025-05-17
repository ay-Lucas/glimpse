import { ReactNode } from "react";
import SessionProvider from "@/components/session-provider";
import { auth } from "@/auth";
import Background from "./_components/background";
import { getBackgrounds } from "./_components/backdrops";
import { WatchlistProvider } from "@/context/watchlist";
import { getBlurData } from "@/lib/blur-data-generator";
import { BASE_ORIGINAL_IMAGE_URL } from "@/lib/constants";

export default async function Layout({ children }: { children: ReactNode }) {
  const backdrops = await getBackgrounds();
  const session = await auth();
  let firstBackdropBlurData;

  if (backdrops.at(0))
    firstBackdropBlurData = await getBlurData(
      `${BASE_ORIGINAL_IMAGE_URL}${backdrops.at(0)}`,
    );

  return (
    <SessionProvider session={session}>
      <WatchlistProvider>
        <main className="min-h-screen">
          <div className="absolute flex left-0 top-0 h-full w-full items-center">
            <Background
              images={backdrops}
              firstBackdropBlurData={firstBackdropBlurData?.base64 ?? ""}
            />
            <div className="container items-center">
              <div>{children}</div>
            </div>
          </div>
        </main>
      </WatchlistProvider>
    </SessionProvider>
  );
}
