import { SignInForm } from "@/components/signin-form";
import { Background } from "./_components/background";
import { getBackgrounds } from "./_components/backdrops";

export default async function SignIn() {
  const backdrops = await getBackgrounds();
  return (
    <main className="absolute flex left-0 top-0 h-full w-full items-center">
      <Background images={backdrops} />
      <div className="container items-center">
        <h1 className="font-extrabold text-7xl">Glimpse</h1>
        <SignInForm />
      </div>
    </main>
  );
}
