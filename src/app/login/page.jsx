import { LoginForm } from "./login-form";
export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <main className="flex flex-col">
      <LoginForm />
    </main>
  );
}
