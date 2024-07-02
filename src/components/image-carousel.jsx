"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { Card } from "@/components/card";
import { useState, useEffect } from "react";
import { useMediaQuery } from "@/lib/hooks";

export function ImageCarousel({ data, type, isUserAgentMobile, variant }) {
  const isMobile = useMediaQuery(768);
  const [slidesToScroll, setSlidesToScroll] = useState(
    isUserAgentMobile ? "auto" : 4,
  );
  useEffect(() => {
    isMobile ? setSlidesToScroll("auto") : setSlidesToScroll(4);
  }, [isMobile]);

  return (
    <Carousel
      opts={{
        slidesToScroll: slidesToScroll,
        align: "start",
        duration: 25,
        watchDrag: isMobile,
      }}
    >
      <CarouselContent className="-ml-3">
        {data.map((item, i) => (
          <CarouselItem
            key={i}
            className="basis-1/2 md:basis-1/3 lg:basis-1/5 xl:basis-[12.5%] group"
            // className="pl-7 basis-auto group"
          >
            <Link href={`/${item.media_type || type}/${item.id}`}>
              <Card data={item} index={i} variant={variant} />
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="opacity-80 hover:opacity-100 w-8 h-8 p-1 md:p-0 ml-5 md:m-0 md:w-12 md:h-12" />
      <CarouselNext className="opacity-80 hover:opacity-100 w-8 h-8 mr-4 p-1 md:p-0 md:m-0 md:w-12 md:h-12" />
    </Carousel>
  );
}
