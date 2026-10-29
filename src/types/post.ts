import type { Language } from "../i18n/context";

export interface Post {
  slug: string;
  language: Language;
  title: string;
  date: string;
  description: string;
  markdown: string;
  minutes: number;
  draft: boolean;
}
