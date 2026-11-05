"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={language === "es" ? "Switch to English" : "Cambiar a español"}
      className="rounded-full border border-border px-3 py-2 text-xs font-extrabold text-primary transition-colors hover:bg-primary/10"
    >
      <span className={language === "es" ? "text-accent" : "text-subtle"}>
        ES
      </span>

      <span className="text-subtle"> / </span>

      <span className={language === "en" ? "text-accent" : "text-subtle"}>
        EN
      </span>
    </button>
  );
}
