"use client";
import { useState } from "react";

export default function RsvpForm({ eventId }: { eventId: number }) {
	const [name, setName]       = useState("");
	const [email, setEmail]     = useState("");
	const [status, setStatus]   = useState<"idle" | "loading" | "success" | "error">("idle");
	const [error, setError]     = useState("");

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setStatus("loading");
		setError("");
		try {
			const res = await fetch(`/api/community/events/${eventId}/rsvp`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: name.trim(), email: email.trim() }),
			});
			if (res.status === 409) {
				setStatus("success"); // already registered — treat as success
				return;
			}
			if (!res.ok) throw new Error("Request failed");
			setStatus("success");
		} catch {
			setError("Something went wrong. Please try again.");
			setStatus("error");
		}
	}

	if (status === "success") {
		return (
			<div className="rounded-xl border border-green-200 bg-green-50 px-6 py-4 text-sm text-green-800">
				<span className="font-semibold">You&rsquo;re on the list!</span> We&rsquo;ll be in touch with details closer to the date.
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-3">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<input
					required
					type="text"
					placeholder="Your name"
					value={name}
					onChange={e => setName(e.target.value)}
					className="rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-1 focus:ring-[var(--navy)]"
				/>
				<input
					required
					type="email"
					placeholder="Email address"
					value={email}
					onChange={e => setEmail(e.target.value)}
					className="rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-1 focus:ring-[var(--navy)]"
				/>
			</div>
			{error && <p className="text-sm text-red-600">{error}</p>}
			<button
				type="submit"
				disabled={status === "loading"}
				className="inline-flex items-center justify-center w-full sm:w-auto rounded-xl bg-[var(--navy)] px-7 py-3 text-sm font-semibold !text-[var(--cream)] hover:bg-[var(--navy-soft)] transition-colors disabled:opacity-60"
			>
				{status === "loading" ? "Reserving…" : "Reserve your spot"}
			</button>
		</form>
	);
}
