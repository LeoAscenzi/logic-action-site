import QuestionCardLink from "@/app/components/cards/questionCardLink";
import QuestionSection from "@/app/components/pageSections/questionSection";
import Section from "@/app/components/section";
import { faqType, getFAQs } from "@/app/lib/getFAQs";

export default async function FAQ({params} : {params: Promise<{locale: string}>}){
    const { locale } = await params;
    const faqData = await getFAQs(locale)
    return (
        <div>
            <Section>
                <div className="grid items-center justify-center gold-text pt-16 emphasis-text text-center">HAVE QUESTIONS</div>
                <div className="grid items-center justify-center py-5 text-center">
                    <div className="font-playfair tracking-wide text-5xl lg:text-6xl inline text-center">
                        Our <span className="gold-text">Frequently Asked Questions</span>
                    </div>
                    <div className="grid min-w-[150px] max-w-[100px] border-b-2 pt-8 gold-text mx-auto"></div>
                    <div className="grid py-8 px-2 text-md lg:text-xl max-w-[500px] mx-auto">
                        Everything you need to know about our programs, process, and what it means to join the Ivy Bridge community.
                    </div>
                </div>
            </Section>
            <Section variant="alt" className="border-b-1 gold-text pb-2">
                <div className="max-w-[70%] lg:max-w-[70%] xl:max-w-[60%] mx-auto py-8">
                    <div className="emphasis-text gold-text text-left pb-4">Jump to a Question</div>
                    <div className="grid grid-cols-3 gap-x-6 gap-y-2">
                        {faqData.map(({question}, i) => {
                            return (
                                <QuestionCardLink
                                    key={i}
                                    qNum={(i+1).toString().padStart(2, "0")}
                                    question={question}
                                />
                            )
                        })}
                    </div>
                </div>
            </Section>
            <Section variant="alt">
                <div className="max-w-[70%] lg:max-w-[70%] xl:max-w-[60%] mx-auto py-8">
                    <div className="grid gap-3">
                        {faqData.map((faq: faqType, i: number) => {
                            return (
                                <QuestionSection
                                    key={i}
                                    qNum={(i+1).toString().padStart(2, "0")}
                                    {...faq}
                                />
                            )
                        })}
                    </div>
                </div>
            </Section>
        </div>
    )
}