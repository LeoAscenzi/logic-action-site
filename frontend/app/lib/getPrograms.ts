export type Program = {
    title: string;
    slug: string;
    category: string;    // "Test Prep" | "Academic" | "Advisory"
    description: string;
    facts?: string[];
    stats?: { label: string; value: string }[];
};

export async function getPrograms(): Promise<Program[]> {
    return (await import("@/data/programs/en")).programs as Program[];
}
