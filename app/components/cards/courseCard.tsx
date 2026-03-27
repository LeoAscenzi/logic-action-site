
interface CourseCardPropTypes {
    title: string,
    description: string,
}

export default function CourseCard({title, description}:CourseCardPropTypes) {
    return (
        <div className="grid grid-rows-2 text-left bg-[#F5F0E8] min-h-[300px] p-8 shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="grid items-start">
                <div className="font-playfair tracking-wide !font-semibold text-2xl ">{title}</div>
                <div className="font-inter gray-text py-2">{description}</div>
            </div>
            <div className="grid items-end">
                <a href="/programs" className="emphasis-text gold-text !font-bold hover:cursor-pointer">Learn More →</a>
            </div>
        </div>
    )
}