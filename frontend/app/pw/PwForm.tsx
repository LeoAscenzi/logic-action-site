"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { inputCls } from "@/app/components/forms/formStyles";

export default function PwForm() {
	const searchParams             = useSearchParams();
	const from                     = searchParams.get("from") ?? "/";
	const [password, setPassword]  = useState("");
	const [error, setError]        = useState<string | null>(null);
	const [loading, setLoading]    = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/pw", {
				method:  "POST",
				headers: { "Content-Type": "application/json" },
				body:    JSON.stringify({ password, from }),
			});
			if (res.ok || res.redirected) {
				window.location.href = from;
			} else {
				const data = await res.json();
				setError(data.error ?? "Incorrect password");
			}
		} catch {
			setError("Something went wrong. Try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full max-w-sm mx-auto px-4">
			<div className="bg-[var(--navy-mid)] rounded-2xl border border-[var(--line-dark)] p-8 flex flex-col gap-6">
				<Image
					src="/logo-dark-text-right.png"
					alt="Ivy Bridge Society"
					width={160}
					height={54}
					className="h-[40px] w-auto self-center"
					priority
				/>

				<div className="text-center">
					<p className="text-sm text-cream-dim">This site is password protected.</p>
				</div>

				<form onSubmit={handleSubmit} className="flex flex-col gap-3">
					<input
						type="password"
						placeholder="Enter password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className={inputCls}
						autoFocus
						required
					/>
					{error && (
						<p className="text-red-400 text-xs">{error}</p>
					)}
					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-lg bg-[var(--gold)] text-[var(--ink)] py-2.5 text-sm font-semibold hover:bg-[var(--gold-light)] transition-colors disabled:opacity-60 cursor-pointer"
					>
						{loading ? "Checking…" : "Enter"}
					</button>
				</form>
			</div>
		</div>
	);
}
