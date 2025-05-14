import { Star } from "lucide-react";
import Link from "next/link";
import { ReviewI } from "@/types/request-types";

export function Review({ data }: { data: ReviewI }) {
  return (
    <div className="rounded-md border px-4 pt-2 pb-1 text-md backdrop-blur">
      <div className="pb-1">
        {data.url && (
          <Link href={data.url}>
            <span className="text-xl">{data.author}</span>
          </Link>
        )}
        {data.author_details?.rating && (
          <span className="flex pt-1 text-md">
            <div className="flex pr-1 items-center">
              <span className="pr-1">
                <Star size={15} />
              </span>
              {`${data.author_details.rating * 10}%`}
            </div>
          </span>
        )}
      </div>
      <div className="relative">
        <input id={data.id} type="checkbox" className="peer sr-only" />
        <p className="overflow-hidden max-h-[4.5rem] peer-checked:max-h-[1000px] transition-all duration-300 ease-in-out">
          {data.content}
        </p>
        <label
          htmlFor={data.id}
          className="py-1 text-blue-600 cursor-pointer select-none hover:underline block peer-checked:hidden peer-checked:aria-expanded:false"
          aria-expanded="true"
        >
          Read more
        </label>
        <label
          htmlFor={data.id}
          className="py-1 text-blue-600 cursor-pointer select-none hover:underline hidden peer-checked:block peer-checked:aria-expanded=true"
          aria-expanded="false"
        >
          Show less
        </label>
      </div>
    </div>
  );
}
