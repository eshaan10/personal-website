"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRecruiterMode } from "./AppProviders";

/**
 * Full-screen entrance: scattered particles drift, then converge into "EP",
 * hold, and fade through to the page.
 *
 * - Plays once per browser session (sessionStorage, so route changes never
 *   replay it but a fresh session does).
 * - One <canvas>, all particles drawn per frame — no per-particle DOM nodes.
 * - Reduced motion, recruiter mode, and low-power devices skip the particle
 *   phase and get a quick fade.
 *
 * FAILSAFES — the overlay must never be able to block the site:
 * 1. JS watchdog: if the handoff hasn't completed WATCHDOG_MS after mount,
 *    the overlay force-removes itself regardless of what stalled.
 * 2. CSS failsafe (`.entrance-overlay` in globals.css): a pure-CSS delayed
 *    animation hides the overlay at ~3.2s even if hydration never runs at
 *    all — a wedged dev hot-reload, a crashed bundle, blocked JS. The
 *    overlay is in the server-rendered HTML, so JS-only removal is a
 *    single point of failure without this.
 * 3. Every throwing step (storage access, canvas setup, glyph sampling)
 *    is caught and degrades to the plain fade path.
 */

const SESSION_KEY = "ep-entrance-seen";

const CONVERGE_MS = 1500;
const HOLD_MS = 300;
const FADE_MS = 650;
/** Force-complete threshold — comfortably past converge + hold + fade. */
const WATCHDOG_MS = 3000;
/**
 * Hard ceiling on particle count. Raised well past the original 650 — at that
 * count the sampling grid was coarse enough to leave visible gaps along the
 * curves of the "P" and the arms of the "E". Affordable because the draw is
 * batched (see ALPHA_BUCKETS): cost scales with bucket count, not particle
 * count.
 */
const MAX_PARTICLES = 3200;

/**
 * Per-particle alpha is quantised into this many buckets so each frame issues
 * one `fill()` per bucket instead of one per particle. At ~1–2px a viewer
 * cannot distinguish 8 opacity steps from a continuous ramp, and it turns
 * ~3200 fill calls per frame into 8.
 */
const ALPHA_BUCKETS = 8;

type Phase = "init" | "play" | "fade" | "done";

/**
 * Module-scope memo of this page-load's decision. React StrictMode runs the
 * deciding effect twice in dev; without this, run #1 writes the session flag
 * and run #2 reads it back and skips — so the entrance never played in dev
 * and the flag was set anyway. The second invocation must repeat the first's
 * decision, not re-derive it from state the first just mutated.
 */
let decidedPhase: Exclude<Phase, "init"> | null = null;

/** Matches the site's ease-entrance token closely enough for canvas use. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

type Particle = {
  startX: number;
  startY: number;
  driftX: number;
  driftY: number;
  targetX: number;
  targetY: number;
  delay: number;
  duration: number;
  radius: number;
};

/**
 * Rasterises "EP" offscreen at 1x and samples filled pixels into particle
 * targets. Sampling in CSS-pixel space keeps the math DPR-independent.
 * Returns [] on any failure — callers treat that as "skip to fade".
 */
