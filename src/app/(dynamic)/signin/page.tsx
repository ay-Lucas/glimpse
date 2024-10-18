import { SignInForm } from "@/components/signin-form";
import { Background } from "./_components/background";
import { getBackgrounds } from "./_components/backdrops";
import { auth } from "@/db/auth";
export default async function SignIn() {
  const backdrops = await getBackgrounds();
  const session = await auth();
  if (!session) {
    console.log(session);
  }
  return <SignInForm />;
}
