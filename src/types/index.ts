import { MovieResult, PersonResult, TvResult } from "@/types/request-types";

export interface ImageCarouselProps {
  data: Array<MovieResult | TvResult | PersonResult>;
  type: string;
  isUserAgentMobile: boolean;
  variant: string;
}
