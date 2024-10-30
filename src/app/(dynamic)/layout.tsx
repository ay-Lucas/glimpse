import { ReactNode } from "react";
import SessionProvider from "@/components/session-provider";
import { auth } from "@/auth";
import { Background } from "./_components/background";
import { getBackgrounds } from "./_components/backdrops";

export default async function Layout({ children }: { children: ReactNode }) {
  const backdrops = await getBackgrounds();
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <main className="absolute flex left-0 top-0 h-full w-full items-center">
        <Background images={backdrops} />
        <div className="container items-center">
          <div>{children}</div>
        </div>
      </main>
    </SessionProvider>
  );
}
