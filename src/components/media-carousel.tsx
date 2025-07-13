"use client";
import { Keyboard, Mousewheel, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperCore, SwiperOptions } from "swiper/types";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "@/styles/swiper.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "./ui/skeleton";

const breakpointOptions: {
  cast: {
    [width: number]: SwiperOptions;
    [ratio: string]: SwiperOptions;
  };
  poster: {
    [width: number]: SwiperOptions;
    [ratio: string]: SwiperOptions;
  };
  backdrop: {
    [width: number]: SwiperOptions;
    [ratio: string]: SwiperOptions;
  };
  title: {
    [width: number]: SwiperOptions;
    [ratio: string]: SwiperOptions;
  };
} = {
  cast: {
    "@0.00": {
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: 5,
    },
    "@0.35": {
      slidesPerView: 3,
      slidesPerGroup: 3,
      spaceBetween: 5,
    },
    "@0.45": {
      slidesPerView: 4,
      slidesPerGroup: 4,
      spaceBetween: 5,
    },
    "@0.6": {
      slidesPerView: 5,
      slidesPerGroup: 5,
      spaceBetween: 5,
    },
    "@0.75": {
      slidesPerView: 6,
      slidesPerGroup: 6,
      spaceBetween: 5,
    },
    "@1.25": {
      slidesPerView: 7,
      slidesPerGroup: 7,
      spaceBetween: 10,
    },
  },
  poster: {
    "@0.00": {
      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: 5,
    },
    "@.3": {
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: 5,
    },
    "@0.45": {
      slidesPerView: 3,
      slidesPerGroup: 3,
      spaceBetween: 5,
    },
    "@0.75": {
      slidesPerView: 4,
      slidesPerGroup: 4,
      spaceBetween: 5,
    },
    "@1.25": {
      slidesPerView: 5,
      slidesPerGroup: 5,
      spaceBetween: 10,
    },
  },
  backdrop: {
    "@0.00": {
      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: 10,
    },
    "@0.5": {
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: 20,
    },
    "@1.00": {
      slidesPerView: 3,
      slidesPerGroup: 3,
      spaceBetween: 10,
    },
  },
  title: {
    "@0.00": {
      slidesPerView: 3,
      slidesPerGroup: 3,
      spaceBetween: 10,
    },
    "@0.52": {
      slidesPerView: 4,
      slidesPerGroup: 4,
      spaceBetween: 10,
    },
    "@0.75": {
      slidesPerView: 5,
      slidesPerGroup: 5,
      spaceBetween: 10,
    },
    "@0.95": {
      slidesPerView: 6,
      slidesPerGroup: 6,
      spaceBetween: 10,
    },
    "@1.3": {
      slidesPerView: 7,
      slidesPerGroup: 7,
      spaceBetween: 10,
    },
    "@1.75": {
      slidesPerView: 8,
      slidesPerGroup: 4,
      spaceBetween: 10,
    },
  },
};
//
export type CarouselBreakpoints = "poster" | "backdrop" | "title" | "cast";

export default function MediaCarousel({
  items,
  breakpointType,
  className = "",
}: {
  items: Array<JSX.Element>;
  breakpointType: CarouselBreakpoints;
  className?: string;
}) {
  const swiperRef = useRef<SwiperCore>();
  const [isPrevDisabled, setPrevDisabled] = useState(true);
  const [isNextDisabled, setNextDisabled] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleSlideChange = () => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const totalSlides = swiper.slides.length;
    // slidesPerView comes from your breakpoints and is always a number
    const spv = swiper.params.slidesPerView;
    const perView = typeof spv === "number" ? spv : 1;

    const idx = swiper.activeIndex;
    setPrevDisabled(idx <= 0);
    // when the first visible slide index idx reaches totalSlides - perView, you’re at the end
    setNextDisabled(idx >= totalSlides - perView);
  };

  useEffect(() => {
    if (swiperRef.current) {
      // override the breakpoints on the fly
      swiperRef.current.params.breakpoints = breakpointOptions[breakpointType];
      swiperRef.current.currentBreakpoint = breakpointOptions[breakpointType];
      swiperRef.current.setProgress(0, 500);
      swiperRef.current.update(); // re-calculate slidesPerView, groups, etc.
      handleSlideChange();
    }
  }, [breakpointType]);

  const areButtonsDisabled = isPrevDisabled && isNextDisabled;

  const prevOpacity = areButtonsDisabled
    ? "opacity-0"
    : isPrevDisabled
      ? "opacity-30"
      : "opacity-100";

  const nextOpacity = areButtonsDisabled
    ? "opacity-0"
    : isNextDisabled
      ? "opacity-30"
      : "opacity-100";

  return (
    <>
      {!loaded && (
        <Skeleton className="rounded-lg" />
        //<div className="absolute inset-0 animate-pulse rounded-lg bg-black" />
      )}
      <Swiper
        cssMode
        speed={750}
        scrollbar={{
          enabled: true,
          draggable: true,
        }}
        // key={breakpointType} // ← force remount on each toggle
        breakpoints={breakpointOptions[breakpointType]}
        //pagination={{
        //  type: "progressbar",
        //}}
        mousewheel={true}
        keyboard={true}
        lazyPreloadPrevNext={3}
        modules={[Mousewheel, Pagination, Keyboard, Scrollbar]}
        onSlideChange={handleSlideChange}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        onInit={handleSlideChange}
        className={`mySwiper ${className}`}
        watchSlidesProgress={true}
        simulateTouch={false}
        onLoad={() => setLoaded(true)}
      >
        <button
          className={`absolute left-0 top-1/2 z-10 mt-[calc(0px-var(--swiper-navigation-size)/2)] h-[var(--swiper-navigation-size)] items-center rounded-md border border-primary bg-background/80 px-1 transition-opacity ${prevOpacity} invisible xs:visible`}
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <ChevronLeft size={40} />
        </button>
        <button
          className={`absolute right-0 top-1/2 z-10 mt-[calc(0px-var(--swiper-navigation-size)/2)] h-[var(--swiper-navigation-size)] items-center rounded-md border border-primary bg-background/80 px-1 transition-opacity ${nextOpacity} invisible xs:visible`}
          onClick={() => swiperRef.current?.slideNext()}
        >
          <ChevronRight size={40} />
        </button>
        {items.map((item, index) => (
          <SwiperSlide key={index}>{item}</SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
