import { useEffect } from "react";
import Lenis from "lenis";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../i18n/useLanguage";
import { findPost } from "../lib/posts";

export function useCinema() {
  const { pathname } = useLocation();
  const { t, language } = useLanguage();
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const lenis = reduced
      ? null
      : new Lenis({ duration: 1.3, smoothWheel: true, touchMultiplier: 1.1 });
    let frame = 0;
    const animate = (time: number) => {
      lenis?.raf(time);
      frame = requestAnimationFrame(animate);
    };
    if (lenis) frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      lenis?.destroy();
    };
  }, []);
  useEffect(() => {
    const titles: Record<string, string> = {
      "/": "Just Creating Things",
      "/about": t.about,
      "/journal": t.journal,
      "/projects": t.projects,
    };
    const slug = pathname.startsWith("/journal/")
      ? pathname.slice("/journal/".length)
      : null;
    const post = slug ? findPost(slug, language) : null;
    const title = slug
      ? (post?.title ??
        (findPost(slug) ? t.translationMissing : t.articleMissing))
      : (titles[pathname] ?? t.notFound);
    document.title = `subdivo — ${title}`;
  }, [pathname, t, language]);
}
