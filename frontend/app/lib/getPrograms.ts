export type Program = {
    title: string;
    slug: string;
    category: string;    // "Test Prep" | "Academic" | "Advisory"
    description: string;
    facts?: string[];
    stats?: { label: string; value: string }[];
};

export async function getPrograms(locale: string): Promise<Program[]> {
    switch (locale) {
        case "zh":
            return (await import("@/data/programs/zh")).programs as Program[];
        case "en":
        default:
            return (await import("@/data/programs/en")).programs as Program[];
    }
}
