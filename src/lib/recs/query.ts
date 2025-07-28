import { MatchPayload } from "./payload";

export function payloadToSearch(payload: MatchPayload) {
  const qs = new URLSearchParams();

  // ① mood   (single)
  payload.tags[0] && qs.set("mo", payload.tags[0]); // assuming first tag = mood

  // ② vibe   (≤3)
  payload.filters.vibe?.forEach((v) => qs.append("vi", v));

  // ③ aesthetic (≤2)
  payload.filters.aesthetic?.forEach((a) => qs.append("ae", a));

  // ④ interests / free text
  payload.filters.interests?.forEach((i) => qs.append("in", i));

  // other filters
  qs.set("m", payload.filters.media); // movie | series | either
  qs.set("y", payload.filters.years.join("-")); // 1990-2025
  qs.set("r", String(payload.filters.runtime_max)); // 120
  payload.filters.language.forEach((l) => qs.append("l", l));
  payload.filters.avoid?.forEach((x) => qs.append("x", x));

  return qs.toString();
}
