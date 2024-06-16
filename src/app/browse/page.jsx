import { ImageCarousel } from "./_components/image-carousel";
import { getBackgrounds } from "@/components/backdrops";

export default async function HomePage() {
  const thumbnails = await getBackgrounds();
  return (
    <main className="w-full mx-auto space-y-5">
      <ImageCarousel images={thumbnails} />
      <ImageCarousel images={thumbnails} />
      <ImageCarousel images={thumbnails} />
    </main>
  );
}
