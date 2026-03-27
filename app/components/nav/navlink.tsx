"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavlinkPropTypes {
    url: string,
    text: string,
}
export default function Navlink({url, text}: NavlinkPropTypes) {

    const pathname = usePathname();
    // remove locale (e.g. /en, /es)
    const normalizedPath = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");
    const selected = normalizedPath === url;

    return (
        <Link
            className={`font-inter font-medium tracking-wider uppercase hover:text-[#D4AF37] ${selected ? "!text-[#D4AF37]" : "text-white"}`} 
            href={url}>{text}
        </Link>
    )
}