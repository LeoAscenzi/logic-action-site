import HeroSection from "@/app/components/pageSections/HeroSection";
import Section from "@/app/components/section";
import ContactForm from "@/app/components/forms/contactForm";

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
									href="tel:1234567890"
									className="w-fit font-playfair text-4xl font-bold !text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors leading-tight"
								>
									(123) 456-7890
								</a>
							</div>

							<div className="flex flex-col max-w-xl">
								<span className="eyebrow">Email</span>
								<a
									href="mailto:somepeople@mail.com"
									className="w-fit text-body font-medium text-[var(--navy)] hover:text-[var(--navy-soft)] transition-colors"
								>
									somepeople@mail.com
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
