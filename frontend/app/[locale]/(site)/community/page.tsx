import Section from "@/app/components/section";
import HeroSection from "@/app/components/pageSections/HeroSection";
import FeatureList from "@/app/components/community/FeatureList";
import CommunityLoginCard from "@/app/components/community/CommunityLoginCard";

export default function CommunityPage() {
	return (
		<div>
			<HeroSection
				eyebrow="Members Only"
				title="The Ivy Bridge Community"
				body="A private network for families with high goals. Elite resources, peer connections, and mentor access — all in one place."
			/>

			<Section variant="navy">
				<div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 py-20 px-8 items-start">
					<FeatureList
						eyebrow="What's Inside"
						title="Everything your family needs, in one private space."
						items={[
							"Premium test prep resources",
							"Mentor Q&As",
							"Parent discussions",
							"Early access to IRL events",
							"Curated college admissions insights",
						]}
					/>
					<CommunityLoginCard />
				</div>
			</Section>
		</div>
	);
}
