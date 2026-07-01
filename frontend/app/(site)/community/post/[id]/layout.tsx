import type { Metadata } from "next";

// Post detail is an auth-gated client component — noindex (content lives
// behind login). Metadata must be set here, not in the client page.
export const metadata: Metadata = {
	title: "Community Post",
	robots: { index: false, follow: false },
};

export default function PostLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
