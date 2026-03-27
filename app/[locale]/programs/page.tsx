import InfoCard from "@/app/components/cards/infoCard";
import Section from "@/app/components/section";

export default function Classes() {
    return (
        <div>
            <Section>
                <div className="grid items-center justify-center gold-text pt-16 emphasis-text text-center">WHAT WE OFFER</div>
                <div className="grid items-center justify-center py-5 text-center">
                    <div className="font-playfair tracking-wide text-5xl lg:text-6xl inline">
                        Our <span className="gold-text">Programs</span>
                    </div>
                    <div className="grid min-w-[150px] max-w-[100px] border-b-2 pt-8 gold-text mx-auto"></div>
                    <div className="grid py-8 px-2 text-md lg:text-xl max-w-[500px] mx-auto">
                        From standardized testing to college admissions, every program is designed around your individual goals and learning style.
                    </div>
                </div>
            </Section>
            <Section variant="alt">
                <div className="bg-red-200 mx-8 py-4">
                    <div className="font-playfair tracking-wide text-4xl py-8">SAT Program</div>
                    <div className="border-b-1 gold-text"></div>
                    <div className="grid grid-cols-2 py-8">
                        <div>
                            What about
                        </div>
                        <div>
                            <InfoCard
                                title="test"
                                description="test"
                            />
                        </div>
                    </div>
                </div>
                <div className="bg-green-200">
                    <div>AP Courses</div>
                </div>
            </Section>
        </div>
    )
}