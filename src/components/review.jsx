"use client";
import * as React from "react";
import { Star } from "lucide-react";

export function Review({ review }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleIsOpen = () => {
    setIsOpen(!isOpen);
  };
  console.log(review.author_details);
  return (
    <div className="rounded-md border px-4 py-3 text-md">
      <div className="pb-1">
        <span className="text-xl">{review.author}</span>
        <span className="flex pt-1 text-md">
          <div className="flex pr-1 items-center">
            <Star size={20} />
          </div>
          {`${review.author_details.rating * 10}%`}
        </span>
      </div>
      <button onClick={handleIsOpen}>
        <div
          className={`text-md text-start line-clamp-4 select-text ${isOpen ? "line-clamp-none" : ""}`}
        >
          {review.content}
        </div>
      </button>
    </div>
  );
}
