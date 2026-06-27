"use client";
import { useState } from "react";

const RESULTS = [
    { title: "ACT Score Result",   subtitle: "26 → 34"            },
    { title: "SAT Score Result",   subtitle: "1280 → 1540"        },
    { title: "College Admission",  subtitle: "Harvard University"  },
    { title: "SSAT Percentile",    subtitle: "67th → 92nd"        },
    { title: "GPA Improvement",    subtitle: "3.1 → 3.8"          },
    { title: "AP Exam Score",      subtitle: "3 → 5"              },
    { title: "ACT Score Result",   subtitle: "23 → 31"            },
    { title: "SAT Score Result",   subtitle: "1150 → 1430"        },
];

const TRACK = [...RESULTS, ...RESULTS];

export default function ResultsCarousel() {
    const [paused, setPaused] = useState(false);

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
            `}</style>

            <div
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                style={{
                    display: "flex",
                    width: "fit-content",
                    animation: "carousel-scroll 50s linear infinite",
                    animationPlayState: paused ? "paused" : "running",
                    willChange: "transform",
                }}
            >
                {TRACK.map((item, i) => (
                    <div
                        key={i}
                        style={{ marginRight: "20px" }}
                        className="w-72 shrink-0 rounded-xl border border-white/20 overflow-hidden"
                    >
                        <div className="h-[200px] bg-[var(--navy-soft)] flex items-end p-3">
                            <span className="text-[var(--line-dark)] text-[10px] uppercase tracking-widest">
                                Photo
                            </span>
                        </div>
                        <div className="bg-[var(--navy-mid)] px-4 py-3">
                            <div className="text-[var(--cream-dim)] text-xs font-medium uppercase tracking-wider mb-0.5">
                                {item.title}
                            </div>
                            <div className="font-playfair text-[var(--gold)] text-xl font-semibold leading-tight">
                                {item.subtitle}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
