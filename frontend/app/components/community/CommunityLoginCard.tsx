"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "http://localhost:3001";

export default function CommunityLoginCard() {
	const { user, login, logout } = useAuth();
	const [fields, setFields] = useState({ username: "", password: "" });
	const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
	const [error, setError] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setFields((f) => ({ ...f, [e.target.name]: e.target.value }));

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setStatus("loading");
		setError("");
		try {
			await login(fields.username, fields.password);
			// Stay on community page — auth state update re-renders this card
		} catch (err) {
			setStatus("error");
			setError(err instanceof Error ? err.message : "Login failed");
		}
	};

	const inputCls =
		"w-full rounded-lg border border-[var(--line)] bg-white px-4 py-2.5 text-sm text-[var(--ink)] " +
		"placeholder:text-[var(--ink-soft)] focus:outline-none focus:ring-1 focus:ring-[var(--navy)]";

	const labelCls = "text-[var(--ink)] text-xs font-inter font-semibold";

	// Logged-in state
	if (user) {
		return (
			<div className="bg-[var(--cream)] rounded-2xl p-8 shadow-[var(--shadow)]">
				<div className="font-playfair text-2xl text-[var(--ink)] mb-1">Welcome back, {user.fname}.</div>
				<p className="text-sm text-[var(--ink-soft)] mb-6">You&apos;re signed in as a {user.role}.</p>

				<a
					href={`${DASHBOARD_URL}/dashboard/${user.role}`}
					className="block w-full rounded-lg bg-[var(--navy)] text-[var(--cream)] py-2.5 text-sm font-semibold text-center hover:bg-[var(--navy-mid)] transition-colors mb-3"
				>
					Go to Dashboard →
				</a>

				<button
					onClick={() => logout()}
					className="block w-full rounded-lg border border-[var(--line)] text-[var(--ink-soft)] py-2.5 text-sm font-semibold text-center hover:border-[var(--ink-soft)] transition-colors"
				>
					Log Out
				</button>
			</div>
		);
	}

	// Logged-out state
	return (
		<div className="bg-[var(--cream)] rounded-2xl p-8 shadow-[var(--shadow)]">
			<div className="font-playfair text-2xl text-[var(--ink)] mb-1">Member Login</div>
			<p className="text-sm text-[var(--ink-soft)] mb-6">Welcome back. Sign in to access your resources.</p>

			<form onSubmit={handleSubmit} className="flex flex-col gap-3">
				<label className={labelCls}>Username</label>
				<input
					name="username"
					placeholder="Email or Username"
					value={fields.username}
					onChange={handleChange}
					required
					className={inputCls}
				/>
				<label className={labelCls}>Password</label>
				<input
					name="password"
					type="password"
					placeholder="••••••••"
					value={fields.password}
					onChange={handleChange}
					required
					className={inputCls}
				/>
				{status === "error" && (
					<p className="text-red-500 text-xs">{error}</p>
				)}
				<button
					type="submit"
					disabled={status === "loading"}
					className="w-full rounded-lg bg-[var(--navy)] text-[var(--cream)] py-2.5 text-sm font-semibold hover:bg-[var(--navy-mid)] hover:cursor-pointer transition-colors disabled:opacity-50 mt-1"
				>
					{status === "loading" ? "Signing in…" : "Log in"}
				</button>
			</form>

			<div className="flex items-center gap-3 my-6">
				<hr className="flex-1 border-[var(--line)]" />
				<span className="text-xs text-[var(--ink-soft)] whitespace-nowrap">Not a member yet?</span>
				<hr className="flex-1 border-[var(--line)]" />
			</div>

			<Link
				href="/get-started"
				className="block w-full rounded-lg bg-[var(--gold)] text-[var(--ink)] py-2.5 text-sm font-semibold text-center hover:bg-[var(--gold-light)] transition-colors"
			>
				Join Now
			</Link>
		</div>
	);
}
