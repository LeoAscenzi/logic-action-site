import Section from "@/app/components/section";
import HeroSection from "@/app/components/pageSections/HeroSection";
import ProgramCard from "@/app/components/cards/ProgramCard";
import { getPrograms, Program } from "@/app/lib/getPrograms";

export default async function ProgramsPage() {
	const programs: Program[] = await getPrograms();

	return (
		<div>
			<HeroSection
				eyebrow="What We Offer"
				title="Every Program. One Goal: Your Results."
				body="From middle school through college admissions — we cover every stage."
			/>

			<Section variant="cream">
				<div className="max-w-6xl mx-auto py-20 px-8">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{programs.map((program, i) => (
							<ProgramCard key={i} {...program} />
						))}
					</div>
				</div>
			</Section>
		</div>
	);
}
