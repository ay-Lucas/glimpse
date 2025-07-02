import { ReactNode } from "react";

export const revalidate = 43200; // 12 hours

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      {children}
    </main>
  );
}
