"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperCore, SwiperOptions } from "swiper/types";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { FreeMode, Navigation, Virtual } from "swiper/modules";
import "swiper/css";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ImageCarouselProps {
  title?: ReactNode | string;
  titleString?: string;
  variant?: string;
  userAgent?: string | null;
  breakpoints?: "default" | "page" | "cast" | "taggedImages";
  className?: string;
  loading?: "lazy" | "eager";
  items: Array<ReactNode>;
}

const carouselBreakpoints: {
  default: {
    [width: number]: SwiperOptions;
    [ratio: string]: SwiperOptions;
  };
  page: {
    [width: number]: SwiperOptions;
    [ratio: string]: SwiperOptions;
  };
  cast: {
    [width: number]: SwiperOptions;
    [ratio: string]: SwiperOptions;
  };
  taggedImages: {
    [width: number]: SwiperOptions;
    [ratio: string]: SwiperOptions;
  };
} = {
  default: {
    // 300: {
    //   slidesPerView: 1,
    //   slidesPerGroup: 1,
    //   spaceBetween: 20,
    //   speed: 500,
    //   cssMode: true,
    //   slidesOffsetBefore: 0,
    // },
    100: {
      slidesPerView: 2,
      slidesPerGroup: 1,
      spaceBetween: 20,
      speed: 500,
      cssMode: true,
      slidesOffsetBefore: 0,
    },
    700: {
      slidesPerView: 3,
      slidesPerGroup: 1,
      spaceBetween: 30,
      cssMode: true,
    },
    1000: {
      slidesPerView: 4,
      slidesPerGroup: 1,
      spaceBetween: 30,
      cssMode: true,
    },
    1260: {
      slidesPerView: 5,
      slidesPerGroup: 5,
      spaceBetween: 30,
    },
    1500: {
      slidesPerView: 6,
      slidesPerGroup: 6,
      spaceBetween: 30,
    },
    1750: {
      slidesPerView: 7,
      slidesPerGroup: 4,
      spaceBetween: 10,
    },
  },
  page: {
    100: {
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: 10,
      cssMode: true,
    },
    650: {
      slidesPerView: 3,
      slidesPerGroup: 3,
      spaceBetween: 10,
      cssMode: true,
    },
    1300: {
      slidesPerView: 4,
      slidesPerGroup: 4,
      spaceBetween: 10,
    },
  },
  cast: {
    // 200: {
    //   slidesPerView: 2,
    //   slidesPerGroup: 2,
    //   spaceBetween: 10,
    //   cssMode: true,
    // },
    200: {
      slidesPerView: 3,
      slidesPerGroup: 3,
      spaceBetween: 10,
      cssMode: true,
    },
    600: {
      slidesPerView: 4,
      slidesPerGroup: 4,
      spaceBetween: 10,
      cssMode: true,
    },
    800: {
      slidesPerView: 5,
      slidesPerGroup: 5,
      spaceBetween: 10,
      cssMode: true,
    },
    1200: {
      slidesPerView: 6,
      slidesPerGroup: 3,
      spaceBetween: 10,
    },
  },
  taggedImages: {
    100: {
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: 10,
      cssMode: true,
    },
    650: {
      slidesPerView: 3,
      slidesPerGroup: 3,
      cssMode: true,
    },
    900: {
      slidesPerView: 3,
      slidesPerGroup: 3,
      cssMode: true,
    },

    1300: {
      slidesPerView: 3,
      slidesPerGroup: 3,
    },
  },
};

export default function ImageCarousel({
  title,
  titleString,
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

  useEffect(() => {});

  let breakpointsOption: {
    [width: number]: SwiperOptions;
    [ratio: string]: SwiperOptions;
  };

  switch (breakpoints) {
    case "page":
      breakpointsOption = carouselBreakpoints.page;
      break;
    case "cast":
      breakpointsOption = carouselBreakpoints.cast;
      break;
    case "taggedImages":
      breakpointsOption = carouselBreakpoints.taggedImages;
      break;
    default:
      breakpointsOption = carouselBreakpoints.default;
      break;
  }

  const handleBreakpointChange = (event: SwiperCore) => {
    if (event.currentBreakpoint <= 900) swiperRef.current?.disable();
    else if (event.currentBreakpoint > 900) swiperRef.current?.enable();
  };

  return (
    <div className={`${className ?? ""}`}>
      <div className="flex justify-between space-x-2">
        {title ? (
          title
        ) : (
          <h2 className={`pr-2 text-xl font-bold sm:pl-2 sm:text-2xl`}>
            {titleString}
          </h2>
        )}
        <div className={`hidden whitespace-nowrap pr-5 lg:flex`}>
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
        onBreakpoint={handleBreakpointChange}
        breakpoints={breakpointsOption}
        lazyPreloadPrevNext={3}
        modules={[Navigation, FreeMode, Virtual]}
        className="mySwiper !-ml-2 min-w-[500px] !pl-2 sm:min-w-[768px]"
        watchSlidesProgress={true}
      >
        {items.map((item: ReactNode, i: number) => (
          <SwiperSlide key={i} className={`group px-0 py-2`} virtualIndex={i}>
            {item}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
