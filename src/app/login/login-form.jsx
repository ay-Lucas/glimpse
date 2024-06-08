import { Input } from "@/components/ui/input";
export function LoginForm() {
  return (
    <div className="mt-20 sm:mx-auto sm:w-full sm:max-w-md space-y-3 bg-gray-800/80 p-5 rounded-lg">
      <span className="font-bold text-lg">Log in to Glimpse</span>
      <Input type="username" placeholder="username" />
      <Input type="password" placeholder="password" />
    </div>
  );
}
