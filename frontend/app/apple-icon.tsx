import { ImageResponse } from "next/og";
import { COLOR_NAVY, COLOR_GOLD } from "./lib/site";

// iOS home-screen / share icon. Matches app/icon.svg (navy square, gold "IB").
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
	return new ImageResponse(
		(
			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: COLOR_NAVY,
					color: COLOR_GOLD,
					fontSize: 104,
					fontWeight: 700,
					fontFamily: "Georgia, serif",
				}}
			>
				IB
			</div>
		),
		{ ...size }
	);
}
