
interface InfoCardPropTypes {
    title: string,
    description: string,
}

export default function InfoCard({title, description}: InfoCardPropTypes) {
    return (
        <div className="grid grid-rows-2 text-left bg-white max-w-[100px]">
            <div>{title}</div>
            <div>{description}</div>
        </div>
    )
}