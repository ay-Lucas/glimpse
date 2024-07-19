"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperCore } from "swiper/types";
import { ReactNode, useEffect, useRef, useState } from "react";
import { FreeMode, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "@/styles/globals.css";

export interface ImageCarouselProps {
  type: "tv" | "movie" | "person" | "tv-page" | "person-page";
  title?: string;
  variant?: string;
  userAgent?: string | null;
  breakpoints?: "default" | "page";
  className?: string;
  loading?: "lazy" | "eager";
  items: Array<ReactNode>;
}

const carouselBreakpoints = {
  default: {
    300: {
      slidesPerView: 2,
      slidesPerGroup: 1,
      spaceBetween: 20,
      speed: 500,
      cssMode: true,
      slidesOffsetBefore: 0,
    },
    500: {
      slidesPerView: 3,
      slidesPerGroup: 1,
      spaceBetween: 30,
      cssMode: true,
    },
    868: {
      slidesPerView: 4,
      slidesPerGroup: 1,
      spaceBetween: 30,
      cssMode: true,
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
  page: {
    350: {
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: 10,
      cssMode: true,
    },
    500: {
      slidesPerView: 3,
      slidesPerGroup: 3,
      spaceBetween: 10,
      cssMode: true,
    },
    1200: {
      slidesPerView: 4,
      slidesPerGroup: 4,
      spaceBetween: 10,
    },
  },
};

export function ImageCarousel({
  title,
  userAgent,
  className,
  breakpoints = "default",
  items,
}: ImageCarouselProps) {
  const swiperRef = useRef<SwiperCore>();
  const [isPrevDisabled, setPrevDisabled] = useState(true);
  const [isNextDisabled, setNextDisabled] = useState(false);

  const handleSlideChange = () => {
    if (swiperRef.current?.isBeginning) setPrevDisabled(true);
    else if (swiperRef.current?.isEnd) setNextDisabled(true);
    else {
      setPrevDisabled(false);
      setNextDisabled(false);
    }
  };

  useEffect(() => {
    if (swiperRef.current?.isLocked) {
      setNextDisabled(true);
      setPrevDisabled(true);
    }
  }, []);

  return (
    <>
      <div className={`${className ?? ""}`}>
        <div className="space-x-2 flex justify-between pb-2">
          <h2 className={`text-2xl font-bold pb-3 ml-6 md:ml-7`}>
            {title && title}
          </h2>
          <div className="whitespace-nowrap opacity-0 lg:opacity-100">
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
          breakpoints={
            breakpoints === "page"
              ? carouselBreakpoints.page
              : carouselBreakpoints.default
          }
          lazyPreloadPrevNext={3}
          modules={[Navigation, FreeMode]}
          className="mySwiper"
          style={{ overflow: "visible" }}
        >
          {items.map((item: ReactNode, i: number) => (
            <SwiperSlide key={i} className="group">
              {item}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
