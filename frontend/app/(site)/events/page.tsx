import Image from "next/image";
import type { Metadata } from "next";
import Section from "@/app/components/section";
import HeroSection from "@/app/components/pageSections/HeroSection";
import RsvpForm from "@/app/components/events/RsvpForm";

export const metadata: Metadata = {
	title: "Events",
	description:
		"Upcoming Ivy Bridge Society events — talks, SAT & ACT workshops, college info nights, and parent meetups.",
	alternates: { canonical: "/events" },
	openGraph: {
		title: "Events · Ivy Bridge Society",
		description:
			"Upcoming Ivy Bridge Society events — talks, SAT & ACT workshops, college info nights, and parent meetups.",
		url: "/events",
	},
};

const EVENT_TYPES = [
	{ emoji: "🎓", label: "Talks by top school graduates"     },
	{ emoji: "📝", label: "SAT & ACT prep workshops"          },
	{ emoji: "🏛️", label: "College admissions info nights"    },
	{ emoji: "🤝", label: "Parent networking meetups"         },
	{ emoji: "💡", label: "Study strategy seminars"           },
	{ emoji: "🗺️", label: "Campus visit prep sessions"        },
];

const PAST_BG_GRADIENTS = [
	"from-[#1a2a4a] to-[#0d1120]",
	"from-[#2a1a3a] to-[#0d1120]",
	"from-[#1a3a2a] to-[#0d1120]",
];

const TIMEZONES: Record<string, string> = {
	"America/New_York":    "ET",
	"America/Chicago":     "CT",
	"America/Denver":      "MT",
	"America/Los_Angeles": "PT",
	"UTC":                 "UTC",
};

interface EventOut {
	id: number;
	title: string;
	event_date: string;
	event_time: string | null;
	event_timezone: string | null;
	location: string | null;
	description: string | null;
	image_url: string | null;
	current_capacity: number | null;
}

function formatDate(d: string) {
	return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
		weekday: "long", month: "long", day: "numeric", year: "numeric",
	});
}

function formatTime(t: string | null, tz: string | null) {
	if (!t) return null;
	const [h, m] = t.split(":");
	const hour = parseInt(h);
	const suffix = hour >= 12 ? "PM" : "AM";
	const label = `${hour % 12 || 12}:${m} ${suffix}`;
	const tzLabel = tz ? (TIMEZONES[tz] ?? tz) : "";
	return tzLabel ? `${label} ${tzLabel}` : label;
}

async function getEvents(): Promise<EventOut[]> {
	try {
		const res = await fetch(
			`${process.env.BACKEND_URL ?? "http://localhost:8000"}/community/events`,
			{ next: { revalidate: 300 } },
		);
		if (!res.ok) return [];
		return res.json();
	} catch {
		return [];
	}
}

export default async function EventsPage() {
	const events = await getEvents();
	const today = new Date().toISOString().slice(0, 10);
	const upcoming = events.filter(e => e.event_date >= today);
	const past     = events.filter(e => e.event_date <  today).reverse();
	const next     = upcoming[0] ?? null;

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

					{next ? (
						<div className="rounded-2xl overflow-hidden border border-[var(--line)] flex flex-col lg:flex-row shadow-[0_4px_32px_-8px_rgba(13,17,32,0.12)]">

							{/* Left: image or placeholder */}
							<div className="lg:w-[45%] min-h-[300px] bg-gradient-to-br from-[var(--navy-soft)] to-[var(--navy)] flex items-center justify-center relative overflow-hidden shrink-0">
								{next.image_url ? (
									<Image src={next.image_url} alt={next.title} fill className="object-cover" unoptimized />
								) : (
									<>
										<div className="absolute inset-0 opacity-20"
											style={{ backgroundImage: "radial-gradient(circle at 30% 60%, var(--gold) 0%, transparent 55%)" }}
										/>
										<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border border-[var(--gold)]/15" />
										<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border border-[var(--gold)]/25" />
										<span className="text-7xl relative z-10 select-none">🎓</span>
									</>
								)}
							</div>

							{/* Right: event details */}
							<div className="flex-1 bg-white flex flex-col gap-5 p-8 lg:p-10">

								<h3 className="font-playfair text-[1.4rem] font-semibold text-ink leading-snug">
									{next.title}
								</h3>

								<div className="flex flex-col gap-1.5">
									<p className="text-sm text-ink-soft">
										<span className="font-medium text-ink">Date:</span>
										{" "}{formatDate(next.event_date)}
										{formatTime(next.event_time, next.event_timezone) && (
											<>&nbsp;&nbsp;·&nbsp;&nbsp;{formatTime(next.event_time, next.event_timezone)}</>
										)}
									</p>
									{next.location && (
										<p className="text-sm text-ink-soft">
											<span className="font-medium text-ink">Location:</span>
											{" "}{next.location}
										</p>
									)}
								</div>

								{next.description && (
									<p className="text-sm text-ink-soft leading-relaxed">
										{next.description}
									</p>
								)}

								<RsvpForm eventId={next.id} />

							</div>
						</div>
					) : (
						<div className="rounded-2xl border border-dashed border-[var(--line)] p-16 text-center text-[var(--ink-soft)]">
							<p className="font-playfair text-2xl text-ink mb-2">No upcoming events</p>
							<p className="text-sm">Check back soon — we&apos;ll announce new events here.</p>
						</div>
					)}

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
			{past.length > 0 && (
				<Section variant="navy">
					<div className="max-w-5xl mx-auto py-20 px-8">

						<span className="eyebrow">Past Events</span>
						<h2 className="font-playfair text-title font-semibold mt-3 mb-10">
							A look back at what we&apos;ve built together
						</h2>

						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
							{past.map((ev, i) => (
								<div
									key={ev.id}
									className="rounded-xl border border-white/10 overflow-hidden hover:border-[var(--gold)]/40 transition-colors"
								>
									<div className={`h-[180px] ${ev.image_url ? "relative" : `bg-gradient-to-br ${PAST_BG_GRADIENTS[i % PAST_BG_GRADIENTS.length]}`} flex items-end p-4`}>
										{ev.image_url ? (
											<Image src={ev.image_url} alt={ev.title} fill className="object-cover" unoptimized />
										) : (
											<span className="text-2xl select-none">📸</span>
										)}
									</div>
									<div className="bg-[var(--navy-mid)] px-4 py-4">
										<p className="text-[var(--cream-dim)] text-xs font-medium uppercase tracking-wider mb-1">
											{new Date(ev.event_date + "T00:00:00").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
										</p>
										<p className="font-playfair text-[var(--gold)] text-lg font-semibold leading-snug">
											{ev.title}
										</p>
									</div>
								</div>
							))}
						</div>

					</div>
				</Section>
			)}

		</div>
	);
}
