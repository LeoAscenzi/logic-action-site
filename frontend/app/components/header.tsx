import Link from "next/link";
import Navbar from "./nav/navbar";
import AuthHeaderButton from "./auth/AuthHeaderButton";

export default function Header() {
    return (
        <div className="sticky top-0 z-50 bg-[#1e2336]/80 backdrop-blur-md border-b border-[#2c3148]">
            <div className="grid grid-cols-[1fr_50vw_1fr] items-center h-[72px] px-8">
                <div className="flex justify-center">
                    <Link href="/">
                        <img src="/logo-dark-text-right.png" className="max-h-[48px]" />
                    </Link>
                </div>
                <div className="flex justify-center">
                    <Navbar />
                </div>
                <div className="flex justify-center">
                    <AuthHeaderButton />
                </div>
            </div>
        </div>
    );
}
