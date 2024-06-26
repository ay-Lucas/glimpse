import Image from "next/image";
import "@/styles/globals.css";
import { options } from "@/lib/utils";
import TmdbLogo from "@/../public/tmdb-logo.svg";
import { Reviews } from "../_components/reviews";

const baseUrl = "https://api.themoviedb.org/3";

async function getData(params) {
  const res = await fetch(`${baseUrl}/${params.item}/${params.id}`, options);
  return res.json();
}

async function getReviews(params) {
  const res = await fetch(
    `${baseUrl}/${params.item}/${params.id}/reviews`,
    options,
  );
  return res.json();
}

export default async function ItemPage({ params }) {
  const data = await getData(params);
  const reviews = await getReviews(params);
  // console.log(params);
  // console.log(reviews);

  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  return (
    <main className="h-screen relative">
      <div className="h-full w-full">
        <div className="absolute left-0 bottom-32 w-full h-full">
          <div className="absolute h-full w-full left-0 top-0 bg-gradient-to-t from-background from-30% via-background/95 via-40%  to-transparent" />
          <Image
            fill
            src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`}
            quality={100}
            className={`object-cover pointer-events-none -z-10`}
            alt="header image"
            priority
            sizes="100vw"
          />
        </div>
        <div className="relative container items-end h-full px-5 md:px-40 pt-16">
          <div className="md:h-[57%] flex items-end pb-5 md:pt-0">
            <div>
              <div className="flex flex-col md:flex-row h-full md:h-3/4 z-10 md:items-center md:space-x-5">
                <Image
                  quality={100}
                  width={190}
                  height={284}
                  className={`pointer-events-none rounded-xl mx-auto md:m-0 p-5 md:p-0`}
                  src={`https://image.tmdb.org/t/p/original${data.poster_path}`}
                  sizes="(max-width: 190px) 5vw, 10vw object-cover"
                  priority
                  alt="poster image"
                />
                <div className="flex flex-col justify-between space-y-1 items-center md:items-start">
                  <h2 className="text-3xl md:text-5xl font-medium text-center md:text-start">
                    {data.name || data.title}
                  </h2>
                  <div className="flex flex-row items-center justify-center md:justify-start">
                    <span className="mr-2 text-lg">
                      {`${data.vote_average && data.vote_average.toPrecision(2) * 10}%`}
                    </span>
                    <Image
                      src={TmdbLogo}
                      className="w-[30px] h-[30px]"
                      priority
                      alt="tmdb logo"
                    />
                    <div className="text-lg pl-3">
                      {data &&
                        new Date(
                          data.first_air_date || data.release_date,
                        ).toLocaleDateString(options)}
                    </div>
                  </div>
                  <div className="text-md md:text-lg font-medium">
                    {data.overview}
                  </div>
                </div>
              </div>{" "}
            </div>
          </div>
          <div className="">
            <h2 className="text-3xl pb-5 pr-3 inline-flex">Reviews</h2>
            <span className="text-3xl font-light">
              ({reviews.results.length})
            </span>
            <div className="space-y-3">
              {reviews.results.map((reviews, index) => (
                <Reviews data={reviews} key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
