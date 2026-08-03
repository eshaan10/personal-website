"use client";

import { useRef, type ReactNode } from "react";
import { useRecruiterMode } from "./AppProviders";

type TiltCardProps = {
  children: ReactNode;
  /** Max rotation in degrees at the card's corners. */
  max?: number;
  className?: string;
};

/**
 * 3D cursor-tilt wrapper.
 *
 * Rotation is written to CSS custom properties on the element rather than
 * held in state — this fires on every pointer move, and re-rendering the
 * card's whole subtree at that rate would be wasteful.
 *
 * Skipped entirely for coarse pointers (there is no hover on touch, and the
 * card would just sit tilted after a tap) and under reduced motion.
 */
export default function TiltCard({
  children,
  max = 7,
  className = "",
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { recruiterMode } = useRecruiterMode();

  const enabled = () =>
    !recruiterMode &&
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node || !enabled()) return;

    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    node.style.setProperty("--tilt-x", `${(-y * max).toFixed(2)}deg`);
    node.style.setProperty("--tilt-y", `${(x * max).toFixed(2)}deg`);
    // Feeds the glare highlight so the sheen tracks the cursor.
    node.style.setProperty("--tilt-px", `${((x + 0.5) * 100).toFixed(1)}%`);
    node.style.setProperty("--tilt-py", `${((y + 0.5) * 100).toFixed(1)}%`);
  };

  const handleLeave = () => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--tilt-x", "0deg");
    node.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <div className={`[perspective:1100px] ${className}`}>
      <div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        className="ease-smooth h-full transition-transform duration-300 [transform-style:preserve-3d] [transform:rotateX(var(--tilt-x,0deg))_rotateY(var(--tilt-y,0deg))]"
      >
        {children}
      </div>
    </div>
  );
}
