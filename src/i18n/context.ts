import { createContext } from "react";
import type { copy } from "./copy";

export type Language = "ru" | "en";
export type Translations = { [Key in keyof typeof copy.ru]: string };
export interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translations;
}
export const LanguageContext = createContext<LanguageContextValue | null>(null);
