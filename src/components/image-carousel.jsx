"use client";
// import dynamic from "next/dynamic";
import { useMediaQuery } from "@/lib/hooks";
import { Card } from "./card";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

export function ImageCarousel({
  data,
  title,
  isMobile: isUserAgentMobile,
  type,
  variant,
  size,
  className,
}) {
  const isMobile = useMediaQuery(768);
  const [slidesToScroll, setSlidesToScroll] = useState(
    isUserAgentMobile ? 2 : 5,
  );
  useEffect(() => {
    isMobile ? setSlidesToScroll(2) : setSlidesToScroll(5);
  }, [isMobile]);

  return (
    <>
      <h2
        className={`pb-1 ${size === "small" ? "md:pl-1 pb-4" : "md:pl-14"} pl-6 text-xl font-semibold`}
      >
        {title}
      </h2>
      <Carousel
        className={`relative block mx-auto w-11/12 ${className}`}
        opts={{
          slidesToScroll: slidesToScroll,
          align: "start",
          duration: 15,
          watchDrag: false,
        }}
      >
        <CarouselContent className="-ml-1 md:-ml-14">
          {data.map((item, i) => (
            <CarouselItem key={i} className="pl-7 basis-auto group">
              <Link href={`/${item.media_type || type}/${item.id}`}>
                <Card data={item} index={i} variant={variant} />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        {size === "small" ? (
          <>
            <CarouselPrevious
              className={`ml-12 lg:ml-5 md:ml-0 opacity-80 hover:opacity-100`}
            />
            <CarouselNext className="lg:mr-0 mr-5 opacity-80 hover:opacity-100" />
          </>
        ) : (
          <>
            <CarouselPrevious className="md:ml-0 ml-8 opacity-80 hover:opacity-100" />
            <CarouselNext className="lg:mr-0 mr-9 opacity-80 hover:opacity-100" />
          </>
        )}
      </Carousel>
    </>
  );
}
