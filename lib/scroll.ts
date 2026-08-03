import { NAV_HEIGHT } from "./nav";

/**
 * Evaluates a CSS cubic-bezier curve. Newton-Raphson to invert x(t), then
 * sample y(t).
 *
 * Native `scrollIntoView({ behavior: "smooth" })` uses the browser's own
 * built-in curve and offers no way to supply one, so honouring the
 * `ease-smooth` design token means animating the scroll ourselves.
 */
function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;

  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleDerivativeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  return (x: number) => {
    let t = x;
    for (let i = 0; i < 5; i++) {
      const derivative = sampleDerivativeX(t);
      if (Math.abs(derivative) < 1e-6) break;
      t -= (sampleX(t) - x) / derivative;
    }
    return sampleY(t);
  };
}

/** Mirrors --ease-smooth in globals.css. */
const easeSmooth = cubicBezier(0.22, 1, 0.36, 1);

export function smoothScrollToId(id: string, offset = NAV_HEIGHT + 24) {
  const element = document.getElementById(id);
  if (!element) return;

  const targetY = Math.max(
    element.getBoundingClientRect().top + window.scrollY - offset,
    0,
  );

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, targetY);
    return;
  }

  const startY = window.scrollY;
  const distance = targetY - startY;
  if (Math.abs(distance) < 2) return;

  // `html { scroll-behavior: smooth }` would apply the browser's own easing to
  // every scrollTo below and fight this animation. Suspend it for the duration.
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";

  const duration = Math.min(Math.max(Math.abs(distance) * 0.45, 420), 900);
  const start = performance.now();

  const step = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    window.scrollTo(0, startY + distance * easeSmooth(progress));

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      root.style.scrollBehavior = previousBehavior;
    }
  };

  requestAnimationFrame(step);
}
