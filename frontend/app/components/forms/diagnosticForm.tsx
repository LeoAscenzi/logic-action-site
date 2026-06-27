"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { inputCls, labelCls, selectCls, validatePhone } from "./formStyles";

type FormData = {
	studentName: string;
	grade:       string;
	targetTest:  string;
	parentEmail: string;
	phone?:      string;
};

const GRADES = ["6", "7", "8", "9", "10", "11", "12"];
const TESTS  = ["SAT", "ACT", "AP", "Not Decided"];

export default function DiagnosticForm() {
	const [submitted, setSubmitted]   = useState(false);
	const [submitting, setSubmitting] = useState(false);
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
			await axios.post(`${process.env.NEXT_PUBLIC_FORMSPREE_BOOK_CONSULTATION}`, data);
			setSubmitted(true);
			reset();
		} catch (err) {
			const error = err as AxiosError<{ error: string }>;
			setServerError(error.response?.data?.error ?? "Something went wrong. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	if (submitted) {
		return (
			<div className="bg-white rounded-2xl p-8 shadow-[var(--shadow-sm)] flex flex-col items-center justify-center gap-4 min-h-[340px]">
				<p className="text-2xl">✓</p>
				<p className="font-playfair text-xl font-semibold text-[var(--navy)]">You&apos;re on the list!</p>
				<p className="text-sm text-[var(--ink-soft)] text-center max-w-xs">
					We&apos;ll reach out within 24 hours to schedule your free diagnostic.
				</p>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-2xl p-8 shadow-[var(--shadow-sm)]">
			<h2 className="font-playfair text-2xl font-semibold text-[var(--navy)] mb-6">
				Claim Your Free Diagnostic
			</h2>

			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>

				<div className="flex flex-col gap-1.5">
					<label className={labelCls}>Student Name</label>
					<input
						type="text"
						placeholder="Student's full name"
						className={inputCls}
						{...register("studentName", { required: "Student name is required" })}
					/>
					{errors.studentName && (
						<p className="text-red-500 text-xs mt-0.5">{errors.studentName.message}</p>
					)}
				</div>

				<div className="flex flex-col gap-1.5">
					<label className={labelCls}>Grade</label>
					<select
						className={selectCls}
						defaultValue=""
						{...register("grade", { required: "Please select a grade" })}
					>
						<option value="" disabled>Select grade</option>
						{GRADES.map(g => (
							<option key={g} value={g}>Grade {g}</option>
						))}
					</select>
					{errors.grade && (
						<p className="text-red-500 text-xs mt-0.5">{errors.grade.message}</p>
					)}
				</div>

				<div className="flex flex-col gap-1.5">
					<label className={labelCls}>Target Test</label>
					<select
						className={selectCls}
						defaultValue=""
						{...register("targetTest", { required: "Please select a target test" })}
					>
						<option value="" disabled>Select target test</option>
						{TESTS.map(t => (
							<option key={t} value={t}>{t}</option>
						))}
					</select>
					{errors.targetTest && (
						<p className="text-red-500 text-xs mt-0.5">{errors.targetTest.message}</p>
					)}
				</div>

				<div className="flex flex-col gap-1.5">
					<label className={labelCls}>Parent Email</label>
					<input
						type="email"
						placeholder="parent@email.com"
						className={inputCls}
						{...register("parentEmail", {
							required: "Parent email is required",
							pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
						})}
					/>
					{errors.parentEmail && (
						<p className="text-red-500 text-xs mt-0.5">{errors.parentEmail.message}</p>
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

				{serverError && (
					<p className="text-red-500 text-xs">{serverError}</p>
				)}

				<button
					type="submit"
					disabled={submitting}
					className="w-full rounded-lg bg-[var(--gold)] text-[var(--ink)] py-3 text-sm font-semibold hover:bg-[var(--gold-light)] transition-colors disabled:opacity-60 mt-1 cursor-pointer"
				>
					{submitting ? "Submitting…" : "Claim Your Free Diagnostic"}
				</button>

			</form>
		</div>
	);
}
