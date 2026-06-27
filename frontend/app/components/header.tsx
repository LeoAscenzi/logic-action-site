import Image from "next/image";
import Link from "next/link";
import Navbar from "./nav/navbar";
import AuthHeaderButton from "./auth/AuthHeaderButton";
import MobileMenu from "./MobileMenu";

export default function Header() {
	return (
		<div className="sticky top-0 z-50 bg-[#1e2336]/80 backdrop-blur-md border-b border-[#2c3148]">

			{/* Mobile: logo left, burger right */}
			<div className="flex md:hidden items-center justify-between h-[72px] px-6">
				<Link href="/">
					<Image src="/logo-dark-text-right.png" alt="Ivy Bridge Society" width={118} height={40} className="max-h-[40px] w-auto" priority />
				</Link>
				<MobileMenu />
			</div>

			{/* Desktop: logo | nav | auth */}
			<div className="hidden md:grid grid-cols-[1fr_50vw_1fr] items-center h-[72px] px-8">
				<div className="flex justify-center">
					<Link href="/">
						<Image src="/logo-dark-text-right.png" alt="Ivy Bridge Society" width={142} height={48} className="max-h-[48px] w-auto" priority />
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
