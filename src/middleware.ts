import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { PUBLIC_ROUTES, ROOT } from "@/lib/routes";
import { NextResponse } from "next/server";
import { isRateLimitedEdge } from "./lib/rateLimit";

const blockedUserAgents = [
  "AhrefsBot",
  "Bytespider",
  "Amazonbot",
  "Googlebot-Image",
  "OAI-SearchBot",
  "MJ12bot",
  "DotBot",
  "SemrushBot",
];

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  // Bypass non-prod environments
  const { hostname, pathname } = req.nextUrl;

  if (
    process.env.NODE_ENV !== "production" ||
    hostname === "localhost" ||
    hostname === "127.0.0.1"
  ) {
    return NextResponse.next();
  }

  const nextUrl = req.nextUrl;

  const isAuthenticated = !!req.auth;
  const isPublicRoute =
    PUBLIC_ROUTES.includes(nextUrl.pathname)
  if (
    (isAuthenticated && pathname.startsWith("/signin")) ||
    (isAuthenticated && pathname.startsWith("/signup")) ||
    (isAuthenticated && pathname === "/")
  ) {
    return NextResponse.redirect(new URL(ROOT, nextUrl));
  }
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL(ROOT, nextUrl));
  }

  const forwarded = req.headers.get("x-forwarded-for") ?? "";
  const ip =
    forwarded.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const ua = req.headers.get("user-agent") || "";

  // Block known abusive bots
  if (blockedUserAgents.some((bot) => ua.includes(bot))) {
    console.warn(`Blocked bot: ${ua} from ${ip}`);
    return new NextResponse("Blocked bot", { status: 403 });
  }

  const route = pathname.split("/")[1] ?? "/";

  // Check if client is rate limited
  if (await isRateLimitedEdge(ip, route)) {
    const url = req.nextUrl.clone();
    url.pathname = "/429";
    return NextResponse.rewrite(url, { status: 429 });
  }

  return NextResponse.next();
});
