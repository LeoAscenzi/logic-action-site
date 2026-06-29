import Section from "@/app/components/section";
import HeroSection from "@/app/components/pageSections/HeroSection";
import MentorCard from "@/app/components/cards/MentorCard";
import { getMentors } from "@/app/lib/getMentors";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Mentors",
	description:
		"Meet the mentors from top schools who guide Ivy Bridge Society students toward measurable academic results.",
	alternates: { canonical: "/mentors" },
	openGraph: {
		title: "Mentors · Ivy Bridge Society",
		description:
			"Meet the mentors from top schools who guide Ivy Bridge Society students toward measurable academic results.",
		url: "/mentors",
	},
};

export default async function MentorsPage() {
	const mentors = await getMentors();

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
