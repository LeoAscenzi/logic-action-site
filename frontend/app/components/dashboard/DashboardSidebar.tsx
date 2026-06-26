"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function DashboardSidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/en");
  };

  return (
    <aside className="flex flex-col w-56 min-h-screen bg-[#0D0F14] border-r border-[#D4AF37]/30 p-6 gap-6">
      <Link href="/" className="mb-2">
        <img src="/logo-light-main.png" className="max-h-16 w-auto" />
      </Link>

      {user && (
        <div className="flex flex-col gap-1 pb-4 border-b border-[#D4AF37]/20">
          <span className="font-semibold text-[#D4AF37]">{user.fname} {user.lname}</span>
          <span className="text-xs text-[#f5f0e8]/50 capitalize tracking-wide">{user.role}</span>
        </div>
      )}

      <nav className="flex flex-col gap-1 flex-1 text-sm">
        {user?.role === "admin" && (
          <Link
            href="/en/dashboard/admin"
            className="rounded-lg px-3 py-2 text-[#f5f0e8]/80 hover:text-[#D4AF37] hover:bg-white/5 transition-colors"
          >
            Admin Dashboard
          </Link>
        )}
        {user?.role === "parent" && (
          <Link
            href="/en/dashboard/parent"
            className="rounded-lg px-3 py-2 text-[#f5f0e8]/80 hover:text-[#D4AF37] hover:bg-white/5 transition-colors"
          >
            My Students
          </Link>
        )}
      </nav>

      <button
        onClick={handleLogout}
        className="rounded-lg border border-[#D4AF37]/50 px-3 py-2 text-sm text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D0F14] transition-colors font-medium"
      >
        Log Out
      </button>
    </aside>
  );
}
