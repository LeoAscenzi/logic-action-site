"use client";
import { useState, useEffect } from "react";
import { useRequireAuth } from "@/app/hooks/useRequireAuth";
import { useAdminSection } from "@/app/context/AdminSectionContext";
import StudentsTab from "@/app/components/dashboard/admin/StudentsTab";
import ClassesTab from "@/app/components/dashboard/admin/ClassesTab";
import GradesTab from "@/app/components/dashboard/admin/GradesTab";

type ActionItem = { key: string; label: string; danger?: boolean };

const SECTION_ACTIONS: Record<string, ActionItem[]> = {
	students: [
		{ key: "create-student", label: "Create Student" },
		{ key: "assign-parent",  label: "Assign Parent"  },
		{ key: "delete-student", label: "Delete Student", danger: true },
	],
	classes: [
		{ key: "create-class", label: "Create Class" },
		{ key: "add-session",  label: "Add Session"  },
	],
	grades: [
		{ key: "add-grade", label: "Add Grade" },
	],
};

const SECTION_TITLES = {
	students: "Students",
	classes:  "Classes",
	grades:   "Grades",
} as const;

export default function AdminDashboard() {
	const { isAuthorized }        = useRequireAuth("admin");
	const { section }             = useAdminSection();
	const [action, setAction]     = useState<string | null>(null);

	// Reset active action when section changes
	useEffect(() => { setAction(null); }, [section]);  // eslint-disable-line react-hooks/set-state-in-effect

	if (!isAuthorized) return null;

	const toggleAction = (key: string) => {
		setAction(prev => prev === key ? null : key);
	};

	return (
		<div className="flex flex-col min-h-[calc(100vh-56px)] md:min-h-screen">

			{/* Action bar */}
			<div className="border-b border-[#d4c9b0] bg-[#ede8df] px-6 py-3 flex items-center gap-3 flex-wrap shrink-0">
				<span className="text-xs font-semibold uppercase tracking-wider text-[#5b6072] mr-1">
					{SECTION_TITLES[section]}
				</span>
				{SECTION_ACTIONS[section].map(({ key, label, danger }) => (
					<button
						key={key}
						onClick={() => toggleAction(key)}
						className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors border ${
							action === key
								? danger
									? "bg-red-500 border-red-500 text-white"
									: "bg-[#D4AF37] border-[#D4AF37] text-[#0D0F14]"
								: danger
								? "border-red-400/70 text-red-600 hover:bg-red-50"
								: "border-[#D4AF37]/70 text-[#D4AF37] hover:bg-[#D4AF37]/10"
						}`}
					>
						{label}
					</button>
				))}
			</div>

			{/* Content */}
			<div className="flex-1 p-6 overflow-auto">
				{section === "students" && <StudentsTab action={action} />}
				{section === "classes"  && <ClassesTab  action={action} />}
				{section === "grades"   && <GradesTab   action={action} />}
			</div>

		</div>
	);
}
