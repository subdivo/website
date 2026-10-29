import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLocation } from "react-router-dom";

const cinematicEase = [0.76, 0, 0.24, 1] as const;

export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const reduced = useReducedMotion();
  return (
    <>
      <AnimatePresence initial={false}>
        {!reduced && (
          <motion.div
            key={pathname}
            className="scene-shutter"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 1.65,
              times: [0, 0.34, 0.56, 1],
              ease: cinematicEase,
            }}
          >
            <motion.div
              className="scene-shutter-iris"
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: [0.9, 1.05, 1.25], opacity: [0, 0.45, 0] }}
              transition={{ duration: 1.65 }}
            />
            <motion.span
              className="scene-shutter-star"
              initial={{ opacity: 0, rotate: -40, scale: 0.7 }}
              animate={{
                opacity: [0, 0.55, 0],
                rotate: 45,
                scale: [0.7, 1, 0.7],
              }}
              transition={{ duration: 1.4 }}
            >
              ✦
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => window.scrollTo({ top: 0, behavior: "instant" })}
      >
        <motion.div
          id="main-content"
          tabIndex={-1}
          key={pathname}
          className="page-scene"
          initial={
            reduced
              ? { opacity: 0 }
              : { opacity: 0, y: 28, scale: 1.025, filter: "blur(8px)" }
          }
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={
            reduced
              ? { opacity: 0 }
              : { opacity: 0, y: -16, scale: 0.98, filter: "blur(8px)" }
          }
          transition={
            reduced
              ? { duration: 0.15 }
              : { duration: 0.85, ease: cinematicEase }
          }
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
