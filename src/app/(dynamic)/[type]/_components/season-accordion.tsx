"use client";
import { ImageCarousel } from "@/components/image-carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Episode,
  EpisodeGroupResponse,
  EpisodeRequest,
  EpisodeResult,
  EpisodeResultsResponse,
} from "@/types/request-types";
import Image from "next/image";
import { useState } from "react";

export function SeasonAccordion({
  number,
  episodesData,
}: {
  number: number;
  episodesData: Array<Episode>;
}) {
  const [isImageLoading, setImageLoading] = useState(true);
  return (
    <Accordion
      type="single"
      collapsible
      className="bg-secondary/40 rounded-2xl px-3"
    >
      <AccordionItem value="item-1" className="text-lg">
        <AccordionTrigger>Season {number}</AccordionTrigger>
        <AccordionContent>
          <ImageCarousel
            breakpoints="page"
            items={episodesData.map((item, index) => (
              <div className="pr-2" key={index}>
                {item.still_path && (
                  <Image
                    width={300}
                    height={150}
                    src={`https://image.tmdb.org/t/p/original/${item.still_path}`}
                    alt={`Item image`}
                    onLoad={() => setImageLoading(false)}
                    quality={75}
                    className={`object-cover pb-2 rounded-xl transition ${isImageLoading ? "blur-img" : "remove-blur"}`}
                    // blurDataURL={blurData}
                    // placeholder="blur"
                  />
                )}
                <div>
                  <span className="text-xl">{item.episode_number}. </span>
                  <span className="text-xl">{item.name}</span>
                </div>
                <div className="text-base">{item.overview}</div>
              </div>
            ))}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
