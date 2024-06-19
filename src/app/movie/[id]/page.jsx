import Image from "next/image";
import { options } from "@/lib/utils";
const baseUrl = "https://api.themoviedb.org/3";
async function getData(id) {
  const res = await fetch(`${baseUrl}/movie/${id}`, options);
  return res.json();
}

export default async function Movie({ params }) {
  const data = await getData(params.id);
  console.log(data);
  return (
    <main className="w-full h-full overflow-auto flex-grow">
      <div className="z-[-1] absolute top-0 left-0 w-full h-full duration-300 ease-in overflow-hidden bg-gradient-to-t bg-blend-overlay from-gray-900 to-gray-950">
        <div className="absolute top-0 left-0 w-full h-full opacity-40">
          <Image
            fill
            src={`https://image.tmdb.org/t/p/original${data.poster_path}`}
            quality={100}
            className={`object-cover pointer-events-none`}
          />
        </div>
      </div>
      <div className="flex mx-auto z-1">
        <div className="text-xl">{data.title}</div>
        <div className="text-md">{data.overview}</div>
        <div className="w-80 h-40"></div>
      </div>
    </main>
  );
}
