"use client";
import { useState } from "react";
import Image from "next/image";

const RESULTS = [
	{ title: "ACT Score Result",   subtitle: "26 → 34",           image: "/carousel/result-1.PNG" },
	{ title: "SAT Score Result",   subtitle: "1280 → 1540",       image: "/carousel/result-2.PNG" },
	{ title: "College Admission",  subtitle: "Harvard University", image: "/carousel/result-3.PNG" },
	{ title: "SSAT Percentile",    subtitle: "67th → 92nd",       image: "/carousel/result-4.PNG" },
	{ title: "GPA Improvement",    subtitle: "3.1 → 3.8",         image: "/carousel/result-5.PNG" },
	{ title: "AP Exam Score",      subtitle: "3 → 5",             image: "/carousel/result-6.PNG" },
	{ title: "ACT Score Result",   subtitle: "23 → 31",           image: "/carousel/result-7.PNG" },
	{ title: "SAT Score Result",   subtitle: "1150 → 1430",       image: "/carousel/result-8.JPG" },
];

const TRACK = [...RESULTS, ...RESULTS];

export default function ResultsCarousel() {
	const [paused, setPaused]           = useState(false);
	const [hoveredCard, setHoveredCard] = useState<number | null>(null);

	return (
		<div
			className="w-full overflow-hidden py-12"
			style={{
				maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
				WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
			}}
		>
			<style>{`
				@keyframes carousel-scroll {
					from { transform: translateX(0); }
					to   { transform: translateX(-50%); }
				}
				@keyframes holo-sweep {
					0%   { transform: translateX(-120%) skewX(-15deg); }
					100% { transform: translateX(400%)  skewX(-15deg); }
				}
				@keyframes holo-rainbow {
					0%   { background-position: 0% 50%; }
					100% { background-position: 200% 50%; }
				}
			`}</style>

			<div
				onMouseEnter={() => setPaused(true)}
				onMouseLeave={() => { setPaused(false); setHoveredCard(null); }}
				style={{
					display: "flex",
					width: "fit-content",
					animation: "carousel-scroll 50s linear infinite",
					animationPlayState: paused ? "paused" : "running",
					willChange: "transform",
				}}
			>
				{TRACK.map((item, i) => {
					const hovered = hoveredCard === i;
					return (
						<div
							key={i}
							onMouseEnter={() => setHoveredCard(i)}
							onMouseLeave={() => setHoveredCard(null)}
							style={{
								marginRight: "20px",
								position: "relative",
								zIndex: hovered ? 10 : 1,
								transform: hovered ? "scale(1.07)" : "scale(1)",
								transition: "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease",
								boxShadow: hovered
									? "0 24px 48px rgba(0,0,0,0.55), 0 0 28px rgba(201,168,76,0.22)"
									: "0 0 0 rgba(0,0,0,0)",
							}}
							className="w-72 shrink-0 rounded-xl border border-white/20 overflow-hidden"
						>
							<div className="relative h-[200px]">
								<Image
									src={item.image}
									alt={item.title}
									fill
									className="object-cover"
								/>
							</div>

							{/* Holographic rainbow tint */}
							<div
								className="absolute inset-0 pointer-events-none rounded-xl"
								style={{
									opacity: hovered ? 1 : 0,
									transition: "opacity 0.3s ease",
									background: "linear-gradient(115deg, transparent 0%, rgba(255,100,100,0.07) 20%, rgba(255,220,80,0.09) 35%, rgba(80,255,160,0.09) 50%, rgba(80,160,255,0.09) 65%, rgba(200,80,255,0.07) 80%, transparent 100%)",
									backgroundSize: "200% 100%",
									animation: hovered ? "holo-rainbow 2.5s linear infinite" : "none",
									mixBlendMode: "screen",
								}}
							/>

							{/* Shine sweep */}
							<div
								className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
								style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.2s ease" }}
							>
								<div
									style={{
										position: "absolute",
										top: "-50%",
										left: 0,
										width: "40%",
										height: "200%",
										background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 35%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.1) 65%, transparent)",
										animation: hovered ? "holo-sweep 1.4s ease-out infinite" : "none",
										animationDelay: "0.1s",
									}}
								/>
							</div>

							{/* <div className="bg-[var(--navy-mid)] px-4 py-3">
								<div className="text-[var(--cream-dim)] text-xs font-medium uppercase tracking-wider mb-0.5">
									{item.title}
								</div>
								<div className="font-playfair text-[var(--gold)] text-xl font-semibold leading-tight">
									{item.subtitle}
								</div>
							</div> */}
						</div>
					);
				})}
			</div>
		</div>
	);
}
