import { PUBLIC_ROUTES, ROOT } from "@/lib/routes";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { ALLOWED_BOT_UA, BLOCKED_BOT_UA } from "./lib/constants";
import { isRateLimitedEdge } from "./lib/rateLimit";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export async function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  let response = NextResponse.next({
    request,
  });

  const ua = request.headers.get("user-agent") || "";
  const forwarded = request.headers.get("x-forwarded-for") || "";
  const ip = forwarded.split(",")[0]?.trim() || "unknown";
  const route = pathname.split("/")[1] || "/";

  // Block known abusive bots
  if (BLOCKED_BOT_UA.test(ua)) {
    console.warn(`Blocked bot: ${ua} from ${ip}`);
    return new NextResponse("Blocked bot", { status: 403 });
  }

  // Bypass image optimizer for allowed bots
  if (ALLOWED_BOT_UA.test(ua) && pathname.startsWith("/_next/image")) {
    const original = request.nextUrl.searchParams.get("url");
    if (original) return NextResponse.rewrite(original);
  }

  // Bypass reqs with secret in header (revalidate and backfills scripts)
  if (
    request.headers.get("x-cache-warm-secret") === process.env.REVALIDATE_SECRET
  ) {
    if (pathname === "/api/revalidate")
      console.log(`${request.url} ${ip} ${request.headers.get("user-agent")}`);
    return response;
  }

  // Check if client is rate limited
  if (isRateLimitedEdge(ip, route)) {
    console.warn(`${ip} - ${ua} has been rate limited from ${route}`);
    const url = request.nextUrl.clone();
    url.pathname = "/429";
    return NextResponse.rewrite(url, { status: 429 });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // In dev, just skip everything
  // if (
  //   process.env.NODE_ENV !== "production" ||
  //   process.env.VERCEL_ENV !== "production" ||
  //   hostname === "localhost" ||
  //   hostname === "127.0.0.1"
  // ) {
  //   return response;
  // }
  //
  // Public‐route test
  const isAuth = !!session;
  const isExact = PUBLIC_ROUTES.includes(pathname);
  const isPrefixed =
    pathname.startsWith("/movie/") ||
    pathname.startsWith("/tv/") ||
    pathname.startsWith("/person/");
  const isPublic = isExact || isPrefixed;

  // Signed‐in users should never see the “landing” or “signin” pages
  if (
    isAuth &&
    (pathname === "/" || pathname === "/signin" || pathname === "/signup")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = ROOT;
    return NextResponse.redirect(url);
  }

  // Unauthenticated users get sent to landing if they hit a protected page
  if (!isAuth && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  return response;
}
