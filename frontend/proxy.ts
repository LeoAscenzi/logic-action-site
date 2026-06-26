import createIntlMiddleware from "next-intl/middleware";
import { defineRouting } from "next-intl/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createIntlMiddleware(
  defineRouting({
    locales: ["en"],
    defaultLocale: "en",
  })
);

const DASHBOARD_RE = /^\/[a-z]{2}\/dashboard(?:\/|$)/;

export default function middleware(req: NextRequest) {
  if (DASHBOARD_RE.test(req.nextUrl.pathname) && !req.cookies.has("refresh_token")) {
    const locale = req.nextUrl.pathname.split("/")[1] ?? "en";
    const dest = new URL(`/${locale}/community`, req.url);
    dest.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(dest);
  }
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
