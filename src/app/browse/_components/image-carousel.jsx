import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function ImageCarousel({ images, title }) {
  return (
    <Carousel
      className="block mx-auto w-11/12 "
      opts={{
        slidesToScroll: 5,
        watchDrag: false,
      }}
    >
      <h2 className="pb-4 text-xl font-bold">{title}</h2>
      <CarouselContent className="-ml-1">
        {images.map((url, i) => (
          <CarouselItem
            key={i}
            className="pl-1 pr-4 md:basis-1/6 lg:basis-[14%] sm:basis-1/3 transform-gpu hover:opacity-75 transition duration-200 hover:scale-110 "
          >
            <Image
              width={220}
              height={330}
              src={`${url}`}
              alt={`Background image ${i + 1}`}
              key={i}
              quality={50}
              sizes="(max-width: 768px) 100vw, 33vw"
              className={`transition duration-200 rounded-xl`}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
