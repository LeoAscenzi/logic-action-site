"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const inputCls =
	"w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] " +
	"placeholder:text-[var(--ink-soft)] focus:outline-none focus:ring-1 focus:ring-[var(--navy)]";
const labelCls = "block text-xs font-semibold text-[var(--ink-soft)] mb-1.5 uppercase tracking-wide";

interface InviteInfo { email: string; role: string }

export default function SignUpPage() {
	return <Suspense><SignUpForm /></Suspense>;
}

function SignUpForm() {
	const params    = useSearchParams();
	const router    = useRouter();
	const token     = params.get("invite") ?? "";

	const [invite, setInvite]       = useState<InviteInfo | null>(null);
	const [inviteError, setInviteError] = useState("");
	const [validating, setValidating]   = useState(true);

	const [username, setUsername]   = useState("");
	const [fname, setFname]         = useState("");
	const [lname, setLname]         = useState("");
	const [password, setPassword]   = useState("");
	const [confirm, setConfirm]     = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [formError, setFormError] = useState("");

	useEffect(() => {
		if (!token) { setInviteError("No invite token found. Ask Ivy Bridge for a new link."); setValidating(false); return; }
		fetch(`/api/invite/validate?token=${encodeURIComponent(token)}`)
			.then(r => r.ok ? r.json() : Promise.reject(r))
			.then((data: InviteInfo) => { setInvite(data); })
			.catch(() => { setInviteError("This invite link is invalid or has expired. Contact Ivy Bridge for a new one."); })
			.finally(() => setValidating(false));
	}, [token]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (password !== confirm) { setFormError("Passwords do not match."); return; }
		if (password.length < 8) { setFormError("Password must be at least 8 characters."); return; }
		setSubmitting(true);
		setFormError("");
		try {
			const res = await fetch("/api/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token, username, fname, lname, password }),
			});
			const data = await res.json();
			if (!res.ok) { setFormError(data.detail ?? "Registration failed."); return; }
			router.push("/community");
		} catch {
			setFormError("Something went wrong. Please try again.");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[var(--cream)]">
			<div className="w-full max-w-md">

				{validating ? (
					<div className="text-center text-[var(--ink-soft)] text-sm">Validating invite…</div>
				) : inviteError ? (
					<div className="rounded-2xl border border-[var(--line)] bg-white p-8 text-center shadow-sm">
						<p className="text-[var(--ink)] font-semibold mb-2">Invalid invite link</p>
						<p className="text-sm text-[var(--ink-soft)]">{inviteError}</p>
						<Link href="/" className="mt-6 inline-block text-sm text-[var(--navy)] underline underline-offset-2">
							Back to home
						</Link>
					</div>
				) : invite && (
					<div className="rounded-2xl border border-[var(--line)] bg-white p-8 shadow-sm">
						<h1 className="font-playfair text-2xl font-semibold text-[var(--ink)] mb-1">
							Create your account
						</h1>
						<p className="text-sm text-[var(--ink-soft)] mb-6">
							You&rsquo;re invited as a{" "}
							<span className="font-medium text-[var(--navy)] capitalize">{invite.role}</span>.
						</p>

						<form onSubmit={handleSubmit} className="flex flex-col gap-4">
							<div>
								<label className={labelCls}>Email</label>
								<input className={`${inputCls} bg-[var(--cream)] cursor-not-allowed`} value={invite.email} readOnly tabIndex={-1} />
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div>
									<label className={labelCls}>First Name</label>
									<input required className={inputCls} placeholder="Jane" value={fname} onChange={e => setFname(e.target.value)} />
								</div>
								<div>
									<label className={labelCls}>Last Name</label>
									<input required className={inputCls} placeholder="Smith" value={lname} onChange={e => setLname(e.target.value)} />
								</div>
							</div>

							<div>
								<label className={labelCls}>Username</label>
								<input required className={inputCls} placeholder="jsmith" value={username} onChange={e => setUsername(e.target.value)} />
							</div>

							<div>
								<label className={labelCls}>Password</label>
								<input required type="password" className={inputCls} placeholder="At least 8 characters" value={password} onChange={e => setPassword(e.target.value)} />
							</div>

							<div>
								<label className={labelCls}>Confirm Password</label>
								<input required type="password" className={inputCls} placeholder="Repeat password" value={confirm} onChange={e => setConfirm(e.target.value)} />
							</div>

							{formError && <p className="text-sm text-red-600">{formError}</p>}

							<button
								type="submit"
								disabled={submitting}
								className="w-full rounded-xl bg-[var(--navy)] py-3 text-sm font-semibold text-[var(--cream)] hover:bg-[var(--navy-soft)] transition-colors disabled:opacity-60 mt-2"
							>
								{submitting ? "Creating account…" : "Create account"}
							</button>
						</form>
					</div>
				)}

			</div>
		</div>
	);
}
