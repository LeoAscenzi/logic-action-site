"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import LoginForm from "@/app/components/auth/LoginForm";
import RegisterForm from "@/app/components/auth/RegisterForm";

export default function LoginContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"login" | "register">("login");

  useEffect(() => {
    if (!isLoading && user) {
      const from = searchParams.get("from");
      router.replace(from ?? `/dashboard/${user.role}`);
    }
  }, [user, isLoading, router, searchParams]);

  if (isLoading) return null;
  if (user) return null;

  const from = searchParams.get("from") ?? undefined;

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
          ? <LoginForm onSuccess={() => router.replace(from ?? "/dashboard/parent")} />
          : <RegisterForm onSuccess={() => router.replace(from ?? "/dashboard/parent")} />
        }
      </div>
    </main>
  );
}
