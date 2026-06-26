"use client";
import { FormEvent, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

interface Props {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: Props) {
  const { login } = useAuth();
  const [fields, setFields] = useState({ username: "", password: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      await login(fields.username, fields.password);
      onSuccess();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        name="username"
        placeholder="Username"
        value={fields.username}
        onChange={handleChange}
        required
        className="rounded-lg border border-[var(--gold)] bg-transparent px-4 py-2 text-[var(--foreground)] placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[var(--gold)]"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={fields.password}
        onChange={handleChange}
        required
        className="rounded-lg border border-[var(--gold)] bg-transparent px-4 py-2 text-[var(--foreground)] placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[var(--gold)]"
      />
      {status === "error" && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-2 rounded-lg bg-[var(--gold)] px-4 py-2 font-semibold text-black disabled:opacity-50"
      >
        {status === "loading" ? "Logging in…" : "Log In"}
      </button>
    </form>
  );
}
