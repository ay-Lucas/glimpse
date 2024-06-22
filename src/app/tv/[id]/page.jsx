import Image from "next/image";
import "@/styles/globals.css";
import { options } from "@/lib/utils";
import TmdbLogo from "@/../public/tmdb-logo.svg";
const baseUrl = "https://api.themoviedb.org/3";
async function getData(id) {
  const res = await fetch(`${baseUrl}/tv/${id}`, options);
  return res.json();
}

export default async function Tv({ params }) {
  const data = await getData(params.id);
  console.log(data);
  return (
    <main>
      <div className="absolute left-0 top-0 h-full w-full">
        <div className="relative h-[500px]">
          <div className="absolute h-full w-full left-0 top-0 bg-gradient-to-t from-background to-transparent" />
          <Image
            fill
            src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`}
            quality={100}
            className={`object-cover pointer-events-none z-[-1]`}
            priority
            alt="background image"
          />
        </div>
      </div>
      <div className="relative container px-60 items-end h-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 z-10 mt-72">
          <div className="col-span-1">
            <Image
              quality={100}
              width={200}
              height={300}
              priority
              className={`pointer-events-none rounded-xl object-cover`}
              src={`https://image.tmdb.org/t/p/original${data.poster_path}`}
              alt="poster image"
            />
          </div>
          <div className="col-span-3">
            <h2 className="text-4xl">{data.name}</h2>
            <div className="flex flex-row items-center">
              <span className="mr-3 text-lg">
                {data.vote_average.toPrecision(2)}
              </span>
              <Image
                src={TmdbLogo}
                className="w-[30px] h-[30px]"
                priority
                alt="tmdb logo"
              />
            </div>
            <div className="text-lg">{data.overview}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
