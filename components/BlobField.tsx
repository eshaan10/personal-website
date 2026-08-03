"use client";

import { useEffect, useRef } from "react";
import { MONOCHROME_ACCENT, type Accent } from "@/lib/projects";

/**
 * CSS ambient glow blobs — the fallback when WebGL is unavailable, and the
 * path used under `prefers-reduced-motion`.
 *
 * Colour is applied as `background-color` behind a radial `mask-image` rather
 * than as a `radial-gradient` background. Gradients aren't animatable, so a
 * gradient-based blob would hard-cut between project accents; a masked solid
 * fill transitions smoothly, which is what the accent system needs.
 *
 * Two layers per blob: outer takes the mouse-follow offset, inner runs the
 * ambient keyframes, so the cursor pull layers on top of the drift.
 */

const MASK = "radial-gradient(closest-side, #000 0%, transparent 72%)";

function rgba([r, g, b]: [number, number, number], alpha: number) {
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function BlobField({
  accent = MONOCHROME_ACCENT,
}: {
  accent?: Accent;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;

    const onPointerMove = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth) * 2 - 1;
      targetY = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const tick = () => {
      // Low lerp factor — the pull lags well behind the cursor, so it reads
      // as ambient rather than as something chasing the mouse.
      currentX += (targetX - currentX) * 0.025;
      currentY += (targetY - currentY) * 0.025;
      root.style.setProperty("--blob-x", currentX.toFixed(4));
      root.style.setProperty("--blob-y", currentY.toFixed(4));
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      data-print-hide
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ ["--blob-x" as string]: 0, ["--blob-y" as string]: 0 }}
    >
      <div
        className="absolute left-[8%] top-[-10%] h-[70vmax] w-[70vmax] will-change-transform"
        style={{
          transform:
            "translate3d(calc(var(--blob-x) * 46px), calc(var(--blob-y) * 46px), 0)",
          transition: "transform 1.2s var(--ease-smooth)",
        }}
      >
        <div
          className="h-full w-full animate-blob-a will-change-transform"
          style={{
            backgroundColor: rgba(accent.a, 0.18),
            maskImage: MASK,
            WebkitMaskImage: MASK,
            filter: "blur(10px)",
            transition: "background-color 900ms var(--ease-smooth)",
          }}
        />
      </div>

      <div
        className="absolute right-[-8%] top-[22%] h-[60vmax] w-[60vmax] will-change-transform"
        style={{
          // Pulls the opposite way, and less far, so the two never track together.
          transform:
            "translate3d(calc(var(--blob-x) * -30px), calc(var(--blob-y) * -30px), 0)",
          transition: "transform 1.6s var(--ease-smooth)",
        }}
      >
        <div
          className="h-full w-full animate-blob-b will-change-transform"
          style={{
            backgroundColor: rgba(accent.b, 0.12),
            maskImage: MASK,
            WebkitMaskImage: MASK,
            filter: "blur(10px)",
            transition: "background-color 900ms var(--ease-smooth)",
          }}
        />
      </div>
    </div>
  );
}
