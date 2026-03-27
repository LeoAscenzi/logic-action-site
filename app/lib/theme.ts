export type Theme = "dark" | "light";
export type Variant = "base" | "alt";

export const themeColors = {
    gold: "#D4AF37"
}
export const themeClasses = {
    light: "bg-[#f5f0e8] text-black",
    dark: "bg-[#0D0F14] text-[#f5f0e8]",
} as const;

export const buttonClasses = {
    light: "bg-[#D4AF37] emphasis-text text-white",
    dark: "bg-[#0D0F14] text-white",
} as const;

export function resolveTheme(
    globalTheme: Theme,
    variant: Variant,
): Theme {
    if (variant === "base") {return globalTheme;}
    return globalTheme === "dark" ? "light" : "dark";
}
