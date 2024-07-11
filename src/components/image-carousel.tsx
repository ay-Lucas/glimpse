"use client";
import Link from "next/link";
import { Card } from "@/components/card";
import { MovieResult, PersonResult, TvResult } from "@/types/request-types";
import { ImageCarouselProps } from "@/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
export function ImageCarousel({
  data,
  type,
  isUserAgentMobile,
  variant,
}: ImageCarouselProps) {
  return (
    <>
      <div>
        <Swiper
          slidesPerView={1}
          speed={500}
          spaceBetween={10}
          navigation={{
            disabledClass: "opacity-40",
          }}
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
              slidesPerGroup: 3,
              spaceBetween: 20,
            },
            1460: {
              slidesPerView: 7,
              slidesPerGroup: 3,
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
