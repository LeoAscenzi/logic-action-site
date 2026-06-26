"use client";
import { useEffect, useState } from "react";
import { useApiFetch } from "@/app/hooks/useApiFetch";
import { ApiError } from "@/app/lib/api";

interface Class { id: number; class_name: string; total_sessions: number; start_date: string; end_date: string; capacity: number; }
interface Student { id: number; fname: string; lname: string; }

const inputCls = "rounded-lg border border-[#D4AF37]/60 bg-white/70 px-3 py-2 text-sm text-[#0D0F14] placeholder:text-[#0D0F14]/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]";
const btnCls = "rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#0D0F14] hover:bg-[#c4a230] transition-colors";
const labelCls = "font-semibold text-[#D4AF37] tracking-wide text-sm uppercase";

export default function ClassesTab() {
  const apiFetch = useApiFetch();
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const [classForm, setClassForm] = useState({ class_name: "", total_sessions: "", start_date: "", end_date: "", capacity: "" });
  const [sessionForm, setSessionForm] = useState({ class_id: "", class_duration: "", class_date: "" });

  const refresh = async () => {
    const [c, s] = await Promise.all([
      apiFetch<Class[]>("/admin/classes"),
      apiFetch<Student[]>("/admin/students"),
    ]);
    setClasses(c);
    setStudents(s);
  };

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const toast = (text: string, ok = true) => {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch("/admin/create-class", {
        method: "POST",
        body: JSON.stringify({
          class_name: classForm.class_name,
          total_sessions: parseInt(classForm.total_sessions),
          start_date: classForm.start_date,
          end_date: classForm.end_date,
          capacity: parseInt(classForm.capacity),
        }),
      });
      setClassForm({ class_name: "", total_sessions: "", start_date: "", end_date: "", capacity: "" });
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
          class_id: parseInt(sessionForm.class_id),
          class_duration: parseInt(sessionForm.class_duration),
          class_date: sessionForm.class_date,
        }),
      });
      setSessionForm({ class_id: "", class_duration: "", class_date: "" });
      toast("Session added.");
    } catch (err) {
      toast(err instanceof ApiError ? JSON.stringify(err.data) : "Error", false);
    }
  };

  if (loading) return <p className="text-[#0D0F14]/50">Loading…</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="flex flex-col gap-7">
        {msg && (
          <p className={`text-sm font-medium ${msg.ok ? "text-green-700" : "text-red-600"}`}>{msg.text}</p>
        )}

        <form onSubmit={handleCreateClass} className="flex flex-col gap-3">
          <h3 className={labelCls}>Create Class</h3>
          <input className={inputCls} placeholder="Class name" value={classForm.class_name} onChange={e => setClassForm(f => ({ ...f, class_name: e.target.value }))} required />
          <input className={inputCls} type="number" placeholder="Total sessions" value={classForm.total_sessions} onChange={e => setClassForm(f => ({ ...f, total_sessions: e.target.value }))} required />
          <div className="flex gap-3">
            <input className={inputCls + " flex-1"} type="date" value={classForm.start_date} onChange={e => setClassForm(f => ({ ...f, start_date: e.target.value }))} required />
            <input className={inputCls + " flex-1"} type="date" value={classForm.end_date} onChange={e => setClassForm(f => ({ ...f, end_date: e.target.value }))} required />
          </div>
          <input className={inputCls} type="number" placeholder="Capacity" value={classForm.capacity} onChange={e => setClassForm(f => ({ ...f, capacity: e.target.value }))} required />
          <button className={btnCls} type="submit">Create Class</button>
        </form>

        <form onSubmit={handleCreateSession} className="flex flex-col gap-3">
          <h3 className={labelCls}>Add Session</h3>
          <select className={inputCls} value={sessionForm.class_id} onChange={e => setSessionForm(f => ({ ...f, class_id: e.target.value }))} required>
            <option value="">Select class</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
          </select>
          <input className={inputCls} type="number" placeholder="Duration (minutes)" value={sessionForm.class_duration} onChange={e => setSessionForm(f => ({ ...f, class_duration: e.target.value }))} required />
          <input className={inputCls} type="date" value={sessionForm.class_date} onChange={e => setSessionForm(f => ({ ...f, class_date: e.target.value }))} required />
          <button className={btnCls} type="submit">Add Session</button>
        </form>
      </div>

      <div>
        <h3 className={labelCls + " mb-4"}>All Classes</h3>
        {classes.length === 0 ? (
          <p className="text-[#0D0F14]/50 text-sm">No classes yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {classes.map(c => (
              <div key={c.id} className="rounded-xl border border-[#0D0F14]/10 bg-white/50 p-4 hover:bg-white/70 transition-colors">
                <p className="font-semibold text-[#0D0F14]">{c.class_name}</p>
                <p className="text-sm text-[#0D0F14]/55 mt-0.5">
                  {c.total_sessions} sessions · {c.start_date} → {c.end_date} · cap {c.capacity}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
