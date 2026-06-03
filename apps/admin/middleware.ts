import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasRefreshToken = request.cookies.has("zo_refresh");
  const hasMfaVerified = request.cookies.has("zo_mfa_verified");

  // Always require login
  if (pathname.startsWith("/login")) return NextResponse.next();

  if (!hasRefreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Every admin session requires MFA — no exceptions
  if (!hasMfaVerified && !pathname.startsWith("/verify-mfa")) {
    return NextResponse.redirect(new URL("/verify-mfa", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg).*)"],
};
