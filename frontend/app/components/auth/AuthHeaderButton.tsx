"use client";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "http://localhost:3001";

export default function AuthHeaderButton() {
	const { user, isLoading, logout } = useAuth();

	if (isLoading) return <span className="w-32" />;

	if (!user) {
		return (
			<Link
				href="/get-started#consultation"
				className="rounded-lg bg-[var(--gold)] px-4 py-2 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--gold-light)] transition-colors whitespace-nowrap"
			>
				Book a Consultation
			</Link>
		);
	}

	return (
		<div className="flex items-center gap-3 text-sm">
			<a
				href={`${DASHBOARD_URL}/dashboard/${user.role}`}
				className="font-semibold text-[var(--gold)] hover:underline whitespace-nowrap"
			>
				{user.fname}
			</a>
			<button
				onClick={() => logout()}
				className="rounded-lg border border-[var(--gold)] px-3 py-1 text-xs text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-colors"
			>
				Log Out
			</button>
		</div>
	);
}
