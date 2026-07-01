import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE, COLOR_NAVY, COLOR_GOLD, COLOR_CREAM } from "./lib/site";

// Site-wide default social-share card (Facebook, LinkedIn, iMessage, Slack, Twitter).
// To override for a specific route, drop an opengraph-image.tsx into that route folder.
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
	return new ImageResponse(
		(
			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					backgroundColor: COLOR_NAVY,
					padding: "80px",
				}}
			>
				{/* IB mark */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						width: 96,
						height: 96,
						borderRadius: 20,
						backgroundColor: COLOR_GOLD,
						color: COLOR_NAVY,
						fontSize: 52,
						fontWeight: 700,
						fontFamily: "Georgia, serif",
						marginBottom: 48,
					}}
				>
					IB
				</div>

				<div style={{ display: "flex", fontSize: 72, fontWeight: 700, color: COLOR_CREAM, fontFamily: "Georgia, serif" }}>
					{SITE_NAME}
				</div>
				<div style={{ display: "flex", fontSize: 56, fontWeight: 700, color: COLOR_GOLD, fontFamily: "Georgia, serif", marginTop: 8 }}>
					{SITE_TAGLINE}
				</div>
				<div style={{ display: "flex", fontSize: 30, color: COLOR_CREAM, marginTop: 40, letterSpacing: 2 }}>
					SAT · ACT · College Advisory
				</div>
			</div>
		),
		{ ...size }
	);
}
