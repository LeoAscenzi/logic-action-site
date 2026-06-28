import Link from "next/link";
import { Program } from "@/app/lib/getPrograms";

export default function ProgramCard({ title, slug, category, description }: Program) {
    return (
        <div className="flex flex-col gap-4 bg-white rounded-2xl border border-[var(--line)] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[var(--gold)]">

            {/* Category tag */}
            <span className="self-start bg-[var(--cream)] text-[var(--gold)] text-xs font-semibold px-3 py-1 rounded-full">
                {category}
            </span>

            {/* Title + description */}
            <div className="flex flex-col gap-2 flex-1">
                <h3 className="font-playfair text-xl font-semibold text-[var(--navy)] leading-snug">
                    {title}
                </h3>
                <p className="text-sm text-[var(--ink-soft)] leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto pt-2">
                {/* <Link
                    href={`/programs/${slug}`}
                    className="flex-1 text-center rounded-2xl border border-[var(--navy)] text-[var(--navy)] bg-white text-sm font-semibold py-2 hover:bg-[var(--navy)] hover:text-white transition-colors"
                >
                    Learn More
                </Link> */}
                <Link
                    href="/get-started"
                    className="flex-1 text-center rounded-2xl bg-[var(--navy)] !text-[var(--cream)] text-sm font-semibold py-2 hover:bg-[var(--navy-mid)] transition-colors"
                >
                    Get Started
                </Link>
            </div>
        </div>
    );
}
