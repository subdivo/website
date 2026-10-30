import { useEffect } from "react";
import Lenis from "lenis";

export function useCinema() {
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
    document.title = "subdivo";
  }, []);
}
