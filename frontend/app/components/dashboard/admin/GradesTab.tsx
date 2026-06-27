"use client";
import { useEffect, useState } from "react";
import { useApiFetch } from "@/app/hooks/useApiFetch";
import { ApiError } from "@/app/lib/api";

interface Student { id: number; fname: string; lname: string; }
interface Class   { id: number; class_name: string; }

const EXAM_TYPES = ["SAT", "SSAT", "AP"];

const inputCls = "rounded-lg border border-[#D4AF37]/60 bg-white/70 px-3 py-2 text-sm text-[#0D0F14] placeholder:text-[#0D0F14]/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]";
const btnCls   = "rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#0D0F14] hover:bg-[#c4a230] transition-colors";

export default function GradesTab({ action }: { action: string | null }) {
	const apiFetch = useApiFetch();
	const [students, setStudents] = useState<Student[]>([]);
	const [classes,  setClasses]  = useState<Class[]>([]);
	const [loading,  setLoading]  = useState(true);
	const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

	const [form, setForm] = useState({
		student_id: "", class_id: "", score: "", max_score: "", type: "SAT", exam_date: "",
	});

	useEffect(() => {
		Promise.all([
			apiFetch<Student[]>("/admin/students"),
			apiFetch<Class[]>("/admin/classes"),
		]).then(([s, c]) => { setStudents(s); setClasses(c); }).finally(() => setLoading(false));
	}, []);  // eslint-disable-line react-hooks/exhaustive-deps

	const toast = (text: string, ok = true) => {
		setMsg({ text, ok });
		setTimeout(() => setMsg(null), 3000);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await apiFetch("/admin/add-grade", {
				method: "POST",
				body: JSON.stringify({
					student_id: parseInt(form.student_id),
					class_id:   form.class_id ? parseInt(form.class_id) : null,
					score:      parseFloat(form.score),
					max_score:  parseFloat(form.max_score),
					type:       form.type,
					exam_date:  form.exam_date,
				}),
			});
			setForm({ student_id: "", class_id: "", score: "", max_score: "", type: "SAT", exam_date: "" });
			toast("Grade recorded.");
		} catch (err) {
			toast(err instanceof ApiError ? JSON.stringify(err.data) : "Error", false);
		}
	};

	if (loading) return <p className="text-[#0D0F14]/50">Loading…</p>;

	return (
		<div className="flex flex-col gap-6">

			{msg && (
				<p className={`text-sm font-medium ${msg.ok ? "text-green-700" : "text-red-600"}`}>{msg.text}</p>
			)}

			{/* Action form panel */}
			{action === "add-grade" && (
				<div className="bg-white rounded-xl border border-[#D4AF37]/30 p-5 max-w-md">
					<form onSubmit={handleSubmit} className="flex flex-col gap-3">
						<select className={inputCls} value={form.student_id} onChange={e => setForm(f => ({ ...f, student_id: e.target.value }))} required>
							<option value="">Select student</option>
							{students.map(s => <option key={s.id} value={s.id}>{s.fname} {s.lname}</option>)}
						</select>
						<select className={inputCls} value={form.class_id} onChange={e => setForm(f => ({ ...f, class_id: e.target.value }))}>
							<option value="">No class (optional)</option>
							{classes.map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
						</select>
						<div className="flex gap-3">
							<input className={inputCls + " flex-1"} type="number" step="0.01" placeholder="Score"     value={form.score}     onChange={e => setForm(f => ({ ...f, score:     e.target.value }))} required />
							<input className={inputCls + " flex-1"} type="number" step="0.01" placeholder="Max score" value={form.max_score} onChange={e => setForm(f => ({ ...f, max_score: e.target.value }))} required />
						</div>
						<select className={inputCls} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} required>
							{EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
						</select>
						<input className={inputCls} type="date" value={form.exam_date} onChange={e => setForm(f => ({ ...f, exam_date: e.target.value }))} required />
						<button className={btnCls} type="submit">Add Grade</button>
					</form>
				</div>
			)}

			{/* Placeholder when no action is open */}
			{!action && (
				<div className="rounded-xl border border-[#0D0F14]/10 bg-white/40 p-8 text-center max-w-md">
					<p className="text-[#0D0F14]/50 text-sm">Grades are viewable from the parent dashboard.</p>
					<p className="text-[#0D0F14]/40 text-xs mt-1">Use &ldquo;Add Grade&rdquo; above to record a new exam result.</p>
				</div>
			)}

		</div>
	);
}
