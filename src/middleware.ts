import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { DEFAULT_REDIRECT, PUBLIC_ROUTES, ROOT } from "@/lib/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;

  const isAuthenticated = !!req.auth;
  console.log(nextUrl.pathname);
  const isPublicRoute =
    PUBLIC_ROUTES.includes(nextUrl.pathname) ||
    nextUrl.pathname.startsWith("/tv") ||
    nextUrl.pathname.startsWith("/movie") ||
    nextUrl.pathname.startsWith("/person");

  if (
    (isAuthenticated && nextUrl.pathname.startsWith("/signin")) ||
    (isAuthenticated && nextUrl.pathname.startsWith("/signup"))
  ) {
    return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));
  }

  if (!isAuthenticated && !isPublicRoute) {
    console.log(new URL(ROOT, nextUrl));
    return Response.redirect(new URL(ROOT, nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
