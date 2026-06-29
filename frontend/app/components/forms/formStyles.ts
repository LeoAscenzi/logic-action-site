export const inputCls =
	"w-full rounded-lg border border-[var(--line)] bg-white px-4 py-2.5 text-sm text-[var(--ink)] " +
	"placeholder:text-[var(--ink-soft)] focus:outline-none focus:ring-1 focus:ring-[var(--navy)]";

export const labelCls = "text-xs font-semibold text-[var(--navy)]";

export const selectCls = inputCls;

// Accepts common US formats: (123) 456-7890 · 123-456-7890 · 123.456.7890 · +1 123 456 7890
const PHONE_RE = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

export const validatePhone = (value?: string) => {
	if (!value || value.trim() === "") return true;
	return PHONE_RE.test(value.replace(/\s/g, "")) || "Enter a valid phone number (e.g. (123) 456-7890)";
};
