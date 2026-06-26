import { Program } from "../../lib/getPrograms"
import InfoCard from "../cards/infoCard"

export default function ProgramSection({title, description, facts, stats} : Program){
    return (
        <div id={`#${title}`} className="grid">
            <div className="font-playfair tracking-wide font-semibold text-4xl py-6">{title}</div>
            <div className="border-b-1 gold-text"></div>
            <div className="grid grid-cols-2 gap-3 py-4">
                <div>
                    <div className="font-inter text-lg pb-4">{description}</div>
                    <div className="font-inter text-md">
                        <ul className="">
                            {facts.map((fact: string, i: number) => {
                                return (
                                    <li key={i} className="mb-2">{fact}</li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
                <div className="grid grid-rows-4 gap-3">
                    {stats.map(({label, value}: {label: string, value: string}, i: number) => {
                        return (
                            <InfoCard
                                key={i}
                                title={label}
                                description={value}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}