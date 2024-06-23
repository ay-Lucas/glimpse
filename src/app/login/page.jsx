import { LoginForm } from "@/components/login-form";
import { Background } from "@/components/background";
import { getBackgrounds } from "@/components/backdrops";

export default async function Login() {
  const backdrops = await getBackgrounds();
  return (
    <main className="absolute flex left-0 top-0 h-full w-full items-center">
      <Background images={backdrops} />
      <div className="container items-center">
        <h1 className="font-extrabold text-7xl">Glimpse</h1>
        <LoginForm />
      </div>
    </main>
  );
}
