import type { ReactNode } from "react";
import type { Metadata } from "next";
import HeroSection from "@/app/components/pageSections/HeroSection";
import Section from "@/app/components/section";
import PriceCard from "@/app/components/cards/priceCard";
import DiagnosticForm from "@/app/components/forms/diagnosticForm";

export const metadata: Metadata = {
	title: "Get Started",
	description:
		"Start with a free diagnostic and consultation. Build a personalized growth plan with Ivy Bridge Society.",
	alternates: { canonical: "/get-started" },
	openGraph: {
		title: "Get Started · Ivy Bridge Society",
		description:
			"Start with a free diagnostic and consultation. Build a personalized growth plan with Ivy Bridge Society.",
		url: "/get-started",
	},
};
import CalendlyEmbed from "@/app/components/CalendlyEmbed";

interface ServiceSectionProps {
	id:          string;
	variant:     "cream" | "white";
	eyebrow:     string;
	title:       string;
	description: string;
	originalPrice: string;
	badge?:      string;
	ctaLabel:    string;
	ctaHref:     string;
	right:       ReactNode;
}

function ServiceSection({
	id,
	variant,
	eyebrow,
	title,
	description,
	originalPrice,
	badge,
	ctaLabel,
	ctaHref,
	right,
}: ServiceSectionProps) {
	return (
		<div id={id} className="scroll-mt-[72px]">
			<Section variant={variant}>
				<div className="max-w-6xl mx-auto py-20 px-8">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

						<div className="flex flex-col gap-2 pt-2">
							<span className="eyebrow">{eyebrow}</span>
							<h2 className="font-playfair text-title font-semibold leading-snug text-ink">
								{title}
							</h2>
							<p className="text-body text-ink-soft leading-relaxed">{description}</p>
							<PriceCard
								originalPrice={originalPrice}
								badge={badge}
								ctaLabel={ctaLabel}
								href={ctaHref}
							/>
						</div>

						{right}

					</div>
				</div>
			</Section>
		</div>
	);
}

export default function GetStartedPage() {
	return (
		<div>

			<HeroSection
				eyebrow="Get Started"
				title="Your student's results start here."
				body="One diagnostic. One conversation. A clear path forward."
			/>

			<ServiceSection
				id="consultation"
				variant="white"
				eyebrow="The Consultation"
				title="Talk to an expert. No cost. No commitment."
				description="Call us at (680) 215-7089 or book a time via Calendly to get started. After reviewing your student's diagnostic, one of our advisors will walk you through the results, what they mean for college readiness, and outline a personalized plan, no sales pressure, just clarity."
				originalPrice="$199"
				badge="Limited Time: Free Strategy Call for New Families"
				ctaLabel="Use Calendly to Book Now!"
				ctaHref="#consultation"
				right={<CalendlyEmbed />}
			/>

			<ServiceSection
				id="diagnostic"
				variant="cream"
				eyebrow="The Diagnostic"
				title="Know exactly where your student stands."
				description="Our diagnostic identifies precise strengths and gaps across every tested domain — giving us a data-driven starting point instead of guesswork. Most families spend months on generic prep before realizing their student needed a different approach. We skip that entirely."
				originalPrice="$199"
				ctaLabel="Fill Out the form to Book Now!"
				ctaHref="#diagnostic"
				right={<DiagnosticForm />}
			/>

		</div>
	);
}
