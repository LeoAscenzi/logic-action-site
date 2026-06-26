export type Mentor = {
    name: string;
    year: string;        // e.g. "Class of 2024"
    school: string;      // e.g. "Harvard University"
    photo?: string;      // path in /public, e.g. "/mentors/jane.jpg" — omit for initials avatar
    description: string;
    tags: string[];
};

export async function getMentors(locale: string): Promise<Mentor[]> {
    switch (locale) {
        case "en":
        default:
            return (await import("@/data/mentors/en")).mentors;
    }
}
