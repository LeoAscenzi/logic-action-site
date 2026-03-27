import Link from "next/link";
import Navbar from "./nav/navbar";
import LanguageToggle from "./languageToggle";

export default function Header(){
    return (
    <div className="grid grid-cols-8 min-h-16 border-b-2 gold-text p-2">
        <Link 
            className="col-start-2 col-span-1 text-center content-center"
            href="/"
        >
            <img src="/logo-dark-text-right.png" className="max-h-[128px]"/>
        </Link>
        <div className="col-start-5 col-span-3 text-center content-center">
            <Navbar/>
        </div>
        <div className="text-center content-center">
            {/* <LanguageToggle/> TODO REENABLE LATER*/} 
        </div>
    </div>
    )
}