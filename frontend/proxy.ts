import { NextRequest, NextResponse } from "next/server";

const PW_BYPASS = new Set(["/pw", "/api/pw"]);

export default function proxy(req: NextRequest) {
	const { pathname } = req.nextUrl;

	// Password gate — only active when ENABLE_PASSWORD_GATE=true (Vercel Preview env)
	if (process.env.ENABLE_PASSWORD_GATE === "true" && !PW_BYPASS.has(pathname)) {
		if (!req.cookies.has("pw_session")) {
			const dest = new URL("/pw", req.url);
			dest.searchParams.set("from", pathname);
			return NextResponse.redirect(dest);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next|.*\\..*).*)"],
};
