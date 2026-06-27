import { SectionVariant } from "../lib/theme";

interface SectionPropTypes {
	children: React.ReactNode;
	variant?: SectionVariant;
	className?: string;
	tight?: boolean;
}

export default function Section({ children, variant = "cream", className, tight }: SectionPropTypes) {
	const sectionType = variant === "base" ? "cream" : variant === "alt" ? "navy" : variant;
	return (
		<div data-section={sectionType} className={`min-h-[${tight ? "200px" : "300px"}] h-full ${className ?? ""}`}>
			{children}
		</div>
	);
}
