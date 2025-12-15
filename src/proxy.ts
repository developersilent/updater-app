import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

const publicRoutes = [
  "/login",
  "/signup",
  "/api/user/logIn",
  "/api/user/signUp",
  "/api/user/verifyAuth",
];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes - let them handle auth themselves
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const user = await auth();
  const isAuthenticated = user?.isAuthenticated ?? false;

  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
