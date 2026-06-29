"use client";
import { useEffect, useState } from "react";
import { InlineWidget, useCalendlyEventListener } from "react-calendly";

const calendarHeight = "550px";
function CalendarSkeleton() {
	return (
		<div className="bg-white flex flex-col p-6 gap-5" style={{ height: calendarHeight }}>
			{/* Event title */}
			<div className="shimmer-block h-5 w-44 mx-auto mt-2" />

			{/* Month nav */}
			<div className="flex items-center justify-between px-4 mt-4">
				<div className="shimmer-block h-7 w-7 rounded-full" />
				<div className="shimmer-block h-5 w-32" />
				<div className="shimmer-block h-7 w-7 rounded-full" />
			</div>

			{/* Day-of-week headers */}
			<div className="grid grid-cols-7 gap-2 px-2">
				{Array.from({ length: 7 }).map((_, i) => (
					<div key={i} className="shimmer-block h-3.5 mx-1 rounded-full" />
				))}
			</div>

			{/* Calendar day cells — 5 weeks */}
			<div className="grid grid-cols-7 gap-y-2 px-1">
				{Array.from({ length: 35 }).map((_, i) => (
					<div key={i} className="flex justify-center">
						<div className="shimmer-block h-9 w-9 rounded-full" />
					</div>
				))}
			</div>

			{/* Timezone row */}
			<div className="flex items-center gap-2 mt-auto px-2">
				<div className="shimmer-block h-4 w-4 rounded-full" />
				<div className="shimmer-block h-4 w-36" />
			</div>
		</div>
	);
}

export default function CalendlyEmbed() {
	const url = process.env.NEXT_PUBLIC_CALENDLY_SCHEDULE_CONSULTATION_LINK;
	const [loaded, setLoaded] = useState(false);

	useCalendlyEventListener({
		onEventTypeViewed: () => setLoaded(true),
	});

	// Fallback: reveal widget after 12s even if the event never fires
	useEffect(() => {
		const t = setTimeout(() => setLoaded(true), 12000);
		return () => clearTimeout(t);
	}, []);

	if (!url) return null;

	return (
		<div className="rounded-2xl overflow-hidden border border-[var(--line)]">
			{/* Skeleton shown in normal flow while widget is hidden */}
			{!loaded && <CalendarSkeleton />}

			{/*
			  * Widget always in DOM so Calendly loads in background.
			  * visibility:hidden keeps it loading + firing postMessage events
			  * without being visible or creating z-index conflicts with skeleton.
			  */}
			<div style={{ visibility: loaded ? "visible" : "hidden", height: loaded ? "auto" : 0, overflow: "hidden" }}>
				<InlineWidget
					url={url}
					styles={{ minWidth: "320px", height: calendarHeight }}
					pageSettings={{ hideEventTypeDetails: true }}
				/>
			</div>
		</div>
	);
}
