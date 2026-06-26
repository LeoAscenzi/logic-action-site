import Section from "@/app/components/section";
import FeatureList from "@/app/components/community/FeatureList";
import CommunityLoginCard from "@/app/components/community/CommunityLoginCard";

export default function CommunityPage() {
    return (
        <div>
            <Section variant="navy">
                <div className="max-w-3xl mx-auto text-center py-24 px-8">
                    <span className="eyebrow">Members Only</span>
                    <h1 className="font-playfair text-4xl lg:text-5xl font-medium mb-6">
                        The Ivy Bridge Community
                    </h1>
                    <p className="lead text-lg">
                        A private network for families with high goals. Elite resources, peer
                        connections, and mentor access — all in one place.
                    </p>
                </div>
            </Section>

            <Section variant="navy">
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 py-20 px-8 items-start">
                    <FeatureList
                        eyebrow="What's Inside"
                        title="Everything your family needs, in one private space."
                        items={[
                            "Premium test prep resources",
                            "Mentor Q&As",
                            "Parent discussions",
                            "Early access to IRL events",
                            "Curated college admissions insights"
                        ]}
                    />
                    <CommunityLoginCard />
                </div>
            </Section>
        </div>
    );
}
