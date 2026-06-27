import { NextRequest, NextResponse } from "next/server";

const DASHBOARD_RE = /^\/dashboard(?:\/|$)/;

export default function middleware(req: NextRequest) {
	if (DASHBOARD_RE.test(req.nextUrl.pathname) && !req.cookies.has("refresh_token")) {
		const dest = new URL("/community", req.url);
		dest.searchParams.set("from", req.nextUrl.pathname);
		return NextResponse.redirect(dest);
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*"],
};
