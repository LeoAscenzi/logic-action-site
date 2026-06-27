import { NextRequest, NextResponse } from "next/server";

const DASHBOARD_RE = /^\/dashboard(?:\/|$)/;
const PW_BYPASS    = new Set(["/pw", "/api/pw"]);

export default function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	// Password gate — only active when ENABLE_PASSWORD_GATE=true (Vercel Preview env)
	if (process.env.ENABLE_PASSWORD_GATE === "true" && !PW_BYPASS.has(pathname)) {
		if (!req.cookies.has("pw_session")) {
			const dest = new URL("/pw", req.url);
			dest.searchParams.set("from", pathname);
			return NextResponse.redirect(dest);
		}
	}

	// Dashboard auth guard
	if (DASHBOARD_RE.test(pathname) && !req.cookies.has("refresh_token")) {
		const dest = new URL("/community", req.url);
		dest.searchParams.set("from", pathname);
		return NextResponse.redirect(dest);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next|.*\\..*).*)"],
};
