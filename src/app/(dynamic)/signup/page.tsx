import { SignUpForm } from "@/components/signup-form";
import { auth } from "@/db/auth";
export default async function SignIn() {
  const session = await auth();
  if (!session) {
    console.log(session);
  }
  return <SignUpForm />;
}
