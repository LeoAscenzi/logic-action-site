"use client";
import { createContext, useContext, useState } from "react";

type AdminSection = "students" | "classes" | "grades";

interface AdminSectionContextValue {
	section: AdminSection;
	setSection: (s: AdminSection) => void;
}

const AdminSectionContext = createContext<AdminSectionContextValue>({
	section: "students",
	setSection: () => {},
});

export function AdminSectionProvider({ children }: { children: React.ReactNode }) {
	const [section, setSection] = useState<AdminSection>("students");
	return (
		<AdminSectionContext.Provider value={{ section, setSection }}>
			{children}
		</AdminSectionContext.Provider>
	);
}

export function useAdminSection() {
	return useContext(AdminSectionContext);
}
