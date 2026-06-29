import HeroSection from "@/app/components/pageSections/HeroSection";
import CommunityFeed from "@/app/components/community/CommunityFeed";

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
