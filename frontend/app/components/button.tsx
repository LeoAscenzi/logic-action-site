"use client"
import { ButtonHTMLAttributes } from "react";
import { resolveTheme, buttonClasses } from "../lib/theme";
import { useTheme } from "../context/ThemeContext";

interface ButtonPropTypes extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode,
    variant?: "base" | "alt",
    className?: string,
}

export default function Button({children, className, variant="alt", ...restProps}: ButtonPropTypes){
    const {theme} = useTheme()
    const calcTheme = resolveTheme(theme, variant);

    const combinedClasses = `${buttonClasses[calcTheme]} rounded-sm ${className || ''}`;

    return (
        <button 
            className={combinedClasses} 
            {...restProps}
        >
                {children}
        </button>
    )
}