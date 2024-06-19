import Image from "next/image";
import { options } from "@/lib/utils";
const baseUrl = "https://api.themoviedb.org/3";
async function getData(id) {
  const res = await fetch(`${baseUrl}/tv/${id}`, options);
  return res.json();
}

export default async function Tv({ params }) {
  const data = await getData(params.id);
  console.log(data);
  return (
    <main className="w-full h-full flex-grow overflow-auto">
      <div className="flex mx-auto">
        <div className="text-xl">{data.title}</div>
        <div className="text-md">{data.overview}</div>
        <div className="w-80 h-40">
          <div className="absolute top-0 left-0 w-full h-full duration-300 ease-in overflow-hidden bg-gradient-to-t bg-blend-overlay from-gray-200 to-gray-950">
            <div className="absolute top-0 left-0 w-full h-full opacity-50">
              <Image
                fill
                src={`https://image.tmdb.org/t/p/original${data.poster_path}`}
                quality={100}
                sizes="100vw"
                className={`object-cover `}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
