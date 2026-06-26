import Section from "@/app/components/section";
import MentorCard from "@/app/components/cards/MentorCard";
import { getMentors } from "@/app/lib/getMentors";

export default async function MentorsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const mentors = await getMentors(locale);

    return (
        <div>
            <Section variant="navy">
                <div className="max-w-3xl mx-auto text-center py-24 px-8">
                    <span className="eyebrow">Mentors</span>
                    <h1 className="font-playfair text-4xl lg:text-5xl font-medium mb-6">
                        Mentors Who Have Walked the Road.
                    </h1>
                    <p className="lead text-lg">
                        Every Ivy Bridge mentor has achieved what your student is working toward. They&apos;re not just teachers — they&apos;re proof it&apos;s possible.
                    </p>
                </div>
            </Section>

            <Section variant="cream">
                <div className="max-w-6xl mx-auto py-20 px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mentors.map((mentor, i) => (
                            <MentorCard key={i} {...mentor} />
                        ))}
                    </div>
                </div>
            </Section>
        </div>
    );
}
