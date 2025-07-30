import camelcaseKeys from "camelcase-keys";
import { options } from "./constants";

export async function fetchJSON<T>(url: string, init: RequestInit = options) {
  const res = await fetch(url, init);
  const data = await res.json();
  const camel = camelcaseKeys(data, { deep: true });
  return camel as T;
}
