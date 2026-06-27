"use client";
import Link from "next/link";
import { useState } from "react";

interface PriceCardProps {
	originalPrice: string;
	badge?:        string;
	ctaLabel:      string;
	href:          string;
}

const DEFAULT_BADGE = "Limited Time: Complimentary for New Families";

export default function PriceCard({
	originalPrice,
	badge = DEFAULT_BADGE,
	ctaLabel,
	href,
}: PriceCardProps) {
	const [hovered, setHovered] = useState(false);

	return (
		<div className="bg-[var(--navy)] rounded-2xl aspect-[2.2/1] px-8 py-7 mt-4 flex flex-col justify-between border border-white/10 text-center">
			<div className="flex flex-col gap-2">
				<div className="text-cream-dim text-sm line-through">
					Originally {originalPrice}
				</div>
				<div className="text-[var(--gold)] text-title !text-[24px] md:!text-[32px] leading-tight font-serif">
					{badge}
				</div>
			</div>

			<Link
				href={href}
				className="flex items-center justify-between border-t border-white/10 pt-4 text-left"
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
			>
				<span style={{ color: hovered ? "#ffffff" : "rgba(255,255,255,0.6)", transition: "color 0.2s" }}>
					{ctaLabel}
				</span>

				{/* Mobile (stacked layout): arrow points down */}
				<svg
					className="lg:hidden w-5 h-5"
					style={{
						color:     hovered ? "#ffffff" : "rgba(255,255,255,0.5)",
						animation: hovered ? "bounce-down 0.6s ease-in-out infinite" : "none",
						transition: "color 0.2s",
					}}
					viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
				>
					<line x1="12" y1="5" x2="12" y2="19" />
					<polyline points="19 12 12 19 5 12" />
				</svg>

				{/* Desktop (side-by-side layout): arrow points right toward the form */}
				<svg
					className="hidden lg:block w-5 h-5"
					style={{
						color:     hovered ? "#ffffff" : "rgba(255,255,255,0.5)",
						animation: hovered ? "bounce-right 0.6s ease-in-out infinite" : "none",
						transition: "color 0.2s",
					}}
					viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
				>
					<line x1="5" y1="12" x2="19" y2="12" />
					<polyline points="12 5 19 12 12 19" />
				</svg>
			</Link>
		</div>
	);
}
