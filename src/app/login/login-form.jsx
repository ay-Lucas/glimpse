import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export function LoginForm() {
  return (
    <div className="mt-20 sm:mx-auto sm:w-full sm:max-w-sm bg-gray-800/80 px-14 py-8 rounded-lg">
      <div className="flex flex-col space-y-3">
        <span className="font-bold text-2xl">Sign in</span>
        <Input type="username" placeholder="Username" />
        <Input type="password" placeholder="Password" />
        <Button>Sign in</Button>
      </div>
    </div>
  );
}
