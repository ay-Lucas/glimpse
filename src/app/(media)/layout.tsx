import { ReactNode } from "react";
import { MediaProvider } from "@/context/media";

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <MediaProvider>
      <div className="min-h-screen">{children}</div>
    </MediaProvider>
  );
}
