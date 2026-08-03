"use client";

import { useEffect, useRef, useState } from "react";
import { KIND_LABEL, type TimelineEntry } from "@/lib/timeline";

type TimelineProps = {
  entries: TimelineEntry[];
  className?: string;
};

/**
 * Vertical spine blending work and project milestones.
 *
 * The line is a real SVG stroke with `pathLength="1"`, drawn by driving
 * `stroke-dashoffset` from 1 → 0 against scroll position. Normalizing
 * pathLength means the geometry can be any height without recomputing dash
 * math. The offset is written straight to the DOM in a rAF rather than held
 * in state — this updates every frame, and re-rendering the list that often
 * would be wasteful.
 */
export default function Timeline({ entries, className = "" }: TimelineProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // The spine spans dot-center to dot-center, not the full list box, so it
  // never overshoots past the first or last node. Measured, because row
  // heights depend on wrapped text and loaded fonts.
  const [spine, setSpine] = useState<{ top: number; height: number } | null>(
    null,
  );

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      const dots = dotRefs.current.filter(Boolean) as HTMLSpanElement[];
      if (dots.length < 2) {
        setSpine(null);
        return;
      }

      const listTop = list.getBoundingClientRect().top;
      const first = dots[0].getBoundingClientRect();
      const last = dots[dots.length - 1].getBoundingClientRect();
      const top = first.top - listTop + first.height / 2;
      const bottom = last.top - listTop + last.height / 2;

      setSpine({ top, height: Math.max(bottom - top, 0) });
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [entries.length]);

  useEffect(() => {
    const list = listRef.current;
    const line = lineRef.current;
    if (!list || !line) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      line.style.strokeDashoffset = "0";
      return;
    }

    let frame = 0;
    let queued = false;

    // Velocity state — derived from the same progress value that drives the
    // stroke, so there is no second scroll listener and the two can never
    // disagree about where the page is.
    let lastProgress: number | null = null;
    let lastTime = 0;
    let smoothedVelocity = 0;

    // Slow, deliberate reveal at rest; snappy catch-up when flung.
    const SLOW_MS = 560;
    const FAST_MS = 90;
    // Progress-units per second at which the line is fully "snappy".
    const VELOCITY_CEILING = 1.6;

    const update = () => {
      queued = false;
      const rect = list.getBoundingClientRect();
      // Drawing starts as the spine's top passes 75% of the viewport and
      // completes as its bottom reaches the same line.
      const anchor = window.innerHeight * 0.75;
      const progress = Math.min(
        Math.max((anchor - rect.top) / Math.max(rect.height, 1), 0),
        1,
      );

      const now = performance.now();
      if (lastProgress !== null) {
        const elapsed = Math.max(now - lastTime, 1) / 1000;
        const instant = Math.abs(progress - lastProgress) / elapsed;
        // Asymmetric smoothing: ramp up fast so a flick is caught on the first
        // frame, decay slowly so the line doesn't snap back to sluggish the
        // instant the finger lifts.
        const weight = instant > smoothedVelocity ? 0.5 : 0.08;
        smoothedVelocity += (instant - smoothedVelocity) * weight;
      }
      lastProgress = progress;
      lastTime = now;

      const intensity = Math.min(smoothedVelocity / VELOCITY_CEILING, 1);
      const duration = SLOW_MS + (FAST_MS - SLOW_MS) * intensity;

      line.style.transitionDuration = `${Math.round(duration)}ms`;
      line.style.strokeDashoffset = String(1 - progress);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [entries.length, spine]);

  // Recruiter mode never reaches this component — pages swap in
  // <TimelineDocument /> at the page level instead.
  return (
    <ol ref={listRef} className={`relative ${className}`}>
      {/* Faint full-length track so the spine reads as a path before it draws */}
      {spine && (
        <div
          aria-hidden
          className="absolute left-0 w-3"
          style={{ top: spine.top, height: spine.height }}
        >
          <svg
            className="h-full w-full overflow-visible"
            viewBox="0 0 12 100"
            preserveAspectRatio="none"
          >
            <line
              x1="6"
              y1="0"
              x2="6"
              y2="100"
              stroke="rgba(255,255,255,0.09)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <line
              ref={lineRef}
              x1="6"
              y1="0"
              x2="6"
              y2="100"
              stroke="rgba(235,235,240,0.55)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1}
              // Duration is rewritten every frame from scroll velocity;
              // this is only the pre-scroll default.
              style={{ transition: "stroke-dashoffset 560ms var(--ease-smooth)" }}
            />
          </svg>
        </div>
      )}

      {entries.map((entry, index) => (
        <li
          key={entry.id}
          className="group relative grid grid-cols-[12px_1fr] gap-x-5 pb-12 last:pb-0 sm:gap-x-7"
        >
          <div className="relative pt-[7px]">
            {entry.present && (
              <span
                aria-hidden
                className="absolute left-0 top-[7px] h-3 w-3 rounded-full bg-[rgba(240,240,245,0.9)] animate-breathe"
              />
            )}

            <span
              ref={(node) => {
                dotRefs.current[index] = node;
              }}
              className={`ease-smooth relative block h-3 w-3 rounded-full border transition-[background-color,border-color,box-shadow] duration-500 ${
                entry.present
                  ? "border-white/60 bg-[rgba(240,240,245,0.92)] shadow-[0_0_12px_rgba(235,235,240,0.45)]"
                  : "border-white/25 bg-ink-800 group-hover:border-white/60 group-hover:bg-[rgba(235,235,240,0.85)] group-hover:shadow-[0_0_14px_rgba(235,235,240,0.4)]"
              }`}
            />
          </div>

          <div className="-mt-0.5">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="label-mono">{KIND_LABEL[entry.kind]}</span>
              <span
                className={`font-mono text-[11px] uppercase tracking-label text-text-secondary ${
                  entry.datePlaceholder
                    ? "underline decoration-dashed decoration-white/30 underline-offset-4"
                    : ""
                }`}
                title={
                  entry.datePlaceholder
                    ? "Placeholder date — needs replacing"
                    : undefined
                }
              >
                {entry.date}
              </span>
            </div>

            <h3 className="ease-smooth mt-3 text-lg font-semibold text-text-primary transition-colors duration-500 md:text-xl">
              {entry.title}
            </h3>

            <p className="ease-smooth mt-1 text-sm text-text-secondary transition-colors duration-500 group-hover:text-text-primary">
              {entry.org}
            </p>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-muted">
              {entry.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
