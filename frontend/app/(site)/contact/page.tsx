import type { Metadata } from "next";
import HeroSection from "@/app/components/pageSections/HeroSection";
import Section from "@/app/components/section";
import ContactForm from "@/app/components/forms/contactForm";

export const metadata: Metadata = {
	title: "Contact",
	description:
		"Get in touch with Ivy Bridge Society. Call or text (680) 215-7089 — we respond within 24 hours.",
	alternates: { canonical: "/contact" },
	openGraph: {
		title: "Contact · Ivy Bridge Society",
		description:
			"Get in touch with Ivy Bridge Society. Call or text (680) 215-7089 — we respond within 24 hours.",
		url: "/contact",
	},
};

export default function Contact() {
	return (
		<div>
			<HeroSection
				eyebrow="Contact Us"
				title="Get In Touch"
				body="We respond within 24 hours. For fastest response, call or text us directly."
			/>

			<Section variant="cream">
				<div className="max-w-6xl mx-auto py-20 px-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

						{/* Left: contact info */}
						<div className="flex flex-col gap-10 pt-2">

							<div className="flex flex-col">
								<span className="eyebrow">Call or Text</span>
								<a
									href="tel:6802157089"
									className="w-fit font-playfair text-4xl font-bold !text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors leading-tight"
								>
									(680) 215-7089
								</a>
							</div>

							<div className="flex flex-col max-w-xl">
								<span className="eyebrow">Email</span>
								<a
									href="mailto:email@ivybridgesociety.com"
									className="w-fit text-body font-medium text-[var(--navy)] hover:text-[var(--navy-soft)] transition-colors"
								>
									email@ivybridgesociety.com
								</a>
							</div>

							<div className="flex flex-col">
								<span className="eyebrow">Based In</span>
								<span className="text-body font-medium text-[var(--navy)]">New York City</span>
							</div>

						</div>

						{/* Right: contact form card */}
						<ContactForm />

					</div>
				</div>
			</Section>
		</div>
	);
}
