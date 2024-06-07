import { LoginButton } from "./loginbutton";

export function TopNav() {
  return (
    <nav className="flex w-full items-center justify-between border-b p-4 text-xl font-semibold">
      <div>Glimpse</div>
      <LoginButton />
    </nav>
  );
}
