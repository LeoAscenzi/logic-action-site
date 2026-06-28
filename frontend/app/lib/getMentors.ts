export type Mentor = {
    name: string;
    major: string;
    school: string;
    photo?: string;
    description: string;
    tags: string[];
};

export async function getMentors(): Promise<Mentor[]> {
    return (await import("@/data/mentors/en")).mentors;
}
