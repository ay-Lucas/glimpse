import Image from "next/image";
import { options } from "@/lib/utils";
const baseUrl = "https://api.themoviedb.org/3";
async function getData(id) {
  const res = await fetch(`${baseUrl}/movie/${id}`, options);
  return res.json();
  // const res = await fetch(`https://api.themoviedb.org/3/find/${id}`, options);
  // return res.json();
}

export default async function Movie({ params }) {
  const data = await getData(params.id);
  console.log(params.id);
  console.log(data);
  return (
    <main className="mx-auto">
      <div className="">
        <h2>{params.id}</h2>
        <Image
          fill
          src={`https://image.tmdb.org/t/p/original${data.poster_path}`}
          quality={100}
          sizes="100vw"
          className={`rounded-xl border-2 border-gray-600 object-cover`}
        />
      </div>
    </main>
  );
}
