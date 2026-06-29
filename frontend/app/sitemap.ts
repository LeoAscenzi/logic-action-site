import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/site";

// Public, indexable routes. Auth-gated/dynamic routes (login, sign-up,
// community posts & member profiles) are intentionally excluded.
//
// To add community posts later: fetch the public posts list here and append
// `{ url: `${SITE_URL}/community/post/${id}`, lastModified: updated_at }`.
export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date();

	const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
		{ path: "/",            priority: 1.0, changeFrequency: "weekly"  },
		{ path: "/programs",    priority: 0.9, changeFrequency: "monthly" },
		{ path: "/mentors",     priority: 0.8, changeFrequency: "monthly" },
		{ path: "/get-started", priority: 0.9, changeFrequency: "monthly" },
		{ path: "/community",   priority: 0.7, changeFrequency: "weekly"  },
		{ path: "/events",      priority: 0.7, changeFrequency: "weekly"  },
		{ path: "/contact",     priority: 0.6, changeFrequency: "yearly"  },
		// /mission is a stub (noindex) — re-add once it has real content.
	];

	return routes.map(({ path, priority, changeFrequency }) => ({
		url: `${SITE_URL}${path}`,
		lastModified: now,
		changeFrequency,
		priority,
	}));
}
