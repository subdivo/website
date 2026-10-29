import posts from "virtual:journal-posts";
import type { Language } from "../i18n/context";

export function postsIn(language: Language) {
  return posts.filter((post) => post.language === language);
}

export function findPost(slug: string, language?: Language) {
  return posts.find(
    (post) => post.slug === slug && (!language || post.language === language),
  );
}

export function postDate(date: string, language: Language) {
  return new Intl.DateTimeFormat(language === "ru" ? "ru-RU" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
