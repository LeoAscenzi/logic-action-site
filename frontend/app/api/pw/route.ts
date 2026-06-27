import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { password, from } = await req.json();

	if (!process.env.SITE_PASSWORD || password !== process.env.SITE_PASSWORD) {
		return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
	}

	const dest = new URL(from || "/", req.url);
	const res  = NextResponse.redirect(dest);
	res.cookies.set("pw_session", "1", {
		httpOnly: true,
		sameSite: "lax",
		maxAge:   60 * 60 * 24 * 7,
		path:     "/",
		secure:   process.env.NODE_ENV === "production",
	});
	return res;
}
