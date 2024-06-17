import { ImageCarousel } from "./_components/image-carousel";
// import { getBackgrounds } from "@/components/backdrops";
import { getBackgrounds } from "./_components/posters";

export default async function HomePage() {
  const posters = await getBackgrounds();
  const both = posters.both;
  const tv = posters.tv;
  const movies = posters.movies;
  return (
    <main className="mt-1">
      <div className="mx-auto space-y-4 overflow-visible">
        {/* <h2 className="lg:ml-20 ml-0">Trending</h2> */}
        <ImageCarousel images={both} title="Trending" />
        <ImageCarousel images={tv} title="TV Shows" />
        <ImageCarousel images={movies} title="Movies" />
      </div>
    </main>
  );
}
