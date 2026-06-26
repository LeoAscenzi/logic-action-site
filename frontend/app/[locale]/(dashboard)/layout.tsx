"use client";
import { useAuth } from "@/app/context/AuthContext";
import DashboardSidebar from "@/app/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) return null;

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-8 bg-[#f5f0e8] text-[#0D0F14]">{children}</main>
    </div>
  );
}
