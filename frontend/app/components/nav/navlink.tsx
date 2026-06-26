"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavlinkPropTypes {
    url: string;
    text: string;
}

export default function Navlink({ url, text }: NavlinkPropTypes) {
    const pathname = usePathname();
    const normalizedPath = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";
    const selected = normalizedPath === url;
    
    return (
        <Link
            className={`nav-link font-sans font-medium tracking-wider transition-colors ${selected ? "active" : ""}`}
            href={url}
        >
            {text}
        </Link>
    );
}
