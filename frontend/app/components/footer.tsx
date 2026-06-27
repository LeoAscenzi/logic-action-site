import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Section from "./section";

const NAV_LINKS = [
	{ href: "/",             key: "home"       },
	{ href: "/programs",     key: "programs"   },
	{ href: "/mentors",      key: "mentors"    },
	{ href: "/community",    key: "community"  },
	{ href: "/events",       key: "events"     },
	{ href: "/get-started",  key: "getStarted" },
	{ href: "/contact",      key: "contact"    },
] as const;

export default function Footer() {
	const tNav    = useTranslations("navbar");
	const tFooter = useTranslations("footer");

	return (
		<Section variant="navy" className="border-t border-white/15">

			{/* ── 3-column section ─────────────────────── */}
			<div className="max-w-6xl mx-auto px-8 py-14">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

					{/* Left: logo + description + CTA */}
					<div className="flex flex-col gap-6">
						<Image src="/logo-dark-text-right.png" alt="Ivy Bridge Society" width={154} height={52} className="h-[52px] w-auto self-start" />
						<p className="text-sm text-cream-dim leading-relaxed max-w-xs">
							NYC&apos;s premier education community for families with high goals.
							Test prep, college advisory, and academic support — measured by results.
						</p>
						<Link
							href="/get-started#consultation"
							className="w-fit rounded-xl bg-[var(--gold)] px-6 py-2.5 text-sm font-semibold !text-[var(--ink)] hover:bg-[var(--gold-light)] transition-colors"
						>
							Book a Free Consultation
						</Link>
					</div>

					{/* Middle: Explore nav */}
					<div className="flex flex-col gap-4">
						<span className="eyebrow !text-white">Explore</span>
						<nav className="flex flex-col gap-2.5">
							{NAV_LINKS.map(({ href, key }) => (
								<Link
									key={href}
									href={href}
									className="w-fit text-sm text-cream-dim hover:text-white transition-colors"
								>
									{tNav(key)}
								</Link>
							))}
						</nav>
					</div>

					{/* Right: Talk to us */}
					<div className="flex flex-col gap-4">
						<span className="eyebrow">Talk to Us</span>
						<a
							href={`tel:${tFooter("phone").replace(/\D/g, "")}`}
							className="w-fit font-playfair text-3xl font-semibold text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors leading-tight"
						>
							{tFooter("phone")}
						</a>
						<p className="text-sm text-cream-dim leading-relaxed max-w-xs">
							We respond within 24 hours. Call or text for fastest response.
						</p>
					</div>

				</div>
			</div>

			{/* ── Divider ──────────────────────────────── */}
			<div className="border-t border-white/15" />

			{/* ── Copyright bar ────────────────────────── */}
			<div className="max-w-6xl mx-auto px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
				<span className="text-xs text-cream-dim">
					&copy; Ivy Bridge Society 2025. All rights reserved.
				</span>
				<span className="text-xs text-cream-dim font-playfair italic">
					Results. Not Promises.
				</span>
			</div>

		</Section>
	);
}
