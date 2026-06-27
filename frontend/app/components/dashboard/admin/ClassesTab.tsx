"use client";
import { useEffect, useRef, useState } from "react";
import { useApiFetch } from "@/app/hooks/useApiFetch";
import { ApiError } from "@/app/lib/api";

interface Class { id: number; class_name: string; total_sessions: number; start_date: string; end_date: string; capacity: number; }

type Action = "create-class" | "add-session" | "edit-class" | null;

const inputCls = "rounded-lg border border-[#D4AF37]/60 bg-white/70 px-3 py-2 text-sm text-[#0D0F14] placeholder:text-[#0D0F14]/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]";
const btnCls   = "rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#0D0F14] hover:bg-[#c4a230] transition-colors";
const emptyClassForm = { class_name: "", total_sessions: "", start_date: "", end_date: "", capacity: "" };

export default function ClassesTab() {
	const apiFetch = useApiFetch();
	const [classes,  setClasses]  = useState<Class[]>([]);
	const [loading,  setLoading]  = useState(true);
	const [action,   setAction]   = useState<Action>(null);
	const [selected, setSelected] = useState<Set<number>>(new Set());
	const [msg,      setMsg]      = useState<{ text: string; ok: boolean } | null>(null);

	const [classForm,   setClassForm]   = useState(emptyClassForm);
	const [sessionForm, setSessionForm] = useState({ class_id: "", class_duration: "", class_date: "" });
	const [editForm,    setEditForm]    = useState(emptyClassForm);

	const headerCheckRef = useRef<HTMLInputElement>(null);

	const refresh = async () => {
		const c = await apiFetch<Class[]>("/admin/classes");
		setClasses(c);
		setSelected(new Set());
	};

	useEffect(() => {
		refresh().finally(() => setLoading(false));  // eslint-disable-line react-hooks/set-state-in-effect
	}, []);  // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (headerCheckRef.current) {
			headerCheckRef.current.indeterminate = selected.size > 0 && selected.size < classes.length;
		}
	}, [selected, classes]);

	const toast = (text: string, ok = true) => {
		setMsg({ text, ok });
		setTimeout(() => setMsg(null), 3000);
	};

	const toggle = (key: Action) => {
		if (key === "edit-class" && selected.size === 1) {
			const cls = classes.find(c => selected.has(c.id))!;
			setEditForm({
				class_name:     cls.class_name,
				total_sessions: String(cls.total_sessions),
				start_date:     cls.start_date,
				end_date:       cls.end_date,
				capacity:       String(cls.capacity),
			});
		}
		setAction(a => a === key ? null : key);
	};

	const toggleRow = (id: number) => {
		setSelected(prev => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id); else next.add(id);
			return next;
		});
	};

	const toggleAll = () => {
		setSelected(prev =>
			prev.size === classes.length
				? new Set()
				: new Set(classes.map(c => c.id))
		);
	};

	const handleCreateClass = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await apiFetch("/admin/create-class", {
				method: "POST",
				body: JSON.stringify({
					class_name:     classForm.class_name,
					total_sessions: parseInt(classForm.total_sessions),
					start_date:     classForm.start_date,
					end_date:       classForm.end_date,
					capacity:       parseInt(classForm.capacity),
				}),
			});
			setClassForm(emptyClassForm);
			toast("Class created.");
			await refresh();
		} catch (err) {
			toast(err instanceof ApiError ? JSON.stringify(err.data) : "Error", false);
		}
	};

	const handleCreateSession = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await apiFetch("/admin/create-session", {
				method: "POST",
				body: JSON.stringify({
					class_id:       parseInt(sessionForm.class_id),
					class_duration: parseInt(sessionForm.class_duration),
					class_date:     sessionForm.class_date,
				}),
			});
			setSessionForm({ class_id: "", class_duration: "", class_date: "" });
			toast("Session added.");
		} catch (err) {
			toast(err instanceof ApiError ? JSON.stringify(err.data) : "Error", false);
		}
	};

	const handleEditClass = async (e: React.FormEvent) => {
		e.preventDefault();
		const [classId] = Array.from(selected);
		try {
			await apiFetch(`/admin/update-class/${classId}`, {
				method: "PATCH",
				body: JSON.stringify({
					class_name:     editForm.class_name,
					total_sessions: parseInt(editForm.total_sessions),
					start_date:     editForm.start_date,
					end_date:       editForm.end_date,
					capacity:       parseInt(editForm.capacity),
				}),
			});
			setAction(null);
			toast("Class updated.");
			await refresh();
		} catch (err) {
			toast(err instanceof ApiError ? JSON.stringify(err.data) : "Error", false);
		}
	};

	const handleDeleteSelected = async () => {
		if (selected.size === 0) return;
		const plural = selected.size > 1 ? "es" : "";
		if (!confirm(`Delete ${selected.size} class${plural}? This will also remove all sessions and attendance records.`)) return;
		try {
			await apiFetch("/admin/delete-classes", {
				method: "DELETE",
				body: JSON.stringify({ ids: Array.from(selected) }),
			});
			setAction(null);
			toast(`Deleted ${selected.size} class${plural}.`);
			await refresh();
		} catch (err) {
			toast(err instanceof ApiError ? JSON.stringify(err.data) : "Error", false);
		}
	};

	if (loading) return <p className="p-6 text-[#0D0F14]/50">Loading…</p>;

	return (
		<div className="flex flex-col min-h-[calc(100vh-56px)] md:min-h-screen">

			{/* Action bar */}
			<div className="border-b border-[#d4c9b0] bg-[#ede8df] px-6 py-3 flex items-center gap-3 flex-wrap shrink-0">
				<span className="text-xs font-semibold uppercase tracking-wider text-[#5b6072] mr-1">Classes</span>
				{(["create-class", "add-session"] as const).map(key => (
					<button
						key={key}
						onClick={() => toggle(key)}
						className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors border ${
							action === key
								? "bg-[#D4AF37] border-[#D4AF37] text-[#0D0F14]"
								: "border-[#D4AF37]/70 text-[#D4AF37] hover:bg-[#D4AF37]/10"
						}`}
					>
						{key === "create-class" ? "Create Class" : "Add Session"}
					</button>
				))}
				<button
					onClick={() => toggle("edit-class")}
					disabled={selected.size !== 1}
					className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors border ${
						action === "edit-class"
							? "bg-[#D4AF37] border-[#D4AF37] text-[#0D0F14]"
							: selected.size === 1
							? "border-[#D4AF37]/70 text-[#D4AF37] hover:bg-[#D4AF37]/10"
							: "border-[#0D0F14]/20 text-[#0D0F14]/30 cursor-not-allowed"
					}`}
				>
					Edit Class
				</button>
				<div className="flex-1" />
				{selected.size > 0 && (
					<button
						onClick={handleDeleteSelected}
						className="rounded-lg px-4 py-1.5 text-sm font-medium transition-colors border border-red-400/70 text-red-600 hover:bg-red-50"
					>
						Delete ({selected.size})
					</button>
				)}
			</div>

			{/* Content */}
			<div className="flex-1 p-6 overflow-auto flex flex-col gap-6">

				{msg && (
					<p className={`text-sm font-medium ${msg.ok ? "text-green-700" : "text-red-600"}`}>{msg.text}</p>
				)}

				{action === "create-class" && (
					<div className="bg-white rounded-xl border border-[#D4AF37]/30 p-5 max-w-md">
						<form onSubmit={handleCreateClass} className="flex flex-col gap-3">
							<input className={inputCls} placeholder="Class name" value={classForm.class_name} onChange={e => setClassForm(f => ({ ...f, class_name: e.target.value }))} required />
							<input className={inputCls} type="number" placeholder="Total sessions" value={classForm.total_sessions} onChange={e => setClassForm(f => ({ ...f, total_sessions: e.target.value }))} required />
							<div className="flex gap-3">
								<input className={inputCls + " flex-1"} type="date" value={classForm.start_date} onChange={e => setClassForm(f => ({ ...f, start_date: e.target.value }))} required />
								<input className={inputCls + " flex-1"} type="date" value={classForm.end_date}   onChange={e => setClassForm(f => ({ ...f, end_date:   e.target.value }))} required />
							</div>
							<input className={inputCls} type="number" placeholder="Capacity" value={classForm.capacity} onChange={e => setClassForm(f => ({ ...f, capacity: e.target.value }))} required />
							<button className={btnCls} type="submit">Create Class</button>
						</form>
					</div>
				)}

				{action === "add-session" && (
					<div className="bg-white rounded-xl border border-[#D4AF37]/30 p-5 max-w-md">
						<form onSubmit={handleCreateSession} className="flex flex-col gap-3">
							<select className={inputCls} value={sessionForm.class_id} onChange={e => setSessionForm(f => ({ ...f, class_id: e.target.value }))} required>
								<option value="">Select class</option>
								{classes.map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
							</select>
							<input className={inputCls} type="number" placeholder="Duration (minutes)" value={sessionForm.class_duration} onChange={e => setSessionForm(f => ({ ...f, class_duration: e.target.value }))} required />
							<input className={inputCls} type="date" value={sessionForm.class_date} onChange={e => setSessionForm(f => ({ ...f, class_date: e.target.value }))} required />
							<button className={btnCls} type="submit">Add Session</button>
						</form>
					</div>
				)}

				{action === "edit-class" && selected.size === 1 && (
					<div className="bg-white rounded-xl border border-[#D4AF37]/30 p-5 max-w-md">
						<form onSubmit={handleEditClass} className="flex flex-col gap-3">
							<input className={inputCls} placeholder="Class name" value={editForm.class_name} onChange={e => setEditForm(f => ({ ...f, class_name: e.target.value }))} required />
							<input className={inputCls} type="number" placeholder="Total sessions" value={editForm.total_sessions} onChange={e => setEditForm(f => ({ ...f, total_sessions: e.target.value }))} required />
							<div className="flex gap-3">
								<input className={inputCls + " flex-1"} type="date" value={editForm.start_date} onChange={e => setEditForm(f => ({ ...f, start_date: e.target.value }))} required />
								<input className={inputCls + " flex-1"} type="date" value={editForm.end_date}   onChange={e => setEditForm(f => ({ ...f, end_date:   e.target.value }))} required />
							</div>
							<input className={inputCls} type="number" placeholder="Capacity" value={editForm.capacity} onChange={e => setEditForm(f => ({ ...f, capacity: e.target.value }))} required />
							<button className={btnCls} type="submit">Save Changes</button>
						</form>
					</div>
				)}

				{/* Classes table */}
				<div>
					<h3 className="font-semibold text-[#D4AF37] tracking-wide text-sm uppercase mb-4">All Classes</h3>
					{classes.length === 0 ? (
						<p className="text-[#0D0F14]/50 text-sm">No classes yet.</p>
					) : (
						<table className="w-full text-sm border-collapse">
							<thead>
								<tr className="border-b border-[#D4AF37]/40 text-left">
									<th className="py-2 pr-3 w-8">
										<input
											ref={headerCheckRef}
											type="checkbox"
											checked={selected.size === classes.length && classes.length > 0}
											onChange={toggleAll}
											className="cursor-pointer accent-[#D4AF37]"
										/>
									</th>
									<th className="py-2 pr-4 text-[#0D0F14]/50 font-medium">ID</th>
									<th className="py-2 pr-4 text-[#0D0F14]/50 font-medium">Name</th>
									<th className="py-2 pr-4 text-[#0D0F14]/50 font-medium">Sessions</th>
									<th className="py-2 pr-4 text-[#0D0F14]/50 font-medium">Start</th>
									<th className="py-2 pr-4 text-[#0D0F14]/50 font-medium">End</th>
									<th className="py-2 text-[#0D0F14]/50 font-medium">Cap</th>
								</tr>
							</thead>
							<tbody>
								{classes.map(c => {
									const isSel = selected.has(c.id);
									return (
										<tr
											key={c.id}
											onClick={() => toggleRow(c.id)}
											className={`border-b border-[#0D0F14]/8 cursor-pointer transition-colors ${
												isSel ? "bg-[#D4AF37]/10" : "hover:bg-white/40"
											}`}
										>
											<td className="py-2.5 pr-3">
												<input
													type="checkbox"
													checked={isSel}
													onChange={() => toggleRow(c.id)}
													onClick={e => e.stopPropagation()}
													className="cursor-pointer accent-[#D4AF37]"
												/>
											</td>
											<td className="py-2.5 pr-4 text-[#0D0F14]/40 text-xs">{c.id}</td>
											<td className="py-2.5 pr-4 font-medium text-[#0D0F14]">{c.class_name}</td>
											<td className="py-2.5 pr-4 text-[#0D0F14]/60">{c.total_sessions}</td>
											<td className="py-2.5 pr-4 text-[#0D0F14]/60">{c.start_date}</td>
											<td className="py-2.5 pr-4 text-[#0D0F14]/60">{c.end_date}</td>
											<td className="py-2.5 text-[#0D0F14]/60">{c.capacity}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					)}
				</div>

			</div>
		</div>
	);
}
