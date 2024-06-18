import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Card } from "./card";

export function ImageCarousel({ data, title }) {
  return (
    <Carousel
      className="relative block mx-auto w-11/12 "
      opts={{
        slidesToScroll: 5,
        watchDrag: false,
      }}
    >
      <h2 className="pb-4 text-xl font-bold">{title}</h2>
      <CarouselContent className="-ml-1">
        {data.map((item, i) => (
          <CarouselItem
            key={i}
            className="pr-4 md:basis-1/6 lg:basis-[14%] sm:basis-1/3 hover:scale-110 transition duration-200  "
          >
            <Card data={item} index={i} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
