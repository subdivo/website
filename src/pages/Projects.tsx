import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Butterfly } from "../components/Atmosphere";
import { useLanguage } from "../i18n/useLanguage";

interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  fork: boolean;
  archived: boolean;
}
const CACHE_KEY = "subdivo-repositories-v1";

export function Projects() {
  const { t } = useLanguage();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    const load = async () => {
      try {
        try {
          const cache = sessionStorage.getItem(CACHE_KEY);
          if (cache) {
            const data: Repository[] = JSON.parse(cache);
            if (Array.isArray(data)) {
              setRepositories(data);
              setStatus("ready");
              return;
            }
          }
        } catch {
          /* Storage is optional. */
        }
        const response = await fetch(
          "https://api.github.com/users/subdivo/repos?sort=updated&per_page=100",
          {
            signal: controller.signal,
            headers: { Accept: "application/vnd.github+json" },
          },
        );
        if (!response.ok) throw new Error("GitHub unavailable");
        const data = (await response.json()) as Repository[];
        if (!Array.isArray(data)) throw new Error("Unexpected response");
        const projects = data
          .filter(
            (repo) =>
              !repo.fork &&
              !repo.archived &&
              repo.name.toLowerCase() !== "subdivo",
          )
          .slice(0, 12);
        setRepositories(projects);
        setStatus("ready");
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(projects));
        } catch {
          /* Works without storage. */
        }
      } catch {
        if (!controller.signal.aborted || !ignore) setStatus("error");
      } finally {
        clearTimeout(timeout);
      }
    };
    let ignore = false;
    void load();
    return () => {
      ignore = true;
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);
  const current = repositories[index];
  const changeProject = (step: number) =>
    setIndex(
      (previous) =>
        (previous + step + repositories.length) % repositories.length,
    );
  return (
    <main className="inner-page projects-page">
      <div className="page-heading">
        <span className="eyebrow">03 / {t.projectsNote}</span>
        <h1>
          {t.projects}
          <span className="chalk-period">.</span>
        </h1>
      </div>
      <div className="projects-orbit" aria-hidden="true" />
      <div className="project-butterfly">
        <Butterfly />
      </div>
      <section
        className="project-stage"
        aria-label={t.projectsLabel}
        aria-live="polite"
        aria-busy={status === "loading"}
      >
        <AnimatePresence mode="wait">
          {status === "loading" ? (
            <motion.div
              key="loading"
              className="project-loading"
              exit={{ opacity: 0 }}
            >
              <span className="loading-star">✦</span>
              <p>{t.loadingProjects}</p>
            </motion.div>
          ) : current ? (
            <motion.article
              className="project-sheet"
              key={current.id}
              initial={{ opacity: 0, y: 20, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: -2 }}
              exit={{ opacity: 0, y: -15, rotate: 1 }}
              transition={{ duration: 0.45 }}
            >
              <span className="project-index">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(repositories.length).padStart(2, "0")}
              </span>
              <span className="project-doodle" aria-hidden="true">
                ✳
              </span>
              <h2>{current.name}</h2>
              <p>{current.description || t.projectFallback}</p>
              <div className="project-sheet-bottom">
                <span>{current.language ?? t.experiment}</span>
                <a
                  href={current.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.open} <ArrowUpRight size={16} />
                </a>
              </div>
            </motion.article>
          ) : (
            <motion.div
              key="empty"
              className="projects-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="empty-orbit" aria-hidden="true">
                ✧
              </span>
              <h2 className="handwritten">{t.emptyProjects}</h2>
              <p>{status === "error" ? t.projectsError : t.projectsBody}</p>
              <a
                className="text-link"
                href="https://github.com/subdivo?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.github} <ArrowUpRight size={16} />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      {repositories.length > 1 && (
        <div className="project-controls">
          <button
            onClick={() => changeProject(-1)}
            aria-label={t.previousProject}
          >
            <ArrowLeft size={20} strokeWidth={1} />
          </button>
          <span>
            {String(index + 1).padStart(2, "0")}
            <i />
            {String(repositories.length).padStart(2, "0")}
          </span>
          <button onClick={() => changeProject(1)} aria-label={t.nextProject}>
            <ArrowRight size={20} strokeWidth={1} />
          </button>
        </div>
      )}
      {current && (
        <a
          className="text-link all-projects"
          href="https://github.com/subdivo?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.allProjects} <ArrowUpRight size={14} />
        </a>
      )}
    </main>
  );
}
