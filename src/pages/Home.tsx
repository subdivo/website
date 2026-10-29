import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Butterfly, FlightTrail } from "../components/Atmosphere";
import { Contacts } from "../components/Contacts";
import { useLanguage } from "../i18n/useLanguage";

export function Home() {
  const { t } = useLanguage();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 100]);
  const opacity = useTransform(scrollY, [0, 650], [1, 0.2]);
  const reduced = useReducedMotion();
  return (
    <main className="home">
      <section className="hero" aria-labelledby="hero-title">
        <motion.div
          className="hero-copy"
          style={reduced ? undefined : { y, opacity }}
        >
          <h1
            id="hero-title"
            className="hero-title"
            aria-label="Just Creating Things"
          >
            {["Just", "Creating", "Things"].map((word, i) => (
              <motion.span
                key={word}
                className={`title-line title-line-${i}`}
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.3, delay: 0.25 + i * 0.18 }}
              >
                {word}
              </motion.span>
            ))}
          </h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1.4 }}
          >
            {t.subtitle}
          </motion.p>
        </motion.div>
        <motion.div
          className="hero-flight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.6 }}
        >
          <Butterfly />
          <FlightTrail />
        </motion.div>
        <a
          className="scroll-whisper"
          href="#contacts"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("contacts")
              ?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
          }}
          aria-label={t.toContacts}
        >
          <span />
          <i />
        </a>
      </section>
      <Contacts />
    </main>
  );
}
