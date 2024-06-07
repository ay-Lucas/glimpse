import { Inter } from "next/font/google";
import "./globals.css";
import { TopNav } from "./_components/topnav";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TopNav />
        <SideNav />
        {children}
      </body>
    </html>
  );
}
