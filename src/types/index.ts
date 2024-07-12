import { MovieResult, PersonResult, TvResult } from "@/types/request-types";

export interface ImageCarouselProps {
  data: Array<MovieResult | TvResult | PersonResult>;
  type: string;
  title: string;
  variant: string;
  userAgent?: string | null;
}
