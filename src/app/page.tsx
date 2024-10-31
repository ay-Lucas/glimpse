import { permanentRedirect } from "next/navigation";

export default async function HomePage() {
  permanentRedirect("/discover");
}
