"use client";
import Link from "next/link";
import { Card } from "@/components/card";
import { MovieResult, PersonResult, TvResult } from "@/types/request-types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperCore } from "swiper/types";
import { SwiperOptions } from "swiper/types";
import { useRef, useState } from "react";
import { FreeMode, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ImageCarouselProps {
  data: Array<MovieResult | TvResult | PersonResult>;
  type: string;
  title: string;
  variant?: string;
  userAgent?: string | null;
  customBreakPoints?: {
    [width: number]: SwiperOptions;
    [ratio: string]: SwiperOptions;
  };
  className?: string;
  loading?: "lazy" | "eager";
}

const defaultBreakpoints: SwiperOptions = {
  breakpoints: {
    300: {
      slidesPerView: 2,
      slidesPerGroup: 1,
      spaceBetween: 20,
      speed: 500,
      cssMode: true,
    },
    600: {
      slidesPerView: 3,
      slidesPerGroup: 1,
      spaceBetween: 30,
      cssMode: true,
    },
    868: {
      slidesPerView: 4,
      slidesPerGroup: 4,
      spaceBetween: 30,
    },
    1100: {
      slidesPerView: 5,
      slidesPerGroup: 5,
      spaceBetween: 30,
    },
    1300: {
      slidesPerView: 6,
      slidesPerGroup: 6,
      spaceBetween: 30,
    },
    1500: {
      slidesPerView: 7,
      slidesPerGroup: 4,
      spaceBetween: 10,
    },
  },
};

export function ImageCarousel({
  data,
  type,
  title,
  variant,
  userAgent,
  customBreakPoints,
  className,
  loading = "lazy",
}: ImageCarouselProps) {
  const swiperRef = useRef<SwiperCore>();
  const [isPrevDisabled, setPrevDisabled] = useState(true);
  const [isNextDisabled, setNextDisabled] = useState(false);
  const [breakPoints, setBreakPoints] = useState(
    customBreakPoints ?? defaultBreakpoints.breakpoints,
  );

  const handleSlideChange = () => {
    if (swiperRef.current?.isBeginning) setPrevDisabled(true);
    else if (swiperRef.current?.isEnd) setNextDisabled(true);
    else {
      setPrevDisabled(false);
      setNextDisabled(false);
    }
  };

  return (
    <>
      <div className={`${className ?? ""} overflow-visible`}>
        <div className="space-x-2 flex justify-between pb-2">
          <h2 className={`text-2xl font-bold pb-3 md:pl-7`}>{title}</h2>
          <div className="whitespace-nowrap">
            <Button
              size="icon"
              variant="ghost"
              className={`transition-opacity ${isPrevDisabled ? "opacity-30" : "opacity-100"}`}
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <ChevronLeft />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className={`transition-opacity ${isNextDisabled ? "opacity-30" : "opacity-100"}`}
              onClick={() => swiperRef.current?.slideNext()}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
        <Swiper
          slidesPerView={1}
          speed={750}
          spaceBetween={10}
          freeMode={{
            enabled: true,
            sticky: false,
            momentumRatio: 1,
            momentumBounceRatio: 1,
          }}
          simulateTouch={false}
          userAgent={userAgent}
          onSlideChange={handleSlideChange}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          breakpoints={breakPoints}
          lazyPreloadPrevNext={3}
          modules={[Navigation, FreeMode]}
          className="mySwiper"
          style={{ overflow: "visible" }}
        >
          {data.map(
            (item: MovieResult | TvResult | PersonResult, i: number) => (
              <SwiperSlide key={i} className="group">
                <Link href={`/${type}/${item.id}`}>
                  <Card
                    data={item}
                    index={i}
                    variant={variant}
                    loading={loading}
                  />
                </Link>
              </SwiperSlide>
            ),
          )}
        </Swiper>
      </div>
    </>
  );
}
