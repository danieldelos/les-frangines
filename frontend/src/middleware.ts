import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_COOKIE = "lf_access";
const REFRESH_COOKIE = "lf_refresh";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const hasAuth =
    req.cookies.get(ACCESS_COOKIE)?.value || req.cookies.get(REFRESH_COOKIE)?.value;

  if (pathname.startsWith("/app")) {
    if (!hasAuth) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (pathname === "/login" || pathname === "/register") {
    if (hasAuth) {
      const url = req.nextUrl.clone();
      url.pathname = "/app";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/login", "/register"]
};

