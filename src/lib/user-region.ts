import { useEffect, useState } from "react";

export function useUserRegion() {
  const [region, setRegion] = useState<string | null>("US");

  useEffect(() => {
    const locale = navigator.language || "en-US";
    let r: string;
    try {
      r = new Intl.Locale(locale).region || locale.split("-")[1] || "US";
    } catch {
      r = locale.split("-")[1] || locale.split("-")[0] || "US";
    }
    setRegion(r);
  }, []);

  return region;
}
