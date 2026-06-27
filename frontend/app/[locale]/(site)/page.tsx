import Link from "next/link";
import Section from "@/app/components/section";
import ResultsCarousel from "@/app/components/home/ResultsCarousel";
import CalloutSection from "@/app/components/CalloutSection";

const stats = [
							{ value: "+320",  label: "Average SAT Point Gain"         },
							{ value: "100%",  label: "Of students improved scores"    },
							{ value: "50+",   label: "Students placed in top schools" },
							{ value: "4.9★",  label: "Average family satisfaction"    },
						];
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	void locale;

	return (
		<div>

			{/* ── Hero ─────────────────────────────────── */}
			<Section variant="navy">
				<div className="flex flex-col items-center text-center pt-18 pb-10 px-8">

					<span className="eyebrow tracking-[0.22em]">
						NYC Test Prep&nbsp;&nbsp;·&nbsp;&nbsp;College Advisory&nbsp;&nbsp;·&nbsp;&nbsp;Academic Support
					</span>

					<div className="font-playfair text-5xl lg:text-7xl font-semibold leading-tight max-w-[500px] pb-4">
						<span className="text-white">Results.</span>{" "}
						<span className="text-[var(--gold)]">Not Promises.</span>
					</div>

					<p className="text-body text-cream-dim max-w-2xl leading-relaxed pb-6">
						NYC&apos;s premier education community for families with high goals.
					</p>

					<div className="flex flex-wrap justify-center gap-4">
						<Link
							href="/get-started#diagnostic"
							className="rounded-3xl bg-[var(--gold)] px-7 py-3 text-sm font-semibold !text-[var(--ink)] hover:bg-[var(--gold-light)] transition-colors whitespace-nowrap"
						>
							Get Your Diagnostic
						</Link>
						<Link
							href="/get-started#consultation"
							className="rounded-3xl border border-[var(--gold)] px-7 py-3 text-sm font-semibold text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--ink)] transition-colors whitespace-nowrap"
						>
							Book a Free Consultation
						</Link>
					</div>
				</div>

				<ResultsCarousel />
			</Section>

			{/* ── What We Are ──────────────────────────── */}
			<Section variant="cream">
				<div className="max-w-3xl mx-auto flex flex-col items-center text-center py-24 px-8 gap-4">
					<span className="eyebrow">What We Are</span>
					<h2 className="font-playfair text-title font-semibold leading-snug">
						More Than Tutoring. A Community Built for Results.
					</h2>
					<p className="text-body text-ink-soft leading-relaxed">
						Ivy Bridge Society is a supportive community where mentors who have walked the road guide you, aspirational peers connect and help each other, and elite families share resources and insights. We exist for one reason: your student&apos;s results.
					</p>
					<Link
						href="/community"
						className="mt-2 rounded-3xl bg-[var(--navy)] px-7 py-3 text-sm font-semibold !text-[var(--cream)] hover:bg-[var(--navy-mid)] transition-colors"
					>
						Join Our Community
					</Link>
				</div>
			</Section>

			{/* ── Our Approach ─────────────────────────── */}
			<Section variant="white">
				<div className="max-w-5xl mx-auto flex flex-col items-center text-center py-24 px-8 gap-4">
					<span className="eyebrow">Our Approach</span>
					<h2 className="font-playfair text-title font-semibold leading-snug max-w-2xl">
						Personalized Learning Growth Plans That Deliver Fast Results — and Benefit You Long-Term.
					</h2>
					<p className="text-body text-ink-soft leading-relaxed max-w-2xl">
						No generic plans. No universal frameworks. You want exceptional results, so we build the unique, tailored plan your student actually needs — designed to move fast and last.
					</p>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
						{[
							{
								title: "Expert Mentor Guidance",
								desc:  "Mentors from top schools who have achieved exactly what your student is working toward.",
								icon: (
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
										<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
									</svg>
								),
							},
							{
								title: "Tailored Growth Plans",
								desc:  "A precise, personalized roadmap built around your student's gaps, goals, and timeline — not a template.",
								icon: (
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
										<line x1="7" y1="17" x2="17" y2="7" />
										<polyline points="7 7 17 7 17 17" />
									</svg>
								),
							},
							{
								title: "Results-First Focus",
								desc:  "Every session, every recommendation is measured against one thing: your student's outcome.",
								icon: (
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
										<circle cx="12" cy="12" r="10" />
										<circle cx="12" cy="12" r="6" />
										<circle cx="12" cy="12" r="2" />
									</svg>
								),
							},
						].map(({ title, desc, icon }) => (
							<div key={title} className="bg-cream rounded-2xl border border-[var(--line)] p-6 flex flex-col gap-3 text-left">
								<div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center text-gold shrink-0">
									{icon}
								</div>
								<p className="font-playfair text-title font-semibold text-navy leading-snug">{title}</p>
								<p className="text-body text-ink-soft leading-relaxed">{desc}</p>
							</div>
						))}
					</div>
				</div>
			</Section>

			{/* ── Stats ────────────────────────────────── */}
			<Section variant="navy">
				<div className="max-w-5xl mx-auto py-24 px-8">
					<div className="text-center mb-16">
						<h2 className="font-playfair text-title font-semibold text-white">
							Results Are the Only Measurement That Matters.
						</h2>
						<p className="text-body text-cream-dim mt-4">Placeholder figures — replace with verified outcomes.</p>
					</div>

					<div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
						{stats.map(({ value, label }) => (
							<div key={label} className="flex flex-col items-center gap-2">
								<span className="font-playfair text-5xl lg:text-6xl font-semibold text-[var(--gold)]">
									{value}
								</span>
								<span className="text-cream-dim text-sm leading-snug max-w-[120px]">
									{label}
								</span>
							</div>
						))}
					</div>
				</div>
			</Section>

			{/* ── Testimonials ─────────────────────────── */}
			<Section variant="cream">
				<div className="max-w-6xl mx-auto py-24 px-8">
					<div className="text-center mb-14">
						<span className="eyebrow">Testimonials</span>
						<h2 className="font-playfair text-title font-semibold">
							What Families Say
						</h2>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{[
							{
								quote: "Our daughter went from a 1290 to a 1510. But what we valued most was the plan — they knew exactly what to fix and in what order.",
								name:  "The Reyes Family",
								loc:   "Upper West Side, NYC",
							},
							{
								quote: "We tried two other tutoring companies before Ivy Bridge. Nothing compared. Our son's ACT went from 26 to 34 in eight weeks.",
								name:  "The Kim Family",
								loc:   "Tribeca, NYC",
							},
							{
								quote: "The mentors don't just tutor — they show my daughter what's possible. She's more motivated than she's ever been.",
								name:  "The Okafor Family",
								loc:   "Brooklyn Heights, NYC",
							},
						].map(({ quote, name, loc }) => (
							<div
								key={name}
								className="bg-white rounded-2xl border border-[var(--line)] p-8 flex flex-col gap-5 shadow-sm"
							>
								<span className="font-playfair text-4xl text-[var(--gold)] leading-none select-none">&ldquo;</span>
								<p className="text-body text-ink leading-relaxed flex-1">{quote}</p>
								<div>
									<p className="font-semibold text-navy">{name}</p>
									<p className="text-sm text-ink-soft">{loc}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</Section>

			{/* ── Callout ──────────────────────────────── */}
			<CalloutSection
				eyebrow="Ready When You Are"
				title="Ready to start? Talk to us today."
				phone="(123) 456-7890"
				ctaText="Contact Us"
				ctaHref="/contact"
			/>

		</div>
	);
}
