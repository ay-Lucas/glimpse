import { ReactNode } from "react";
import SessionProvider from "@/components/session-provider";
import { auth } from "@/db/auth";
import { Background } from "./signin/_components/background";
import { getBackgrounds } from "./signin/_components/backdrops";

export default async function Layout({ children }: { children: ReactNode }) {
  const backdrops = await getBackgrounds();
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <main className="absolute flex left-0 top-0 h-full w-full items-center">
        <Background images={backdrops} />
        <div className="container items-center">
          {/* <h1 className="font-extrabold text-7xl">Glimpse</h1> */}
          <div>{children}</div>
        </div>
      </main>
    </SessionProvider>
  );
}
