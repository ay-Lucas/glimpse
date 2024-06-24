"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";
export function Reviews({ data }) {
  const ref = useRef(null);
  const CLAMPED_CLIENT_HEIGHT = 96;
  const [isOpen, setIsOpen] = useState(false);
  const [isExpandable, setExpandable] = useState(false);

  const handleIsOpen = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    setExpandable(
      ref.current && ref.current.clientHeight >= CLAMPED_CLIENT_HEIGHT,
    );
  }, [ref]);
  return (
    <div className="rounded-md border px-4 pt-2 pb-2 text-md backdrop-blur ">
      <div className="pb-1">
        <Link href={data.url}>
          <span className="text-xl">{data.author}</span>
        </Link>
        {data.author_details.rating && (
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
      <div
        className={`text-md text-start leading-6 line-clamp-4 select-text ${isOpen ? "line-clamp-none" : "mb-0"}`}
        ref={ref}
      >
        {data.content}
      </div>
      {isExpandable && (
        <button onClick={handleIsOpen}>
          <ChevronDown
            className={`absolute dark:brightness-50 right-2 bottom-1 ease-in-out transition-transform duration-300 ${isOpen ? "rotate-180" : ""} ${ref.current && ref.current.clientHeight >= CLAMPED_CLIENT_HEIGHT ? "visible" : "hidden"}`}
          />
        </button>
      )}
    </div>
  );
}
