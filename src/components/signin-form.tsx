import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signin } from "@/lib/actions";

export async function SignInForm() {
  return (
    <form
      action={async (formData) => {
        "use server";
        await signin("credentials", formData);
      }}
      className="flex flex-col space-y-3"
    >
      <span className="font-bold text-2xl">Sign in</span>
      <Input
        required
        name="email"
        type="email"
        placeholder="Email"
        className="bg-gray-600 border-gray-500"
      />
      <Input
        required
        name="password"
        type="password"
        placeholder="Password"
        className="bg-gray-600 border-gray-500"
      />
      <Button variant="secondary">Sign in</Button>
      <div className="border-b-gray-500 border-b" />
    </form>
  );
}
