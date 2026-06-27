"use client";
import Link from "next/link";

interface PriceCardProps {
	originalPrice: string;
	badge?:        string;
	ctaLabel:      string;
	href?:         string;
	onClick?:      () => void;
}

const DEFAULT_BADGE = "Limited Time: Complimentary for New Families";

export default function PriceCard({
	originalPrice,
	badge = DEFAULT_BADGE,
	ctaLabel,
	href,
	onClick,
}: PriceCardProps) {
	const btnCls =
		"w-full rounded-lg bg-[var(--gold)] text-[var(--ink)] py-3 text-sm font-semibold " +
		"hover:bg-[var(--gold-light)] transition-colors text-center";

	const handleHashClick = (e: React.MouseEvent) => {
		if (!href?.startsWith("#")) return;
		const el = document.getElementById(href.slice(1));
		if (!el) return;
		e.preventDefault();
		el.scrollIntoView({ behavior: "smooth" });
		history.pushState(null, "", href);
	};

	return (
		<div className="bg-[var(--navy)] rounded-2xl aspect-[2.2/1] px-8 py-7 mt-4 flex flex-col justify-between border border-white/10 text-center">
			<div className="flex flex-col gap-2">
				<p className="text-cream-dim text-sm line-through">
					Originally {originalPrice}
				</p>
				<p className="text-[var(--gold)] text-title font-medium leading-tight font-serif">
					{badge}
				</p>
			</div>

			{href ? (
				<Link href={href} onClick={handleHashClick} className={btnCls}>
					{ctaLabel}
				</Link>
			) : (
				<button type="button" onClick={onClick} className={btnCls}>
					{ctaLabel}
				</button>
			)}
		</div>
	);
}
