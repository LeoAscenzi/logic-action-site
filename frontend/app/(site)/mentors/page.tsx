import Section from "@/app/components/section";
import HeroSection from "@/app/components/pageSections/HeroSection";
import MentorCard from "@/app/components/cards/MentorCard";
import { getMentors } from "@/app/lib/getMentors";

export default async function MentorsPage() {
	const mentors = await getMentors("en");

	return (
		<div>
			<HeroSection
				eyebrow="Mentors"
				title="Mentors Who Have Walked the Road."
				body="Every Ivy Bridge mentor has achieved what your student is working toward. They're not just teachers — they're proof it's possible."
			/>

			<Section variant="cream">
				<div className="max-w-6xl mx-auto py-20 px-8">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{mentors.map((mentor, i) => (
							<MentorCard key={i} {...mentor} />
						))}
					</div>
				</div>
			</Section>
		</div>
	);
}
