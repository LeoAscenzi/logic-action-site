"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useAdminSection } from "@/app/context/AdminSectionContext";

const ADMIN_SECTIONS = [
	{ key: "students" as const, label: "Students" },
	{ key: "classes"  as const, label: "Classes"  },
	{ key: "grades"   as const, label: "Grades"   },
];

export default function DashboardSidebar() {
	const { user, logout }        = useAuth();
	const router                  = useRouter();
	const pathname                = usePathname();
	const { section, setSection } = useAdminSection();

	const isAdminPage = pathname.includes("/dashboard/admin");

	const handleLogout = async () => {
		await logout();
		router.replace("/en");
	};

	return (
		<aside className="hidden md:flex flex-col w-56 min-h-screen bg-[#0D0F14] border-r border-[#D4AF37]/30 p-6 gap-6">
			<Link href="/" className="mb-2">
				<Image src="/logo-light-main.png" alt="Ivy Bridge Society" width={64} height={64} className="max-h-16 w-auto" priority />
			</Link>

			{user && (
				<div className="flex flex-col gap-1 pb-4 border-b border-[#D4AF37]/20">
					<span className="font-semibold text-[#D4AF37]">{user.fname} {user.lname}</span>
					<span className="text-xs text-[#f5f0e8]/50 capitalize tracking-wide">{user.role}</span>
				</div>
			)}

			<nav className="flex flex-col gap-1 flex-1 text-sm">
				{user?.role === "admin" && isAdminPage && ADMIN_SECTIONS.map(({ key, label }) => (
					<button
						key={key}
						onClick={() => setSection(key)}
						className={`text-left rounded-lg px-3 py-2 transition-colors ${
							section === key
								? "bg-[#D4AF37]/15 text-[#D4AF37] font-medium"
								: "text-[#f5f0e8]/80 hover:text-[#D4AF37] hover:bg-white/5"
						}`}
					>
						{label}
					</button>
				))}
				{user?.role === "admin" && !isAdminPage && (
					<Link
						href="/en/dashboard/admin"
						className="rounded-lg px-3 py-2 text-[#f5f0e8]/80 hover:text-[#D4AF37] hover:bg-white/5 transition-colors"
					>
						Admin Dashboard
					</Link>
				)}
				{user?.role === "parent" && (
					<Link
						href="/en/dashboard/parent"
						className="rounded-lg px-3 py-2 text-[#f5f0e8]/80 hover:text-[#D4AF37] hover:bg-white/5 transition-colors"
					>
						My Students
					</Link>
				)}
			</nav>

			<button
				onClick={handleLogout}
				className="rounded-lg border border-[#D4AF37]/50 px-3 py-2 text-sm text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D0F14] transition-colors font-medium"
			>
				Log Out
			</button>
		</aside>
	);
}
