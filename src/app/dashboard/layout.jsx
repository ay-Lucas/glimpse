import { TopNav } from "@components/topnav";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TopNav />
        <SideNav />
        {children}
      </body>
    </html>
  );
}
