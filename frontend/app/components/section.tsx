"use client";
import { useTheme } from "../context/ThemeContext";
import { SectionVariant, resolveSection } from "../lib/theme";

interface SectionPropTypes {
    children: React.ReactNode;
    variant?: SectionVariant;
    className?: string;
}

export default function Section({ children, variant = "base", className }: SectionPropTypes) {
    const { theme } = useTheme();
    const sectionType = resolveSection(theme, variant);
    return (
        <div data-section={sectionType} className={`min-h-[300px] h-full ${className ?? ""}`}>
            {children}
        </div>
    );
}
