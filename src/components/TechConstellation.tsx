import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { connections, technologies } from "../data/technologies";
import { useLanguage } from "../i18n/useLanguage";

export function TechConstellation() {
  const { language, t } = useLanguage();
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const active = hovered ?? focused ?? selected;
  const technology = active === null ? null : technologies[active];

  return (
    <section className="technology-section" aria-labelledby="tools-title">
      <div className="technology-heading">
        <h2 id="tools-title">{t.tools}</h2>
        <p>{t.toolsHint}</p>
      </div>
      <div
        className="technology-universe"
        role="group"
        aria-label={t.toolsLabel}
      >
        <svg
          className="technology-connections"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          {connections.map(([from, to]) => (
            <line
              key={`${from}-${to}`}
              x1={technologies[from].x}
              y1={technologies[from].y}
              x2={technologies[to].x}
              y2={technologies[to].y}
              className={
                active === from || active === to ? "is-illuminated" : ""
              }
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
        {technologies.map((tool, index) => (
          <button
            type="button"
            key={tool.name}
            className={`technology-star ${active === index ? "is-active" : ""} ${tool.learning ? "is-learning" : ""}`}
            style={{ left: `${tool.x}%`, top: `${tool.y}%` }}
            aria-pressed={selected === index}
            aria-describedby={
              active === index ? "technology-explanation" : undefined
            }
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setHovered(index);
            }}
            onPointerLeave={() => setHovered(null)}
            onFocus={() => setFocused(index)}
            onBlur={() => setFocused(null)}
            onClick={(event) => {
              if (selected === index) {
                setSelected(null);
                setHovered(null);
                setFocused(null);
                event.currentTarget.blur();
              } else setSelected(index);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setSelected(null);
                setHovered(null);
                setFocused(null);
                event.currentTarget.blur();
              }
            }}
          >
            <span className="technology-point" aria-hidden="true">
              {tool.learning ? "✧" : "✦"}
            </span>
            <span className="technology-name">{tool.name}</span>
            {tool.learning && (
              <span className="technology-learning">{t.learning}</span>
            )}
          </button>
        ))}
        <AnimatePresence mode="wait">
          {technology && (
            <motion.div
              key={technology.name}
              className={`technology-tooltip ${technology.y > 55 ? "tooltip-above" : ""}`}
              id="technology-explanation"
              role="status"
              aria-live="polite"
              aria-atomic="true"
              style={{
                left: `clamp(135px, ${technology.x}%, calc(100% - 135px))`,
                top: `${technology.y}%`,
              }}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <span className="technology-category">
                {technology.group[language]}
              </span>
              <h3>{technology.name}</h3>
              <p>{technology.description[language]}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
