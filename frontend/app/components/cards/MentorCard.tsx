import Image from "next/image";
import { Mentor } from "@/app/lib/getMentors";

function initials(name: string) {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function MentorCard({ name, year, school, photo, description, tags }: Mentor) {
    return (
        <div className="flex flex-col items-center text-center gap-4 bg-white rounded-2xl border border-[var(--line)] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[var(--gold)]">

            {/* Profile photo / initials avatar */}
            {photo ? (
                <Image
                    src={photo}
                    alt={name}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover shrink-0"
                />
            ) : (
                <div className="w-24 h-24 rounded-full bg-[var(--gold)] flex items-center justify-center shrink-0">
                    <span className="font-playfair text-2xl font-semibold text-[var(--navy)]">
                        {initials(name)}
                    </span>
                </div>
            )}

            {/* Name */}
            <h3 className="font-playfair text-xl font-semibold text-[var(--navy)] leading-tight">
                {name}
            </h3>

            {/* School pill */}
            <span className="bg-[var(--gold-light)] text-[var(--ink)] text-xs font-semibold px-3 py-1 rounded-full">
                {year} &nbsp;|&nbsp; {school}
            </span>

            {/* Description */}
            <p className="text-sm text-[var(--ink-soft)] leading-relaxed">
                {description}
            </p>

            {/* Tag pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-auto">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="bg-[var(--cream)] text-[var(--gold)] text-xs font-medium px-3 py-1 rounded-full"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}
