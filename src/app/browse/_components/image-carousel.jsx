import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Card } from "./card";
import Link from "next/link";

export function ImageCarousel({ data, title }) {
  return (
    <Carousel
      className="relative block mx-auto w-11/12"
      opts={{
        slidesToScroll: 5,
        align: "start",
        duration: 15,
        watchDrag: false,
      }}
    >
      <h2 className="pb-4 pl-6 text-xl font-bold">{title}</h2>
      <CarouselContent className="-ml-1">
        {data.map((item, i) => (
          <CarouselItem key={i} className="pl-7 basis-auto group">
            <Link
              href={`/${item.media_type}/${item.id}`}
              // href={
              //   item.media_type === "tv"
              //     ? `/tv/${item.id}`
              //     : `/movie/${item.id}`
              //}
            >
              <Card
                data={item}
                index={i}
                variant={title === "Trending" ? "numbered" : "default"}
              />
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
