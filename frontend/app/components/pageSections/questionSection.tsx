import { faqType } from "@/app/lib/getFAQs"

export default function QuestionSection({question, answer, qNum} : faqType & {qNum: string}){
    return (
        <div id={`q${qNum}`} className="grid grid-cols-[auto_1fr] pb-2">
            <div className="grid font-playfair gold-text text-3xl opacity-[0.5] pr-8">{qNum}</div>
            <div className="grid">
                <div className="font-playfair tracking-wide font-semibold text-2xl pb-2">{question}</div>
                <div className="font-inter text-md gray-text">{answer}</div>
            </div>
        </div>
    )
}