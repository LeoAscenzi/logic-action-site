import type { Metadata } from "next";

// Member profile is an auth-gated client component — noindex (content lives
// behind login). Metadata must be set here, not in the client page.
export const metadata: Metadata = {
	title: "Member Profile",
	robots: { index: false, follow: false },
};

export default function MemberLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