function buildParticles(width: number, height: number): Particle[] {
  try {
    if (width < 10 || height < 10) return [];

    const off = document.createElement("canvas");
    off.width = width;
    off.height = height;
    const ctx = off.getContext("2d", { willReadFrequently: true });
    if (!ctx) return [];

    const fontSize = Math.min(width * 0.3, height * 0.42, 320);
    ctx.font = `700 ${fontSize}px Inter, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";
    ctx.fillText("EP", width / 2, height / 2);

    const data = ctx.getImageData(0, 0, width, height).data;

    // Grid step scales with glyph size so density stays constant across
    // viewports. Tightened from fontSize/42 — that produced an 8px lattice at
    // full size, coarse enough to read as gappy along diagonal and curved
    // edges where the sample grid aliases against the letterform.
    const step = Math.max(2, Math.round(fontSize / 120));
    const targets: [number, number][] = [];

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        if (data[(y * width + x) * 4 + 3] > 128) targets.push([x, y]);
      }
    }

    // Thin evenly rather than truncating — slicing off the tail would erase
    // the bottom of the "P" instead of lightening the whole mark.
    const stride = Math.max(1, Math.ceil(targets.length / MAX_PARTICLES));

    return targets
      .filter((_, index) => index % stride === 0)
      .map(([tx, ty]) => ({
        startX: Math.random() * width,
        startY: Math.random() * height,
        driftX: (Math.random() - 0.5) * 24,
        driftY: (Math.random() - 0.5) * 24,
        targetX: tx,
        targetY: ty,
        delay: Math.random() * 380,
        duration: 850 + Math.random() * 450,
        radius: 0.9 + Math.random() * 0.9,
      }));
  } catch (error) {
    console.warn("[entrance] particle sampling failed", error);
    return [];
  }
}

export default function EntranceScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("init");
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const { recruiterMode } = useRecruiterMode();

  // Decide before first paint: repeat visitors never see even one overlay
  // frame, and first-timers never see the page flash beneath it.
  useLayoutEffect(() => {
    // StrictMode re-run: repeat the earlier decision instead of re-deriving
    // it from the flag that decision just wrote.
    if (decidedPhase) {
      setPhase(decidedPhase);
      return;
    }

    let seen = false;
    try {
      seen = Boolean(sessionStorage.getItem(SESSION_KEY));
      if (!seen) sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Storage blocked (e.g. cookies disabled). Play once; we just can't
      // remember having done so. Never let storage access crash the app.
    }

    if (seen) {
      decidedPhase = "done";
      setPhase("done");
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Proactive low-end fallback: few cores or little memory → fade only.
    const memory = (navigator as { deviceMemory?: number }).deviceMemory;
    const lowPower =
      (memory !== undefined && memory <= 4) ||
      (navigator.hardwareConcurrency ?? 8) <= 4;

    decidedPhase = reduce || recruiterMode || lowPower ? "fade" : "play";
    setPhase(decidedPhase);
    // Decides once per page load; must not re-trigger on later toggle flips.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // JS watchdog: whatever happens — font stall, sampling failure, a rAF that
  // never fires — the overlay is gone WATCHDOG_MS after mount.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (phaseRef.current !== "done") {
        console.warn("[entrance] watchdog fired — forcing completion");
        setPhase("done");
      }
    }, WATCHDOG_MS);
    return () => window.clearTimeout(timer);
  }, []);

  // Scroll lock while the overlay owns the screen.
  useEffect(() => {
    if (phase !== "play" && phase !== "fade") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [phase]);

  // Fade phase resolves itself after the CSS transition completes.
  useEffect(() => {
    if (phase !== "fade") return;
    const timer = window.setTimeout(() => setPhase("done"), FADE_MS + 50);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "play") return;
    const canvas = canvasRef.current;
    if (!canvas) {
      setPhase("fade");
      return;
    }

    let frame = 0;
    let cancelled = false;

    const run = async () => {
      try {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setPhase("fade");
          return;
        }

        const width = window.innerWidth;
        const height = window.innerHeight;
        // A field of ≤2px soft dots doesn't benefit from 3x rendering.
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        // Sample the real webfont, not the fallback — but never stall the
        // entrance on a slow font load.
        await Promise.race([
          document.fonts.ready,
          new Promise((resolve) => setTimeout(resolve, 400)),
        ]);
        if (cancelled) return;

        const particles = buildParticles(width, height);
        if (particles.length === 0) {
          setPhase("fade");
          return;
        }

        const start = performance.now();
        const total = CONVERGE_MS + HOLD_MS;

        const TAU = Math.PI * 2;
        ctx.fillStyle = "rgba(230, 230, 235, 1)";

        const tick = (now: number) => {
          try {
            const elapsed = now - start;
            ctx.clearRect(0, 0, width, height);

            // One path per alpha bucket, so the whole field costs
            // ALPHA_BUCKETS fill calls rather than one per particle.
            const paths: Path2D[] = [];
            for (let i = 0; i < ALPHA_BUCKETS; i++) paths.push(new Path2D());

            const driftPhase = (elapsed / 1000) * Math.PI;

            for (const p of particles) {
              const progress = Math.min(
                Math.max((elapsed - p.delay) / p.duration, 0),
                1,
              );
              const eased = easeOut(progress);

              // Pre-convergence drift layered under the pull, fading out as
              // the particle arrives so the assembled mark sits still.
              const wander = 1 - eased;
              const x =
                p.startX +
                (p.targetX - p.startX) * eased +
                Math.sin(driftPhase + p.startX) * p.driftX * wander;
              const y =
                p.startY +
                (p.targetY - p.startY) * eased +
                Math.cos(driftPhase + p.startY) * p.driftY * wander;

              const bucket = Math.min(
                ALPHA_BUCKETS - 1,
                Math.floor(eased * ALPHA_BUCKETS),
              );
              const path = paths[bucket];
              // Without the moveTo, each arc is joined to the previous one by
              // a straight line and the field renders as a scribble.
              path.moveTo(x + p.radius, y);
              path.arc(x, y, p.radius, 0, TAU);
            }

            for (let i = 0; i < ALPHA_BUCKETS; i++) {
              ctx.globalAlpha =
                0.25 + ((i + 0.5) / ALPHA_BUCKETS) * 0.65;
              ctx.fill(paths[i]);
            }

            if (elapsed < total) {
              frame = requestAnimationFrame(tick);
            } else {
              setPhase("fade");
            }
          } catch (error) {
            console.warn("[entrance] draw failed", error);
            setPhase("fade");
          }
        };

        frame = requestAnimationFrame(tick);
      } catch (error) {
        console.warn("[entrance] setup failed", error);
        setPhase("fade");
      }
    };

    run();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden
      data-print-hide
      // `entrance-overlay` carries the pure-CSS failsafe (globals.css): a
      // delayed animation hides this element even if JS never runs.
      className={`entrance-overlay fixed inset-0 z-[80] ${
        phase === "fade" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{
        background: "var(--bg-gradient)",
        transition: `opacity ${FADE_MS}ms var(--ease-smooth)`,
      }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
