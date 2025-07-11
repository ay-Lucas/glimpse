import { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MediaProvider } from "@/context/media";

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <MediaProvider>
      <TooltipProvider>
        <div className="min-h-screen">{children}</div>
      </TooltipProvider>
    </MediaProvider>
  );
}
