import { LoginForm } from "@/components/login-form";
import { Background } from "@/components/background";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <main className="flex flex-col">
      <Background />
      <div className="flex flex-col pt-64 space-y-10 z-10">
        <h1 className="font-extrabold text-7xl mx-auto ">Glimpse</h1>
        <LoginForm />
      </div>
    </main>
  );
}
