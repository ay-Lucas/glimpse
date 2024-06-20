import { TopNav } from "./_components/browse-topnav";

export const metadata = {
  title: "Glimpse",
  description: "Discover new Movies & TV Shows",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* <TopNav /> */}
        {children}
      </body>
    </html>
  );
}
