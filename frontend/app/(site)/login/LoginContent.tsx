"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import LoginForm from "@/app/components/auth/LoginForm";
import RegisterForm from "@/app/components/auth/RegisterForm";

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "http://localhost:3001";

export default function LoginContent() {
  const { user, isLoading } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");

  useEffect(() => {
    if (!isLoading && user) {
      window.location.href = `${DASHBOARD_URL}/dashboard/${user.role}`;
    }
  }, [user, isLoading]);

  if (isLoading) return null;
  if (user) return null;

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--gold)] bg-[var(--card-bg)] p-8 shadow-xl">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${tab === "login" ? "bg-[var(--gold)] text-black" : "text-[var(--gold)] border border-[var(--gold)]"}`}
          >
            Log In
          </button>
          <button
            onClick={() => setTab("register")}
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${tab === "register" ? "bg-[var(--gold)] text-black" : "text-[var(--gold)] border border-[var(--gold)]"}`}
          >
            Sign Up
          </button>
        </div>
        {tab === "login"
          ? <LoginForm onSuccess={() => { window.location.href = `${DASHBOARD_URL}/dashboard/parent`; }} />
          : <RegisterForm onSuccess={() => { window.location.href = `${DASHBOARD_URL}/dashboard/parent`; }} />
        }
      </div>
    </main>
  );
}
