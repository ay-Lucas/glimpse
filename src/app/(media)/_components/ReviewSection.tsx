import {
  MovieReviewsRequest,
  ReviewI,
  TvReviewsResponse,
} from "@/types/request-types-snakecase";
import { getReviews } from "@/app/(media)/actions";
import { Review } from "./reviews";

export default async function ReviewSection({
  id,
  type,
}: {
  id: number;
  type: "tv" | "movie";
}) {
  const res: MovieReviewsRequest | TvReviewsResponse = await getReviews(
    type,
    id,
  );
  const reviews = res.results;
  if (!reviews || (reviews && reviews?.length < 1)) return;
  return (
    <div className="px-0 lg:px-40">
      <h2 className="text-2xl font-semibold pb-5 pr-3 inline-flex">Reviews</h2>
      <span className="text-2xl font-semibold">({reviews?.length ?? 0})</span>
      <div className="space-y-3">
        {reviews?.map((reviews: ReviewI, index: number) => (
          <Review data={reviews} key={index} />
        ))}
      </div>
    </div>
  );
}
