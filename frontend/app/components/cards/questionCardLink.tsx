
export default function QuestionCardLink({qNum, question} : {qNum: string, question: string}) {
    return (
        <div className="grid grid-cols-[auto_1fr] border-b-1 border-gray-200 pb-2 px-2">
            <div className="grid p-r-4 gold-text pr-2 opacity-80">{qNum}</div>
            <a href={`#q${qNum}`} className="grid !text-black hover:!text-[#D4AF37] font-inter text-sm">{question}</a>
        </div>
    )
}