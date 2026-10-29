import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import { Butterfly } from "./Atmosphere";

export function Header() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const header = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const pages = [
    { path: "/about", label: t.about, note: t.aboutNote, number: "01" },
    { path: "/journal", label: t.journal, note: t.journalNote, number: "02" },
    {
      path: "/projects",
      label: t.projects,
      note: t.projectsNote,
      number: "03",
    },
  ];

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const content = document.getElementById("main-content");
    content?.setAttribute("inert", "");
    const timer = window.setTimeout(
      () => dialog.current?.querySelector<HTMLAnchorElement>("a")?.focus(),
      150,
    );
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab") return;
      const elements = [
        ...Array.from(
          header.current?.querySelectorAll<HTMLElement>("a,button") ?? [],
        ),
        ...Array.from(
          dialog.current?.querySelectorAll<HTMLElement>("a,button") ?? [],
        ),
      ];
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
      content?.removeAttribute("inert");
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open]);

  return (
    <>
      <header ref={header} className={`site-header ${open ? "is-open" : ""}`}>
        <Link
          to="/"
          className="wordmark"
          aria-label={t.brandHome}
          onClick={() => setOpen(false)}
        >
          subdivo<span className="wordmark-dot">.</span>
        </Link>
        <div className="header-actions">
          <div className="language-switch" role="group" aria-label={t.language}>
            <button
              type="button"
              lang="ru"
              aria-label="Русский"
              aria-pressed={language === "ru"}
              onClick={() => setLanguage("ru")}
            >
              RU
            </button>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              lang="en"
              aria-label="English"
              aria-pressed={language === "en"}
              onClick={() => setLanguage("en")}
            >
              EN
            </button>
          </div>
          <button
            type="button"
            className="menu-trigger"
            aria-label={open ? t.closeMenu : t.openMenu}
            aria-expanded={open}
            aria-controls="navigation"
            onClick={() => setOpen(!open)}
          >
            <span className="menu-caption">{open ? t.close : t.menu}</span>
            <span className="menu-symbol">
              {open ? (
                <X size={24} strokeWidth={1} />
              ) : (
                <span className="menu-lines" aria-hidden="true">
                  <i />
                  <i />
                </span>
              )}
            </span>
          </button>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div
            id="navigation"
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-label={t.navigation}
            data-lenis-prevent
            className="navigation navigation-constellation"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, filter: reduced ? "none" : "blur(7px)" }}
            transition={{ duration: reduced ? 0.15 : 0.65 }}
          >
            <nav className="constellation-menu" aria-label={t.pages}>
              <svg
                className="menu-orbits"
                viewBox="0 0 1000 560"
                fill="none"
                aria-hidden="true"
              >
                <motion.path
                  d="M180 130C140 370 590 560 780 250C900 30 170 0 180 130Z"
                  stroke="currentColor"
                  strokeWidth=".6"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: reduced ? 0 : 2.2,
                    ease: "easeInOut",
                  }}
                />
                <path
                  d="M95 415C350 530 820 440 915 130"
                  stroke="currentColor"
                  strokeWidth=".4"
                  strokeDasharray="2 12"
                />
              </svg>
              <div className="menu-drifter" aria-hidden="true">
                <Butterfly />
              </div>
              <span
                className="menu-scattered-star menu-star-one"
                aria-hidden="true"
              >
                ✧
              </span>
              <span
                className="menu-scattered-star menu-star-two"
                aria-hidden="true"
              >
                ·
              </span>
              {pages.map((page, index) => (
                <motion.div
                  key={page.path}
                  className={`constellation-scene constellation-scene-${index} ${hovered !== null && hovered !== index ? "is-dimmed" : ""}`}
                  initial={{
                    opacity: 0,
                    y: 22,
                    filter: reduced ? "none" : "blur(8px)",
                  }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: reduced ? 0 : 0.18 + index * 0.13,
                    duration: reduced ? 0.15 : 0.9,
                  }}
                >
                  <Link
                    to={page.path}
                    className={`constellation-link ${location.pathname === page.path ? "is-current" : ""}`}
                    aria-current={
                      location.pathname === page.path ? "page" : undefined
                    }
                    onClick={() => setOpen(false)}
                    onMouseEnter={() => setHovered(index)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(index)}
                    onBlur={() => setHovered(null)}
                  >
                    <span className="scene-coordinate">
                      {page.number}
                      <span aria-hidden="true">—</span>
                      <i />
                    </span>
                    <span className="scene-title">
                      {page.label}
                      <ArrowUpRight size={28} strokeWidth={0.8} />
                    </span>
                    <span className="scene-description">{page.note}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="navigation-bottom">
              <Link to="/" onClick={() => setOpen(false)}>
                <span aria-hidden="true">←</span> {t.home}
              </Link>
              <span className="menu-page-count" aria-hidden="true">
                0{hovered === null ? 1 : hovered + 1} <i /> 03
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
