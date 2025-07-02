import ImageCarousel from "@/components/image-carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BASE_POSTER_IMAGE_URL } from "@/lib/constants";
import { Episode } from "@/types/request-types-snakecase";
import Image from "next/image";

export interface EpisodeWithBlur extends Episode {
  blurDataURL: string;
}

export function SeasonAccordion({
  number,
  episodesData,
}: {
  number: number;
  episodesData: Array<EpisodeWithBlur>;
}) {
  return (
    <Accordion
      type="single"
      collapsible
      className="rounded-2xl bg-secondary/40 px-3"
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
                    src={`${BASE_POSTER_IMAGE_URL}${item.still_path}`}
                    alt={`Item image`}
                    quality={75}
                    className={`rounded-xl object-cover pb-2`}
                    blurDataURL={(item as any).blurDataURL}
                    loading="lazy"
                    placeholder="blur"
                  />
                )}
                <div>
                  <span className="text-xl">{item.episode_number}. </span>
                  <span className="text-xl">{item.name}</span>
                </div>
                <div className="text-base text-gray-400">{item.overview}</div>
              </div>
            ))}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
