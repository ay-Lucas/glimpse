import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const abusiveBots = [
  "AhrefsBot*",
  "SemrushBot*",
  "DotBot*",
  "MJ12bot*",
  "BLEXBot*",
  "Sogou*",
  "Exabot*",
  "MegaIndex*",
  "Yandex*",
  "Baiduspider*",
  "PetalBot*",
  "CensysInspect*",
  "Bytespider*",
  "Amazonbot*",
  "Seekport*",
  "SeznamBot*",
  "Qwantify*",
  "MauiBot*",
  "Screaming Frog SEO Spider*",
  "ZoominfoBot*",
  "BomboraBot*",
  "SISTRIX Crawler*",
  "DataForSeoBot*",
  "Googlebot-Image*",
  "GPTBot*",
  "ClaudeBot*",
];

export default function robots(): MetadataRoute.Robots {
  return {
    // sitemap: "https://yourdomain.com/sitemap.xml",
    rules: [
      ...abusiveBots.map((ua) => ({ userAgent: ua, disallow: "/" })),
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/movie/",
          "/tv/",
          "/person/",
          "/watchlist/",
          "/api/",
          "/search",
        ],
      },
    ],
  };
}
