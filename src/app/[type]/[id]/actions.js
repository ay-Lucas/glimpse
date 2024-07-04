"server only";
import { baseApiUrl, options } from "@/lib/constants";
export async function getData(type, id) {
  const res = await fetch(
    `${baseApiUrl}/${type}/${id}?append_to_response=videos,releases,content_ratings&language=en-US`,
    options,
  );
  return res.json();
}

export async function getReviews(type, id) {
  const res = await fetch(`${baseApiUrl}/${type}/${id}/reviews`, options);
  return res.json();
}

export async function getRecommendations(type, id) {
  const res = await fetch(
    `${baseApiUrl}/${type}/${id}/recommendations`,
    options,
  );
  return res.json();
}

export async function getContentRating(type, id) {
  const res = await fetch(
    `${baseApiUrl}/${type}/${id}/${type === "tv" ? "content_ratings" : "releases"}`,
    options,
  );
  return res.json();
}
