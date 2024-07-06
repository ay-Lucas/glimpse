import { MovieResult, TvResult } from "@/types/request-types";

export interface ImageCarouselProps {
  data: Array<MovieResult | TvResult>;
  type: string;
  isUserAgentMobile: boolean;
  variant: string;
}
