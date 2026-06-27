import Link from "next/link";
import Section from "@/app/components/section";
import HeroSection from "@/app/components/pageSections/HeroSection";

const EVENT_TYPES = [
	{ emoji: "🎓", label: "Talks by top school graduates"     },
	{ emoji: "📝", label: "SAT & ACT prep workshops"          },
	{ emoji: "🏛️", label: "College admissions info nights"    },
	{ emoji: "🤝", label: "Parent networking meetups"         },
	{ emoji: "💡", label: "Study strategy seminars"           },
	{ emoji: "🗺️", label: "Campus visit prep sessions"        },
];

const PAST_EVENTS = [
	{
		label: "Spring 2025",
		title: "College Apps Kickoff Workshop",
		bg:    "from-[#1a2a4a] to-[#0d1120]",
	},
	{
		label: "Winter 2025",
		title: "SAT Boot Camp Info Session",
		bg:    "from-[#2a1a3a] to-[#0d1120]",
	},
	{
		label: "Fall 2024",
		title: "Top School Admissions Panel",
		bg:    "from-[#1a3a2a] to-[#0d1120]",
	},
];

export default function EventsPage() {
	return (
		<div>

			{/* ── Hero ───────────────────────────────────── */}
			<HeroSection
				eyebrow="Ivy Bridge Events"
				title="Learn. Connect. Get Ahead."
				body="From college admissions nights to SAT strategy sessions, our events bring expert guidance and community together in one room."
			/>

			{/* ── Next Event ─────────────────────────────── */}
			<Section variant="cream">
				<div className="max-w-5xl mx-auto py-20 px-8">

					<span className="eyebrow">Next Event</span>
					<h2 className="font-playfair text-title font-semibold leading-snug mt-3 mb-10 text-ink">
						Don&apos;t miss what&apos;s coming up
					</h2>

					{/* Wide event card */}
					<div className="rounded-2xl overflow-hidden border border-[var(--line)] flex flex-col lg:flex-row shadow-[0_4px_32px_-8px_rgba(13,17,32,0.12)]">

						{/* Left: event image placeholder */}
						<div className="lg:w-[45%] min-h-[300px] bg-gradient-to-br from-[var(--navy-soft)] to-[var(--navy)] flex items-center justify-center relative overflow-hidden shrink-0">
							<div className="absolute inset-0 opacity-20"
								style={{ backgroundImage: "radial-gradient(circle at 30% 60%, var(--gold) 0%, transparent 55%)" }}
							/>
							<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border border-[var(--gold)]/15" />
							<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border border-[var(--gold)]/25" />
							<span className="text-7xl relative z-10 select-none">🎓</span>
						</div>

						{/* Right: event details */}
						<div className="flex-1 bg-white flex flex-col gap-5 p-8 lg:p-10">

							<h3 className="font-playfair text-[1.4rem] font-semibold text-ink leading-snug">
								Spring College Admissions Info Night
							</h3>

							<div className="flex flex-col gap-1.5">
								<p className="text-sm text-ink-soft">
									<span className="font-medium text-ink">Date:</span>
									{" "}Thursday, May 14th 2026&nbsp;&nbsp;·&nbsp;&nbsp;6:30 PM
								</p>
								<p className="text-sm text-ink-soft">
									<span className="font-medium text-ink">Location:</span>
									{" "}123 Park Avenue, New York, NY 10017
								</p>
							</div>

							<p className="text-sm text-ink-soft leading-relaxed">
								Join us for an exclusive evening with Ivy League graduates and top admissions
								advisors. Learn what colleges are really looking for, ask your most pressing
								questions, and leave with a clear action plan for your student&apos;s applications.
							</p>

							<Link
								href="/get-started"
								className="inline-flex items-center justify-center w-full sm:w-auto rounded-xl bg-[var(--navy)] px-7 py-3 text-sm font-semibold !text-[var(--cream)] hover:bg-[var(--navy-soft)] transition-colors"
							>
								Reserve your spot
							</Link>

							<div className="flex gap-2 pt-1">
								<input
									type="email"
									placeholder="Email for future events"
									className="flex-1 min-w-0 rounded-xl border border-[var(--line)] bg-[var(--cream)] px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-1 focus:ring-[var(--navy)]"
								/>
								<button
									type="button"
									className="shrink-0 rounded-xl border border-[var(--navy)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--navy)] hover:bg-[var(--navy)] hover:text-[var(--cream)] transition-colors"
								>
									Get Alerts
								</button>
							</div>

						</div>
					</div>

				</div>
			</Section>

			{/* ── Events We Host ─────────────────────────── */}
			<Section variant="white">
				<div className="max-w-5xl mx-auto py-20 px-8">

					<div className="flex flex-col items-center text-center gap-3 mb-12">
						<span className="eyebrow">Events We Host</span>
						<h2 className="font-playfair text-title font-semibold text-ink leading-snug">
							What to expect at Ivy Bridge events
						</h2>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{EVENT_TYPES.map(({ emoji, label }) => (
							<div
								key={label}
								className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--cream)] px-6 py-7 text-center hover:border-[var(--gold)]/50 transition-colors"
							>
								<span className="text-3xl leading-none">{emoji}</span>
								<p className="text-sm font-medium text-ink leading-snug">{label}</p>
							</div>
						))}
					</div>

				</div>
			</Section>

			{/* ── Past Events ────────────────────────────── */}
			<Section variant="navy">
				<div className="max-w-5xl mx-auto py-20 px-8">

					<span className="eyebrow">Past Events</span>
					<h2 className="font-playfair text-title font-semibold mt-3 mb-10">
						A look back at what we&apos;ve built together
					</h2>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
						{PAST_EVENTS.map(({ label, title, bg }) => (
							<div
								key={title}
								className="rounded-xl border border-white/10 overflow-hidden hover:border-[var(--gold)]/40 transition-colors"
							>
								<div className={`h-[180px] bg-gradient-to-br ${bg} flex items-end p-4`}>
									<span className="text-2xl select-none">📸</span>
								</div>
								<div className="bg-[var(--navy-mid)] px-4 py-4">
									<p className="text-[var(--cream-dim)] text-xs font-medium uppercase tracking-wider mb-1">
										{label}
									</p>
									<p className="font-playfair text-[var(--gold)] text-lg font-semibold leading-snug">
										{title}
									</p>
								</div>
							</div>
						))}
					</div>

				</div>
			</Section>

		</div>
	);
}
