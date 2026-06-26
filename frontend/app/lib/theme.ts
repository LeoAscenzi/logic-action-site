export type Theme = "dark" | "light";
export type SectionVariant = "navy" | "cream" | "white" | "base" | "alt";
export type SectionType = "navy" | "cream" | "white";

export const themeColors = {
    gold:      "#c9a84c",
    goldLight: "#e2c97e",
    navy:      "#0d1120",
    cream:     "#f5f0e8",
    creamDim:  "#d4c9b0",
    ink:       "#14182a",
};

export const themeClasses = {
    light: "bg-[#f5f0e8] text-[#14182a]",
    dark:  "bg-[#0d1120] text-[#f5f0e8]",
} as const;

export const buttonClasses = {
    light: "bg-[#c9a84c] emphasis-text text-[#14182a]",
    dark:  "bg-[#0d1120] text-[#f5f0e8]",
} as const;

export function resolveSection(
    globalTheme: Theme,
    variant: SectionVariant,
): SectionType {
    if (variant === "navy")  return "navy";
    if (variant === "cream") return "cream";
    if (variant === "white") return "white";
    if (variant === "base")  return globalTheme === "dark" ? "navy" : "cream";
    return globalTheme === "dark" ? "cream" : "navy"; // alt inverts
}

// Kept for Button component compatibility
export function resolveTheme(globalTheme: Theme, variant: "base" | "alt"): Theme {
    if (variant === "base") return globalTheme;
    return globalTheme === "dark" ? "light" : "dark";
}
