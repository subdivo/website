import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { copy } from "./copy";
import { LanguageContext } from "./context";
import type { Language } from "./context";

function initialLanguage(): Language {
  const requested = new URLSearchParams(window.location.search).get("lang");
  if (requested === "en" || requested === "ru") return requested;
  try {
    return localStorage.getItem("subdivo-language") === "en" ? "en" : "ru";
  } catch {
    return "ru";
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem("subdivo-language", language);
    } catch {
      /* Language works without storage. */
    }
    const url = new URL(window.location.href);
    url.searchParams.set("lang", language);
    window.history.replaceState(window.history.state, "", url);
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        language === "ru"
          ? "Личное пространство subdivo. Код, мысли и небольшие эксперименты."
          : "A personal space by subdivo. Code, thoughts and small experiments.",
      );
  }, [language]);
  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t: copy[language] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
