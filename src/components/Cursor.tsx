import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 360, damping: 32, mass: 0.45 });
  const ringY = useSpring(y, { stiffness: 360, damping: 32, mass: 0.45 });
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const sequence = useRef(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const hide = () => {
      setVisible(false);
      setPressed(false);
      document.documentElement.classList.remove("custom-cursor-active");
    };
    const move = (event: PointerEvent) => {
      if (!pointer.matches || event.pointerType !== "mouse") {
        hide();
        return;
      }
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
      document.documentElement.classList.add("custom-cursor-active");
      setHovering(
        event.target instanceof Element &&
          !!event.target.closest(
            'a, button, input, textarea, select, [role="button"]',
          ),
      );
    };
    const down = (event: PointerEvent) => {
      if (
        !pointer.matches ||
        event.pointerType !== "mouse" ||
        event.button !== 0
      )
        return;
      setPressed(true);
      const ripple = {
        id: sequence.current++,
        x: event.clientX,
        y: event.clientY,
      };
      setRipples((previous) => [...previous.slice(-3), ripple]);
    };
    const up = () => setPressed(false);
    const leave = (event: PointerEvent) => {
      if (!event.relatedTarget) hide();
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    window.addEventListener("pointerout", leave, { passive: true });
    window.addEventListener("blur", hide);
    pointer.addEventListener("change", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointerout", leave);
      window.removeEventListener("blur", hide);
      pointer.removeEventListener("change", hide);
      hide();
    };
  }, [x, y]);

  return (
    <div className="cursor-layer" aria-hidden="true">
      <motion.div
        className="cursor-dot"
        style={{ x, y }}
        animate={{ opacity: visible ? 1 : 0, scale: pressed ? 0.55 : 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        className="cursor-ring"
        style={{ x: reduced ? x : ringX, y: reduced ? y : ringY }}
        animate={{
          opacity: visible ? (hovering ? 0.8 : 0.4) : 0,
          width: hovering ? 40 : 26,
          height: hovering ? 40 : 26,
          scale: pressed ? 0.75 : 1,
          backgroundColor: hovering
            ? "rgba(255,255,255,0.06)"
            : "rgba(255,255,255,0)",
        }}
        transition={{ duration: 0.25 }}
      />
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="click-ripple"
            style={{ left: ripple.x, top: ripple.y }}
            initial={{ opacity: 0.55, scale: 0.3 }}
            animate={{ opacity: 0, scale: reduced ? 0.7 : 1.7 }}
            transition={{ duration: reduced ? 0.15 : 0.7, ease: "easeOut" }}
            onAnimationComplete={() =>
              setRipples((previous) =>
                previous.filter((item) => item.id !== ripple.id),
              )
            }
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
