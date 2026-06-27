"use client";
import Image from "next/image";
import { useState, useEffect, Fragment } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const LINKS = [
	{ url: "/",          key: "home"      },
	{ url: "/programs",  key: "programs"  },
	{ url: "/mentors",   key: "mentors"   },
	{ url: "/community", key: "community" },
	{ url: "/events",    key: "events"    },
	{ url: "/contact",   key: "contact"   },
];

const GET_STARTED_SUB = [
	{ url: "/get-started#diagnostic",   label: "Diagnostic Test",     sub: "Find your weak points",   gold: true  },
	{ url: "/get-started#consultation", label: "Book a Consultation", sub: "Free 1:1 with an expert", gold: false },
];

export default function MobileMenu() {
	const [open, setOpen]       = useState(false);
	const [mounted, setMounted] = useState(false);
	const pathname              = usePathname();
	const t                     = useTranslations("navbar");

	// Wait for client mount before portal is available
	useEffect(() => { setMounted(true); }, []); // eslint-disable-line react-hooks/set-state-in-effect

	// Close on route change (handles back/forward navigation)
	useEffect(() => { setOpen(false); }, [pathname]); // eslint-disable-line react-hooks/set-state-in-effect

	// Lock body scroll while open
	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
		return () => { document.body.style.overflow = ""; };
	}, [open]);

	const normalizedPath = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";
	const close = () => setOpen(false);
	const isGetStartedActive = normalizedPath === "/get-started";

	const linkCls = (url: string) =>
		`block py-5 text-lg font-medium border-b border-[var(--line-dark)] transition-colors ${
			normalizedPath === url ? "text-[var(--gold)]" : "text-cream-dim hover:text-white"
		}`;

	const overlay = open ? (
		<div className="fixed inset-0 z-[200] bg-[var(--navy)] flex flex-col">

			{/* Top bar */}
			<div className="flex items-center justify-between h-[72px] px-6 border-b border-[var(--line-dark)] shrink-0">
				<Link href="/" onClick={close}>
					<Image src="/logo-dark-text-right.png" alt="Ivy Bridge Society" width={118} height={40} className="max-h-[40px] w-auto" priority />
				</Link>
				<button
					onClick={close}
					aria-label="Close navigation menu"
					className="p-1 text-cream-dim hover:text-white transition-colors"
				>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
						<line x1="4" y1="4" x2="20" y2="20" />
						<line x1="20" y1="4" x2="4" y2="20" />
					</svg>
				</button>
			</div>

			{/* Nav links */}
			<nav className="flex flex-col flex-1 overflow-y-auto px-6 pt-2">

				{LINKS.map(({ url, key }) => (
					<Link key={url} href={url} onClick={close} className={linkCls(url)}>
						{t(key)}
					</Link>
				))}

				{/* Get Started with expanded sub-links */}
				<div className="border-b border-[var(--line-dark)]">
					<Link
						href="/get-started"
						onClick={close}
						className={`block py-5 text-lg font-medium transition-colors pb-3 ${
							isGetStartedActive ? "text-[var(--gold)]" : "text-cream-dim hover:text-white"
						}`}
					>
						{t("getStarted")}
					</Link>
					<div className="flex flex-col pl-4 pb-4 gap-1">
						{GET_STARTED_SUB.map(({ url, label, sub, gold }) => (
							<Link
								key={url}
								href={url}
								onClick={close}
								className="flex flex-col py-2 px-3 rounded-lg hover:bg-white/5 transition-colors"
							>
								<span className={`text-sm font-medium ${gold ? "text-[var(--gold)]" : "text-cream-dim"}`}>
									{label}
								</span>
								<span className="text-xs text-cream-dim/60 mt-0.5">{sub}</span>
							</Link>
						))}
					</div>
				</div>

			</nav>

			{/* Book a Consult CTA */}
			<div className="px-6 py-10 shrink-0">
				<Link
					href="/get-started#consultation"
					onClick={close}
					className="block w-full text-center rounded-xl bg-[var(--gold)] py-4 font-semibold text-[var(--ink)] hover:bg-[var(--gold-light)] transition-colors"
				>
					Book a Consult
				</Link>
			</div>

		</div>
	) : null;

	return (
		<>
			{/* Burger button */}
			<button
				onClick={() => setOpen(true)}
				aria-label="Open navigation menu"
				className="p-1 text-cream-dim hover:text-white transition-colors"
			>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
					<line x1="3" y1="6" x2="21" y2="6" />
					<line x1="3" y1="12" x2="21" y2="12" />
					<line x1="3" y1="18" x2="21" y2="18" />
				</svg>
			</button>

			{/* Rendered into document.body to escape the header's backdrop-filter containing block */}
			{mounted && createPortal(overlay, document.body)}
		</>
	);
}
