"use client";
import { useState } from "react";
import { useRequireAuth } from "@/app/hooks/useRequireAuth";
import StudentsTab from "@/app/components/dashboard/admin/StudentsTab";
import ClassesTab from "@/app/components/dashboard/admin/ClassesTab";
import GradesTab from "@/app/components/dashboard/admin/GradesTab";

type Tab = "students" | "classes" | "grades";

export default function AdminDashboard() {
  const { user, isAuthorized } = useRequireAuth("admin");
  const [tab, setTab] = useState<Tab>("students");

  if (!isAuthorized) return null;

  const tabs: { key: Tab; label: string }[] = [
    { key: "students", label: "Students" },
    { key: "classes", label: "Classes" },
    { key: "grades", label: "Grades" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold gold-text mb-6">Admin Dashboard</h1>
      <div className="flex gap-2 mb-8 border-b border-[#0D0F14]/15">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              tab === key
                ? "border-[#D4AF37] text-[#D4AF37]"
                : "border-transparent text-[#0D0F14]/50 hover:text-[#0D0F14]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "students" && <StudentsTab />}
      {tab === "classes" && <ClassesTab />}
      {tab === "grades" && <GradesTab />}
    </div>
  );
}
