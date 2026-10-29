import { ArrowUpRight, Github, Send } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../i18n/useLanguage";

export function Contacts({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();
  return (
    <motion.section
      id="contacts"
      className={`contacts ${compact ? "contacts-compact" : ""}`}
      aria-labelledby="contact-title"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1 }}
    >
      <span className="contact-spark" aria-hidden="true">
        ✧
      </span>
      <h2 id="contact-title">{t.contacts}</h2>
      <div className="contact-links">
        <a
          href="https://t.me/subdivo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Send size={16} strokeWidth={1.25} />
          <span>Telegram</span>
          <ArrowUpRight className="contact-arrow" size={12} />
        </a>
        <a
          href="https://github.com/subdivo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github size={16} strokeWidth={1.25} />
          <span>GitHub</span>
          <ArrowUpRight className="contact-arrow" size={12} />
        </a>
        <span className="contact-unavailable" aria-label={`X — ${t.soon}`}>
          <span className="x-symbol">𝕏</span>
          <span>X</span>
          <small>{t.soon}</small>
        </span>
      </div>
    </motion.section>
  );
}
