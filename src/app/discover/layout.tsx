export const metadata = {
  title: "Glimpse",
  description: "Discover new Movies & TV Shows",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
