"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
export function Review({ review }) {
  const ref = useRef(null);
  const CLAMPED_CLIENT_HEIGHT = 96;
  const [isOpen, setIsOpen] = useState(false);
  const [isButtonVisible, setVisible] = useState(false);
  const handleIsOpen = () => {
    console.log(ref.current.clientHeight);
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    setVisible(
      ref.current && ref.current.clientHeight >= CLAMPED_CLIENT_HEIGHT,
    );
  }, [ref]);
  return (
    <div className="rounded-md border px-4 pt-2 pb-2 text-md backdrop-blur ">
      <div className="pb-1">
        <span className="text-xl">{review.author}</span>
        <span className="flex pt-1 text-md">
          <div className="flex pr-1 items-center">
            <Star size={20} />
          </div>
          {`${review.author_details.rating * 10}%`}
        </span>
      </div>
      <div
        className={`text-md text-start leading-6 line-clamp-4 select-text ${isOpen ? "line-clamp-none" : "mb-0"}`}
        ref={ref}
      >
        {review.content}
      </div>
      {isButtonVisible && (
        <button onClick={handleIsOpen}>
          <ChevronDown
            className={`absolute dark:brightness-50 right-2 bottom-1 ease-in-out transition-transform duration-300 ${isOpen ? "rotate-180" : ""} ${ref.current && ref.current.clientHeight >= CLAMPED_CLIENT_HEIGHT ? "visible" : "hidden"}`}
          />
        </button>
      )}
    </div>
  );
}
