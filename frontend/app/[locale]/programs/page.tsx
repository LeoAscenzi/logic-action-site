import ProgramSection from "@/app/components/pageSections/programSection";
import Section from "@/app/components/section";
import { getPrograms, Program } from "@/app/lib/getPrograms";

export default async function Classes({params} : {params: Promise<{locale: string}>}) {
    const { locale } = await params;
    const programs: Program[] = await getPrograms(locale);
    console.log(programs);

    return (
        <div>
            <Section>
                <div className="grid items-center justify-center gold-text pt-16 emphasis-text text-center">WHAT WE OFFER</div>
                <div className="grid items-center justify-center py-5 text-center">
                    <div className="font-playfair tracking-wide text-5xl lg:text-6xl inline text-center">
                        Our <span className="gold-text">Programs</span>
                    </div>
                    <div className="grid min-w-[150px] max-w-[100px] border-b-2 pt-8 gold-text mx-auto"></div>
                    <div className="grid py-8 px-2 text-md lg:text-xl max-w-[500px] mx-auto">
                        From standardized testing to college admissions, every program is designed around your individual goals and learning style.
                    </div>
                </div>
            </Section>
            <Section variant="alt">
                <div className="max-w-[70%] lg:max-w-[70%] xl:max-w-[60%] mx-auto py-8">
                    {programs.map((program: Program, i: number) => {
                        return (
                            <ProgramSection
                                key={i}
                                {...program}
                        />)
                    })}
                </div>
            </Section>
        </div>
    )
}