import { Star } from "lucide-react";
import Link from "next/link";
import { ReviewI } from "@/types/request-types-snakecase";
import { Expandable } from "./expandable";

export function Review({ data }: { data: ReviewI }) {
  return (
    // < div className="rounded-md border px-4 py-2 text-md backdrop-blur" >
    <div className="media-card border-gray-300/30">
      <div className="">
        {data.url && (
          <Link href={data.url}>
            <span className="text-xl">{data.author}</span>
          </Link>
        )}
        {data.author_details?.rating && (
          <span className="text-md flex pt-1">
            <div className="flex items-center pr-1">
              <span className="pr-1">
                <Star size={15} />
              </span>
              {`${data.author_details.rating * 10}%`}
            </div>
          </span>
        )}
      </div>
      <Expandable>{data.content}</Expandable>
    </div>
  );
}
