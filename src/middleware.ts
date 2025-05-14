import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { PUBLIC_ROUTES, ROOT } from "@/lib/routes";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
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

export async function middleware(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  const ua = request.headers.get("user-agent") || "";
  const ip = request.ip || "unknown";
  const pathname = request.nextUrl.pathname;
  const route = pathname.split("/")[1] ?? "/";

  // Block known abusive bots
  if (blockedUserAgents.some((bot) => ua.includes(bot))) {
    console.warn(`Blocked bot: ${ua} from ${ip}`);
    return new NextResponse("Blocked bot", { status: 403 });
  }

  if (await isRateLimitedEdge(ip, route)) {
    const url = request.nextUrl.clone();
    url.pathname = "/429";
    return NextResponse.rewrite(url, { status: 429 });
  }

  return NextResponse.next();
}

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;

  const isAuthenticated = !!req.auth;
  const isPublicRoute =
    PUBLIC_ROUTES.includes(nextUrl.pathname) ||
    nextUrl.pathname.startsWith("/tv") ||
    nextUrl.pathname.startsWith("/movie") ||
    nextUrl.pathname.startsWith("/person") ||
    nextUrl.pathname.startsWith("/search");

  if (
    (isAuthenticated && nextUrl.pathname.startsWith("/signin")) ||
    (isAuthenticated && nextUrl.pathname.startsWith("/signup"))
  ) {
    return Response.redirect(new URL(ROOT, nextUrl));
  }
  if (!isAuthenticated && !isPublicRoute) {
    return Response.redirect(new URL(ROOT, nextUrl));
  }
});
