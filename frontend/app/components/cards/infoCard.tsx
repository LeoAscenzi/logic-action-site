
interface InfoCardPropTypes {
    title: string,
    description: string,
}

export default function InfoCard({title, description}: InfoCardPropTypes) {
    return (
        <div className="grid grid-rows-2 text-left bg-white border-l-3 gold-text p-2">
            <div className="emphasis-text gold-text p-2">{title}</div>
            <div className="font-inter text-black text-sm px-2">{description}</div>
        </div>
    )
}