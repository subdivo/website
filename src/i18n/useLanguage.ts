import { useContext } from "react";
import { LanguageContext } from "./context";

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage needs a LanguageProvider");
  return context;
}
