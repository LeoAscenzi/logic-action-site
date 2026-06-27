"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const SUB_LINKS = [
	{
		href:      "/get-started#diagnostic",
		sectionId: "diagnostic",
		label:     "Diagnostic Test",
		sub:       "Find your weak points",
	},
	{
		href:      "/get-started#consultation",
		sectionId: "consultation",
		label:     "Book a Consultation",
		sub:       "Free 1:1 with an expert",
	},
];

export default function NavDropdown({ text }: { text: string }) {
	const [open, setOpen] = useState(false);
	const [hash, setHash] = useState("");
	const closeTimer      = useRef<ReturnType<typeof setTimeout> | null>(null);
	const pathname        = usePathname();
	const isOnGetStarted  = pathname === "/get-started";

	useEffect(() => {
		const update = () => setHash(window.location.hash);
		update();
		window.addEventListener("hashchange", update);
		return () => window.removeEventListener("hashchange", update);
	}, []);

	// hashchange doesn't fire on cross-page navigation — re-read when pathname changes
	useEffect(() => { setHash(window.location.hash); }, [pathname]); // eslint-disable-line react-hooks/set-state-in-effect

	const onEnter = () => {
		if (closeTimer.current) clearTimeout(closeTimer.current);
		setOpen(true);
	};

	const onLeave = () => {
		closeTimer.current = setTimeout(() => setOpen(false), 120);
	};

	const handleSubClick = (e: React.MouseEvent, sectionId: string) => {
		if (isOnGetStarted) {
			e.preventDefault();
			const el = document.getElementById(sectionId);
			el?.scrollIntoView({ behavior: "smooth" });
			const newHash = `#${sectionId}`;
			history.pushState(null, "", newHash);
			setHash(newHash);
		}
		setOpen(false);
	};

	return (
		<div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
			<Link
				href="/get-started"
				className={`nav-link font-sans font-medium tracking-wider transition-colors ${isOnGetStarted ? "active" : ""}`}
			>
				{text}
			</Link>

			{open && (
				<div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-52 z-50">
					<div className="bg-[var(--navy-mid)] rounded-xl border border-[var(--line-dark)] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] py-1 overflow-hidden">
						{SUB_LINKS.map(({ href, sectionId, label, sub }) => {
							const isSubActive = isOnGetStarted && hash === `#${sectionId}`;
							return (
								<Link
									key={href}
									href={href}
									onClick={(e) => handleSubClick(e, sectionId)}
									className={`flex flex-col px-4 py-3 transition-colors ${
										isSubActive ? "bg-white/10" : "hover:bg-white/5"
									}`}
								>
									<span className={`text-sm font-medium ${isSubActive ? "text-[var(--gold)]" : "text-white"}`}>
										{label}
									</span>
									<span className="text-xs text-cream-dim mt-0.5">{sub}</span>
								</Link>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
