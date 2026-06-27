import Section from "@/app/components/section";

interface HeroSectionProps {
	eyebrow: string;
	title:   React.ReactNode;
	body:    string;
}

export default function HeroSection({ eyebrow, title, body }: HeroSectionProps) {
	return (
		<Section variant="navy" tight>
			<div className="max-w-3xl mx-auto flex flex-col items-center text-center my-4 py-8 px-8 gap-4">
				<span className="eyebrow">{eyebrow}</span>
				<h1 className="font-playfair text-title font-semibold leading-snug">
					{title}
				</h1>
				<p className="text-body text-cream-dim max-w-2xl leading-relaxed">
					{body}
				</p>
			</div>
		</Section>
	);
}
