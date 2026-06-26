"use client";
import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ onClose, onSuccess }: Props) {
  const [tab, setTab] = useState<"login" | "register">("login");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border border-[var(--gold)] bg-[var(--card-bg,#1a1a1a)] p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <button
              onClick={() => setTab("login")}
              className={`px-4 py-1.5 rounded-lg font-semibold transition-colors ${tab === "login" ? "bg-[var(--gold)] text-black" : "text-[var(--gold)] border border-[var(--gold)]"}`}
            >
              Log In
            </button>
            <button
              onClick={() => setTab("register")}
              className={`px-4 py-1.5 rounded-lg font-semibold transition-colors ${tab === "register" ? "bg-[var(--gold)] text-black" : "text-[var(--gold)] border border-[var(--gold)]"}`}
            >
              Sign Up
            </button>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">✕</button>
        </div>
        {tab === "login"
          ? <LoginForm onSuccess={onSuccess} />
          : <RegisterForm onSuccess={onSuccess} />
        }
      </div>
    </div>
  );
}
