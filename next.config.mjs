/** @type {import('next').NextConfig} */
import withPlaiceholder from "@plaiceholder/next";
import withBundleAnalyzer from "@next/bundle-analyzer";
const nextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        // pathname: "/account123/**",
      },
    ],
    minimumCacheTTL: 200,
  },
  output: "standalone",
};

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withAnalyzer(withPlaiceholder(nextConfig));
