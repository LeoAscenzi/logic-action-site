import Link from "next/link";

type Props = {
	eyebrow: string;
	title: string;
	phone: string;
	ctaText: string;
	ctaHref: string;
};

export default function CalloutSection({ eyebrow, title, phone, ctaText, ctaHref }: Props) {
	return (
		<div data-section="navy" className="py-20 px-8">
			<div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-6">
				<span className="eyebrow">{eyebrow}</span>
				<h2 className="font-playfair text-title font-semibold">{title}</h2>
				<p className="text-body text-cream-dim tracking-wide"><a href={`tel:${phone}`}>{phone}</a></p>
				<Link
					href={ctaHref}
					className="rounded-xl bg-[var(--gold)] px-8 py-3 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--gold-light)] transition-colors"
				>
					{ctaText}
				</Link>
			</div>
		</div>
	);
}
