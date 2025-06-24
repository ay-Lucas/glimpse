import { PUBLIC_ROUTES, ROOT } from "@/lib/routes";
import { NextResponse } from "next/server";
import { type NextRequest } from 'next/server'
import { createServerClient } from "@supabase/ssr";

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
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}


export async function middleware(request: NextRequest) {

  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname, hostname } = request.nextUrl;

  // 3) In dev, just skip everything
  if (
    process.env.NODE_ENV !== "production" ||
    hostname === "localhost" ||
    hostname === "127.0.0.1"
  ) {
    return response;
  }

  // 4) Public‐route test
  const isAuth = !!session;
  const isExact = PUBLIC_ROUTES.includes(pathname);   // e.g. "/discover","/search"
  const isPrefixed =
    pathname.startsWith("/movie/") ||
    pathname.startsWith("/tv/") ||
    pathname.startsWith("/person/");                      // any movie/tv/person pages
  const isPublic = isExact || isPrefixed;

  // 5a) Signed‐in users should never see the “landing” or “signin” pages
  if (
    isAuth &&
    (pathname === "/" ||
      pathname === "/signin" ||
      pathname === "/signup")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = ROOT;
    return NextResponse.redirect(url);
  }

  // 5b) Unauthenticated users get sent to landing if they hit a protected page
  if (!isAuth && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  // 6) (optional) Bot‐block and rate‐limit here…

  return response;
}
