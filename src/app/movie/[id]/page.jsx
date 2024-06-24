import Image from "next/image";
import "@/styles/globals.css";
import { options } from "@/lib/utils";
import TmdbLogo from "@/../public/tmdb-logo.svg";
import { Review } from "@/components/review";
const baseUrl = "https://api.themoviedb.org/3";
async function getData(id) {
  const res = await fetch(`${baseUrl}/movie/${id}`, options);
  return res.json();
}

async function getReviews(id) {
  const res = await fetch(`${baseUrl}/movie/${id}/reviews`, options);
  return res.json();
}

export default async function Movie({ params }) {
  const data = await getData(params.id);
  const reviews = await getReviews(params.id);
  console.log(reviews);

  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  // console.log(reviews);
  return (
    <main>
      <div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute h-full w-full left-0 top-0 bg-gradient-to-t from-background from-30%" />
          <Image
            fill
            src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`}
            quality={100}
            className={`object-cover pointer-events-none z-[-1]`}
            alt="header image"
            priority
            sizes="100vw"
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
              className={`pointer-events-none rounded-xl object-cover`}
              src={`https://image.tmdb.org/t/p/original${data.poster_path}`}
              priority
              alt="poster image"
            />
          </div>
          <div className="col-span-3">
            <h2 className="text-4xl">{data.title}</h2>
            <div className="flex flex-row items-center">
              <span className="mr-2 text-lg">
                {`${data && data.vote_average.toPrecision(2) * 10}%`}
              </span>
              <Image
                src={TmdbLogo}
                className="w-[30px] h-[30px]"
                priority
                alt="tmdb logo"
              />
              <div className="text-lg pl-3">
                {data &&
                  new Date(data.release_date).toLocaleDateString(options)}
              </div>
            </div>
            <div className="text-lg">{data.overview}</div>
          </div>
        </div>
        <div className="pt-5">
          <h2 className="text-3xl pb-5 pr-3 inline-flex">Reviews</h2>
          <span className="text-3xl font-light">
            ({reviews.results.length})
          </span>
          <div className="space-y-3">
            {reviews.results.map((review, index) => (
              <Review review={review} key={index} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
