import { permanentRedirect } from "next/navigation";
export default async function HomePage() {
  function redirect() {
    permanentRedirect("/browse");
  }
  redirect();
  return (
    <main className="relative">
      <div className="relative flex h-screen flex-col md:flex-row md:overflow-hidden"></div>
    </main>
  );
}
