import { Inter as FontSans } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { TopNav } from "@/components/top-nav";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/react";
import { SupabaseProvider } from "@/context/supabase";
import { Toaster } from "sonner";
import { WatchlistProvider } from "@/context/watchlist";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MobileNav } from "@/components/mobile-nav";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Glimpse",
  description: "Discover new Movies & TV Shows",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <SupabaseProvider>
          <WatchlistProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider>
                <SidebarProvider>
                  <div className="h-full w-screen">
                    <section className="fixed left-3 top-2 z-50 md:hidden">
                      <SidebarTrigger />
                    </section>
                    <TopNav />
                    <MobileNav />
                    {children}
                    <Toaster />
                    <Analytics />
                    <Footer />
                  </div>
                </SidebarProvider>
              </TooltipProvider>
            </ThemeProvider>
          </WatchlistProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
