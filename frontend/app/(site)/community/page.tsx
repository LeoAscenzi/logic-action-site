import type { Metadata } from "next";
import HeroSection from "@/app/components/pageSections/HeroSection";
import CommunityFeed from "@/app/components/community/CommunityFeed";

export const metadata: Metadata = {
	title: "Community",
	description:
		"Join the Ivy Bridge Society community — mentors who've walked the road, aspirational peers, and families sharing resources and insights.",
	alternates: { canonical: "/community" },
	openGraph: {
		title: "Community · Ivy Bridge Society",
		description:
			"Join the Ivy Bridge Society community — mentors who've walked the road, aspirational peers, and families sharing resources and insights.",
		url: "/community",
	},
};

export default function CommunityPage() {
	return (
		<div>
			<HeroSection
				eyebrow="Members Only"
				title="The Ivy Bridge Community"
				body="A private network for families with high goals. Elite resources, peer connections, and mentor access — all in one place."
			/>
			<CommunityFeed />
		</div>
	);
}
