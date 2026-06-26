"use client";
import { FormEvent, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

interface Props {
  onSuccess: () => void;
}

export default function RegisterForm({ onSuccess }: Props) {
  const { register } = useAuth();
  const [fields, setFields] = useState({ username: "", fname: "", lname: "", email: "", password: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      await register(fields);
      onSuccess();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  const inputs: { name: keyof typeof fields; placeholder: string; type?: string }[] = [
    { name: "username", placeholder: "Username" },
    { name: "fname", placeholder: "First Name" },
    { name: "lname", placeholder: "Last Name" },
    { name: "email", placeholder: "Email", type: "email" },
    { name: "password", placeholder: "Password", type: "password" },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {inputs.map(({ name, placeholder, type = "text" }) => (
        <input
          key={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={fields[name]}
          onChange={handleChange}
          required
          className="rounded-lg border border-[var(--gold)] bg-transparent px-4 py-2 text-[var(--foreground)] placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[var(--gold)]"
        />
      ))}
      {status === "error" && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-2 rounded-lg bg-[var(--gold)] px-4 py-2 font-semibold text-black disabled:opacity-50"
      >
        {status === "loading" ? "Creating account…" : "Sign Up"}
      </button>
    </form>
  );
}
