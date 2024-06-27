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
}) {
  const isMobile = useMediaQuery(768);
  const [slidesToScroll, setSlidesToScroll] = useState(
    isUserAgentMobile ? 2 : 5,
  );
  useEffect(() => {
    isMobile ? setSlidesToScroll(2) : setSlidesToScroll(5);
  }, [isMobile]);

  return (
    <Carousel
      className="relative block mx-auto w-11/12"
      opts={{
        slidesToScroll: slidesToScroll,
        align: "start",
        duration: 15,
        watchDrag: false,
      }}
    >
      <h2 className="pb-4 pl-6 md:pl-0 text-xl font-medium">{title}</h2>
      <CarouselContent className="-ml-1 md:-ml-14">
        {data.map((item, i) => (
          <CarouselItem key={i} className="pl-7 basis-auto group">
            <Link href={`/${item.media_type || type}/${item.id}`}>
              <Card data={item} index={i} variant={variant} />
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="md:ml-0 ml-8 mt-4 opacity-80 hover:opacity-100" />
      <CarouselNext className="lg:mr-0 mr-9 mt-4 opacity-80 hover:opacity-100" />
    </Carousel>
  );
}
