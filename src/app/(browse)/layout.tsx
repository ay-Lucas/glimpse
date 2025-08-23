import { ReactNode, Suspense } from "react";
import { MediaProvider } from "@/context/media";
import { ToastListener } from "./discover/_components/discover-toast-listener";

export default async function BrowseLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <MediaProvider>
      <Suspense>
        <ToastListener />
      </Suspense>
      <main className="mx-auto w-full max-w-[1920px]">
        <div className="space-y-3 overflow-hidden px-1 sm:py-6 md:px-5 lg:px-10">
          {children}
        </div>
      </main>
    </MediaProvider>
  );
}
