import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESCRIPTION, COLOR_NAVY } from "./lib/site";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: SITE_NAME,
		short_name: "Ivy Bridge",
		description: SITE_DESCRIPTION,
		start_url: "/",
		display: "standalone",
		background_color: COLOR_NAVY,
		theme_color: COLOR_NAVY,
		icons: [
			{ src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
			{ src: "/apple-icon", type: "image/png", sizes: "180x180" },
		],
	};
}
