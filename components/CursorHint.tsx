"use client";

import { useEffect, useRef, useState } from "react";
import { useRecruiterMode } from "./AppProviders";

/** Elements the cursor is magnetically attracted to. */
const MAGNETIC = 'a, button, [role="button"], summary, [data-magnetic]';

/** Elements that swap the ring for a thin I-beam. */
const TEXTUAL =
  'input, textarea, select, [contenteditable="true"], p, li, h1, h2, h3, h4, blockquote, code, pre, dd, dt';

/** Radius (px) within which magnetism begins to pull. */
const MAGNET_RADIUS = 44;
/** Cap on how far toward an element's centre the cursor is dragged. */
const MAGNET_STRENGTH = 0.45;

type Mode = "default" | "magnetic" | "text";

/**
 * Custom cursor: ring + centre dot, magnetic snap, blend-mode contrast.
 *
 * The native cursor is hidden (see `data-cursor-hidden` in globals.css) only
 * while this component is genuinely running — fine pointer, motion not
 * reduced, recruiter mode off. Under reduced motion it renders nothing and
 * never sets the attribute, so the OS cursor is untouched.
 *
 * Contrast comes from `mix-blend-mode: difference` against pure white, which
 * inverts whatever is behind it — legible over the dark gradient, recruiter
 * mode's white paper, and every project accent glow, without knowing any of
 * their colours.
 */
export default function CursorHint() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const [visible, setVisible] = useState(false);
  const { recruiterMode } = useRecruiterMode();

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Coarse pointers keep the native cursor: nothing to replace it with on
    // touch, and no hover to drive any of this.
    if (!fine || reduce) return;
    setEnabled(true);
  }, []);

  const active = enabled && !recruiterMode;

  useEffect(() => {
    const root = document.documentElement;
    if (!active) {
      root.removeAttribute("data-cursor-hidden");
      return;
    }
    root.setAttribute("data-cursor-hidden", "");
    return () => root.removeAttribute("data-cursor-hidden");
  }, [active]);

  useEffect(() => {
    if (!active) return;

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let ringX = 0;
    let ringY = 0;
    let dotX = 0;
    let dotY = 0;
    let seeded = false;

    // Probing is done once per frame, not once per pointermove — a high-poll
    // mouse fires move events far faster than the display refreshes, and each
    // probe forces a style recalc.
    let probedX = Number.NaN;
    let probedY = Number.NaN;
    let currentMode: Mode = "default";

    /**
     * Nearest magnetic element to the pointer, or null.
     *
     * Probes the pointer plus four points a magnet-radius away, then picks the
     * candidate whose centre is closest. Taking the first probe that hits
     * instead makes the choice depend on probe order, which flips the target
     * discontinuously as the pointer crosses the gap between two adjacent
     * cards — the cursor teleports from one card's centre to the other's.
     */
    const findMagnet = (x: number, y: number) => {
      const probes: [number, number][] = [
        [x, y],
        [x + MAGNET_RADIUS, y],
        [x - MAGNET_RADIUS, y],
        [x, y + MAGNET_RADIUS],
        [x, y - MAGNET_RADIUS],
      ];

      let best: { rect: DOMRect; distance: number } | null = null;
      const seen = new Set<Element>();

      for (const [px, py] of probes) {
        const hit = document.elementFromPoint(px, py)?.closest(MAGNETIC);
        if (!hit || seen.has(hit)) continue;
        seen.add(hit);

        const rect = hit.getBoundingClientRect();
        const distance = Math.hypot(
          x - (rect.left + rect.width / 2),
          y - (rect.top + rect.height / 2),
        );

        if (!best || distance < best.distance) best = { rect, distance };
      }

      return best;
    };

    const setModeIfChanged = (next: Mode) => {
      if (next === currentMode) return;
      currentMode = next;
      setMode(next);
    };

    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;

      if (!seeded) {
        ringX = dotX = targetX = pointerX;
        ringY = dotY = targetY = pointerY;
        seeded = true;
        setVisible(true);
      }
    };

    /**
     * Clearing `seeded` is load-bearing, not tidy-up.
     *
     * `setVisible(true)` lives inside the `if (!seeded)` branch below, which
     * runs exactly once. Without this reset, the first document-level
     * pointerleave hid the cursor permanently — it kept tracking the pointer,
     * but at opacity 0 until a reload. The nav sits flush against the top of
     * the viewport, so reaching for it is the easiest way to overshoot past
     * y=0 and leave the document, which is why it looked like a nav bug.
     *
     * Re-seeding also snaps the ring and dot to the re-entry point instead of
     * lerping them across the whole viewport from wherever they were left.
     */
    const onLeave = () => {
      seeded = false;
      setVisible(false);
    };

    const tick = () => {
      if (pointerX !== probedX || pointerY !== probedY) {
        probedX = pointerX;
        probedY = pointerY;

        const magnet = findMagnet(pointerX, pointerY);

        if (magnet) {
          const { rect } = magnet;
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          // Pull scales with proximity so the cursor slides in gradually
          // rather than snapping once it crosses a threshold.
          const reach = Math.max(rect.width, rect.height) / 2 + MAGNET_RADIUS;
          const pull =
            Math.max(0, 1 - magnet.distance / reach) * MAGNET_STRENGTH;

          targetX = pointerX + (centerX - pointerX) * pull;
          targetY = pointerY + (centerY - pointerY) * pull;
          setModeIfChanged("magnetic");
        } else {
          targetX = pointerX;
          targetY = pointerY;
          const under = document.elementFromPoint(pointerX, pointerY);
          setModeIfChanged(under?.closest(TEXTUAL) ? "text" : "default");
        }
      }

      ringX += (targetX - ringX) * 0.16;
      ringY += (targetY - ringY) * 0.16;
      // Tighter, so the dot reads as the pointer itself.
      dotX += (targetX - dotX) * 0.55;
      dotY += (targetY - dotY) * 0.55;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      }

      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [active]);

  if (!active) return null;

  const ringShape =
    mode === "magnetic"
      ? "h-12 w-12 rounded-full border-2"
      : mode === "text"
        ? "h-6 w-[2px] rounded-none border-0 bg-white"
        : "h-7 w-7 rounded-full border";

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        data-print-hide
        // `view-transition-name` lifts these out of the root snapshot. Without
        // it they are captured inside it and inherit the page's rise-in
        // translate, so the cursor visibly slides on every navigation click.
        style={
          {
            mixBlendMode: "difference",
            viewTransitionName: "cursor-ring",
          } as React.CSSProperties
        }
        className={`ease-smooth pointer-events-none fixed left-0 top-0 z-[60] border-white transition-[width,height,opacity,border-width,border-radius] duration-300 ${ringShape} ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* The dot is meaningless inside an I-beam, so it hides in text mode. */}
      <div
        ref={dotRef}
        aria-hidden
        data-print-hide
        style={
          {
            mixBlendMode: "difference",
            viewTransitionName: "cursor-dot",
          } as React.CSSProperties
        }
        className={`ease-smooth pointer-events-none fixed left-0 top-0 z-[61] rounded-full bg-white transition-[width,height,opacity] duration-300 ${
          visible && mode !== "text" ? "opacity-100" : "opacity-0"
        } ${mode === "magnetic" ? "h-1 w-1" : "h-1.5 w-1.5"}`}
      />
    </>
  );
}
