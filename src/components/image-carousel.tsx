"use client";
import Link from "next/link";
import { Card } from "@/components/card";
import { MovieResult, PersonResult, TvResult } from "@/types/request-types";
import { ImageCarouselProps } from "@/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperCore } from "swiper/types";
import { useEffect, useRef, useState } from "react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ImageCarousel({
  data,
  type,
  title,
  variant,
  userAgent,
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

  return (
    <>
      <div>
        <div className="space-x-2 flex justify-between pb-2">
          <h2 className={`text-xl md:text-2xl font-bold pb-3`}>{title}</h2>
          <div>
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
          threshold={5}
          userAgent={userAgent}
          onSlideChange={handleSlideChange}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          simulateTouch={false}
          lazyPreloadPrevNext={4}
          breakpoints={{
            300: {
              slidesPerView: 2,
              slidesPerGroup: 2,
              spaceBetween: 20,
            },
            500: {
              slidesPerView: 3,
              slidesPerGroup: 3,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              slidesPerGroup: 4,
              spaceBetween: 40,
            },
            1100: {
              slidesPerView: 5,
              slidesPerGroup: 5,
              spaceBetween: 20,
            },
            1300: {
              slidesPerView: 6,
              slidesPerGroup: 6,
              spaceBetween: 20,
            },
            1460: {
              slidesPerView: 7,
              slidesPerGroup: 4,
              spaceBetween: 20,
            },
          }}
          modules={[Navigation]}
          className="mySwiper"
          style={{ overflow: "visible" }}
        >
          {data.map(
            (item: MovieResult | TvResult | PersonResult, i: number) => (
              <SwiperSlide key={i} className="group">
                <Link href={`/${type}/${item.id}`}>
                  <Card data={item} index={i} variant={variant} />
                </Link>
              </SwiperSlide>
            ),
          )}
        </Swiper>
      </div>
    </>
  );
}
