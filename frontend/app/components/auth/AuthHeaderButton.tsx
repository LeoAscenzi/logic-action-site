"use client";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function AuthHeaderButton() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) return <span className="w-32" />;

  if (!user) {
    return (
      <Link
        href="/get-started#consultation"
        className="rounded-lg bg-[var(--gold)] px-4 py-2 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--gold-light)] transition-colors whitespace-nowrap"
      >
        Book a Consult
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <Link
        href={`/dashboard/${user.role}`}
        className="font-semibold text-[var(--gold)] hover:underline whitespace-nowrap"
      >
        {user.fname}
      </Link>
      <button
        onClick={() => logout()}
        className="rounded-lg border border-[var(--gold)] px-3 py-1 text-xs text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-colors"
      >
        Log Out
      </button>
    </div>
  );
}
