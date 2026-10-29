import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

export function Atmosphere() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1200], [0, -140]);
  const reduced = useReducedMotion();
  return (
    <>
      <motion.div
        className="night-backdrop"
        style={reduced ? undefined : { y }}
        aria-hidden="true"
      />
      <div className="paper-grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
    </>
  );
}

export function Butterfly({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={`butterfly ${className}`}
      aria-hidden="true"
      animate={
        reduced
          ? undefined
          : {
              y: [0, -16, -4, 8, 0],
              x: [0, 9, -4, -9, 0],
              rotate: [-9, 1, -5, -12, -9],
            }
      }
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="butterfly-wings">
        <img src="/art/butterfly.png" alt="" />
      </div>
    </motion.div>
  );
}

export function FlightTrail({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`flight-trail ${className}`}
      viewBox="0 0 320 480"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M221 15C375 151 30 135 92 273C128 354 253 353 144 462"
        stroke="currentColor"
        strokeWidth=".65"
        pathLength="1"
      />
    </svg>
  );
}
