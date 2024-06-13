import { Inter as FontSans } from "next/font/google";
import "@/styles/globals.css";
import { TopNav } from "./_components/topnav";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Glimpse",
  description: "TV and Movie recommendations",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TopNav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
