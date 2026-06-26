"use client";
import { useTheme } from "../context/ThemeContext";
import { resolveTheme, themeClasses } from "../lib/theme"

interface SectionPropTypes {
    children: React.ReactNode,
    variant?: "base" | "alt", // todo replace this with global enum
    className?: string,
}
export default function Section({children, variant = "base", className} : SectionPropTypes){
    const {theme} = useTheme()
    const calcTheme = resolveTheme(theme, variant);
    return (
        <div className={`${themeClasses[calcTheme]} min-h-[300px] h-full ${className || ''}`}>
            {children}
        </div>
        )
}