"use client";
import { useEffect, useState } from "react";
import { useApiFetch } from "@/app/hooks/useApiFetch";
import { ApiError } from "@/app/lib/api";

interface Student { id: number; fname: string; lname: string; parent_id: number | null; }
interface Parent { id: number; fname: string; lname: string; username: string; }

const inputCls = "rounded-lg border border-[#D4AF37]/60 bg-white/70 px-3 py-2 text-sm text-[#0D0F14] placeholder:text-[#0D0F14]/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]";
const btnCls = "rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#0D0F14] hover:bg-[#c4a230] transition-colors";
const labelCls = "font-semibold text-[#D4AF37] tracking-wide text-sm uppercase";

export default function StudentsTab() {
  const apiFetch = useApiFetch();
  const [students, setStudents] = useState<Student[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);

  const [createForm, setCreateForm] = useState({ fname: "", lname: "", parent_id: "" });
  const [assignForm, setAssignForm] = useState({ student_id: "", parent_id: "" });
  const [deleteId, setDeleteId] = useState("");
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const refresh = async () => {
    const [s, p] = await Promise.all([
      apiFetch<Student[]>("/admin/students"),
      apiFetch<Parent[]>("/admin/parents"),
    ]);
    setStudents(s);
    setParents(p);
  };

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const toast = (text: string, ok = true) => {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch("/admin/create-student", {
        method: "POST",
        body: JSON.stringify({
          fname: createForm.fname,
          lname: createForm.lname,
          parent_id: createForm.parent_id ? parseInt(createForm.parent_id) : null,
        }),
      });
      setCreateForm({ fname: "", lname: "", parent_id: "" });
      toast("Student created.");
      await refresh();
    } catch (err) {
      toast(err instanceof ApiError ? JSON.stringify(err.data) : "Error", false);
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch(`/admin/assign-student/${assignForm.student_id}`, {
        method: "PATCH",
        body: JSON.stringify({ parent_id: parseInt(assignForm.parent_id) }),
      });
      setAssignForm({ student_id: "", parent_id: "" });
      toast("Parent assigned.");
      await refresh();
    } catch (err) {
      toast(err instanceof ApiError ? JSON.stringify(err.data) : "Error", false);
    }
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm("Delete this student?")) return;
    try {
      await apiFetch(`/admin/delete-student/${deleteId}`, { method: "DELETE" });
      setDeleteId("");
      toast("Student deleted.");
      await refresh();
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

        <form onSubmit={handleCreate} className="flex flex-col gap-3">
          <h3 className={labelCls}>Create Student</h3>
          <input className={inputCls} placeholder="First name" value={createForm.fname} onChange={e => setCreateForm(f => ({ ...f, fname: e.target.value }))} required />
          <input className={inputCls} placeholder="Last name" value={createForm.lname} onChange={e => setCreateForm(f => ({ ...f, lname: e.target.value }))} required />
          <select className={inputCls} value={createForm.parent_id} onChange={e => setCreateForm(f => ({ ...f, parent_id: e.target.value }))}>
            <option value="">No parent (optional)</option>
            {parents.map(p => <option key={p.id} value={p.id}>{p.fname} {p.lname}</option>)}
          </select>
          <button className={btnCls} type="submit">Create</button>
        </form>

        <form onSubmit={handleAssign} className="flex flex-col gap-3">
          <h3 className={labelCls}>Assign Parent</h3>
          <select className={inputCls} value={assignForm.student_id} onChange={e => setAssignForm(f => ({ ...f, student_id: e.target.value }))} required>
            <option value="">Select student</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.fname} {s.lname}</option>)}
          </select>
          <select className={inputCls} value={assignForm.parent_id} onChange={e => setAssignForm(f => ({ ...f, parent_id: e.target.value }))} required>
            <option value="">Select parent</option>
            {parents.map(p => <option key={p.id} value={p.id}>{p.fname} {p.lname}</option>)}
          </select>
          <button className={btnCls} type="submit">Assign</button>
        </form>

        <form onSubmit={handleDelete} className="flex flex-col gap-3">
          <h3 className={labelCls}>Delete Student</h3>
          <select className={inputCls} value={deleteId} onChange={e => setDeleteId(e.target.value)} required>
            <option value="">Select student</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.fname} {s.lname}</option>)}
          </select>
          <button className="rounded-lg border border-red-400 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors" type="submit">
            Delete
          </button>
        </form>
      </div>

      <div>
        <h3 className={labelCls + " mb-4"}>All Students</h3>
        {students.length === 0 ? (
          <p className="text-[#0D0F14]/50 text-sm">No students yet.</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#D4AF37]/40 text-left">
                <th className="py-2 pr-4 text-[#0D0F14]/50 font-medium">ID</th>
                <th className="py-2 pr-4 text-[#0D0F14]/50 font-medium">Name</th>
                <th className="py-2 text-[#0D0F14]/50 font-medium">Parent</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => {
                const parent = parents.find(p => p.id === s.parent_id);
                return (
                  <tr key={s.id} className="border-b border-[#0D0F14]/8 hover:bg-white/40 transition-colors">
                    <td className="py-2.5 pr-4 text-[#0D0F14]/40 text-xs">{s.id}</td>
                    <td className="py-2.5 pr-4 font-medium text-[#0D0F14]">{s.fname} {s.lname}</td>
                    <td className="py-2.5 text-[#0D0F14]/60">{parent ? `${parent.fname} ${parent.lname}` : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
