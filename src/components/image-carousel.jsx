import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function ImageCarousel({ images }) {
  return (
    <Carousel
      className="mx-auto w-11/12 "
      opts={{
        slidesToScroll: 3,
        watchDrag: false,
        // duration: 10,
        // dragThreshold: 100,
        // dragFree: true,
      }}
    >
      {/* <CarouselContent className="pl-1 w-full"> */}
      <CarouselContent className="-ml-1">
        {/* <CarouselItem key={i} className="lg:basis-auto"> */}
        {images.map((url, i) => (
          <CarouselItem key={i} className="pl-1 md:basis-1/6 lg:basis-1/5 ">
            <Image
              width={320}
              height={180}
              src={`${url}`}
              alt={`Background image ${i + 1}`}
              key={i}
              quality={100}
              sizes="(max-width: 768px) 100vw, 33vw"
              className={`transition from-background duration-1000 rounded-xl hover:bg-gray-300`}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
