import { Star } from "lucide-react";
import Link from "next/link";
import { ReviewI } from "@/types/request-types-snakecase";
import { ExpandableText } from "./expandable-overview";

export function Review({ data }: { data: ReviewI }) {
  return (
    <div className="rounded-md border px-4 py-2 text-md backdrop-blur">
      <div className="">
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
      <ExpandableText>{data.content}</ExpandableText>
    </div>
  );
}
