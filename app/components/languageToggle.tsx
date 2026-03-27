// components/language-switcher.tsx
"use client";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

const locales = [
  { code: "en", label: "EN" },
  { code: "zh", label: "中文" },
];

export default function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Replace the locale segment at the start of the path
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex gap-2">
      {locales.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => switchLocale(code)}
          className={`font-inter font-medium tracking-wider uppercase hover:text-[#D4AF37] ${
            locale === code ? "text-[#D4AF37]" : "text-white"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}