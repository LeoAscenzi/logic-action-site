interface FeatureListProps {
    eyebrow: string;
    title: string;
    items: string[];
}

export default function FeatureList({ eyebrow, title, items }: FeatureListProps) {
    return (
        <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2 className="font-playfair text-xl lg:text-2xl font-medium mb-4">{title}</h2>
            <ul className="list-none">
                {items.map((item, i) => (
                    <li
                        key={i}
                        className={`flex items-center gap-4 py-4 ${i < items.length - 1 ? "border-b border-white/15" : ""}`}
                    >
                        <span className="text-[var(--gold)] font-bold text-lg shrink-0">✓</span>
                        <span className="text-[var(--cream-dim)]">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
