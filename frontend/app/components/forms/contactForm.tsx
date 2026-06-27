"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { inputCls, labelCls, validatePhone } from "./formStyles";

type FormData = {
	name:    string;
	email:   string;
	phone?:  string;
	message: string;
};

export default function ContactForm() {
	const [submitted, setSubmitted]     = useState(false);
	const [submitting, setSubmitting]   = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<FormData>();

	const onSubmit = async (data: FormData) => {
		setSubmitting(true);
		setServerError(null);
		try {
			await axios.post(`${process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_US}`, data);
			setSubmitted(true);
			reset();
		} catch (err) {
			const error = err as AxiosError<{ error: string }>;
			setServerError(error.response?.data?.error ?? "Something went wrong.");
		} finally {
			setSubmitting(false);
		}
	};

	if (submitted) {
		return (
			<div className="bg-white ml-[-100px] min-w-2xl rounded-2xl p-8 shadow-[var(--shadow-sm)] flex flex-col items-center justify-center gap-4 min-h-[340px]">
				<p className="text-2xl">✓</p>
				<p className="font-playfair text-xl font-semibold text-[var(--navy)]">Message sent!</p>
				<p className="text-sm text-[var(--ink-soft)] text-center max-w-xs">
					We&apos;ll be in touch within 24 hours.
				</p>
			</div>
		);
	}

	return (
		<div className="bg-white lg:ml-[-100px] lg:min-w-2xl rounded-2xl p-8 shadow-[var(--shadow-sm)]">
			<h2 className="font-playfair text-2xl font-semibold text-[var(--navy)] mb-6">
				Send Us a Message
			</h2>

			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>

				<div className="flex flex-col gap-1.5">
					<label className={labelCls}>Name</label>
					<input
						type="text"
						placeholder="Your full name"
						className={inputCls}
						{...register("name", { required: "Name is required" })}
					/>
					{errors.name && (
						<p className="text-red-500 text-xs mt-0.5">{errors.name.message}</p>
					)}
				</div>

				<div className="flex flex-col gap-1.5">
					<label className={labelCls}>Email</label>
					<input
						type="email"
						placeholder="you@email.com"
						className={inputCls}
						{...register("email", {
							required: "Email is required",
							pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
						})}
					/>
					{errors.email && (
						<p className="text-red-500 text-xs mt-0.5">{errors.email.message}</p>
					)}
				</div>

				<div className="flex flex-col gap-1.5">
					<label className={labelCls}>Phone <span className="font-normal text-[var(--ink-soft)]">(optional)</span></label>
					<input
						type="tel"
						placeholder="(123) 456-7890"
						className={inputCls}
						{...register("phone", { validate: validatePhone })}
					/>
					{errors.phone && (
						<p className="text-red-500 text-xs mt-0.5">{errors.phone.message}</p>
					)}
				</div>

				<div className="flex flex-col gap-1.5">
					<label className={labelCls}>Message</label>
					<textarea
						placeholder="How can we help?"
						rows={4}
						className={inputCls + " resize-none"}
						{...register("message", { required: "Message is required" })}
					/>
					{errors.message && (
						<p className="text-red-500 text-xs mt-0.5">{errors.message.message}</p>
					)}
				</div>

				{serverError && (
					<p className="text-red-500 text-xs">{serverError}</p>
				)}

				<button
					type="submit"
					disabled={submitting}
					className="w-full rounded-lg bg-[var(--gold)] text-[var(--ink)] py-3 text-sm font-semibold hover:bg-[var(--gold-light)] transition-colors disabled:opacity-60 mt-1 cursor-pointer"
				>
					{submitting ? "Sending…" : "Submit"}
				</button>

			</form>
		</div>
	);
}
