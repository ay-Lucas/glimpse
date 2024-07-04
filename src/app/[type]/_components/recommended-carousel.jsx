"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useMediaQuery } from "@/lib/hooks";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Card } from "@/components/card";

export function RecommendedCarousel({
  data,
  type,
  isUserAgentMobile,
  variant,
}) {
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
        duration: 30,
        watchDrag: isMobile,
      }}
    >
      <CarouselContent className="-ml-3 md:-ml-5">
        {data.map((item, i) => (
          <CarouselItem
            key={i}
            className="basis-1/2 md:basis-1/3 xl:basis-1/4 group"
            // className="pl-7 basis-auto group"
          >
            <Link href={`/${item.media_type || type}/${item.id}`}>
              <Card data={item} index={i} variant={variant} />
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="opacity-80 hover:opacity-100 w-8 h-8 ml-5 md:m-0 md:w-12 md:h-12" />
      <CarouselNext className="opacity-80 hover:opacity-100 w-8 h-8 mr-4 md:m-0 md:w-12 md:h-12" />
    </Carousel>
  );
}
