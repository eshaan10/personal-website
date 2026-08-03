"use client";

import { useEffect, useRef, useState } from "react";

const HOLD_MS = 1800;

/**
 * Vertical overshoot of the clipping window, in em.
 *
 * The reserved box is exactly `line-height` tall, but Inter's ink extends
 * past that — ascenders above, descenders below. Clipping at the box edge
 * would shave the tops of caps and the tails of "g"/"p"/"y", and every phrase
 * here has at least one. The window is pushed out by this much at top and
 * bottom so the clip lands in empty space instead.
 */
const CLIP_BLEED = "0.18em";

/**
 * Rotating phrase with an odometer-style flip transition: the outgoing phrase
 * hinges up and away while the incoming one rises into place from below.
 *
 * Layout: every phrase is stacked in one CSS grid cell, all `invisible`.
 * The cell sizes to the tallest/widest phrase at any viewport width, so
 * nothing below the headline moves when the text changes length — including
 * when a long phrase wraps to two lines and a short one doesn't.
 *
 * The moving copies are absolutely positioned, so they are out of flow and
 * cannot influence that box no matter what they're doing mid-flight.
 *
 * Under `prefers-reduced-motion` the loop never starts and the first phrase
 * stands still — the requirement is no animation, not a gentler one.
 */
export default function PhraseRotator({
  phrases,
  className = "",
}: {
  phrases: string[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  // null until the first transition, so the initial paint is static and
  // doesn't collide with the hero's own entrance animation.
  const [previous, setPrevious] = useState<number | null>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (phrases.length < 2) return;

    let frame = 0;
    let last = performance.now();

    // rAF rather than setInterval: the cycle then pauses with the tab instead
    // of queueing up transitions in a background window.
    const tick = (now: number) => {
      if (now - last >= HOLD_MS) {
        last = now;
        const current = indexRef.current;
        const next = (current + 1) % phrases.length;
        indexRef.current = next;
        setPrevious(current);
        setIndex(next);
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phrases]);

  const layer = `absolute inset-x-0 ${className}`;
  const layerStyle = { top: CLIP_BLEED };

  return (
    <span className="relative grid">
      {/* Invisible sizers — these alone define the box. */}
      {phrases.map((phrase) => (
        <span
          key={phrase}
          aria-hidden
          className={`invisible col-start-1 row-start-1 ${className}`}
        >
          {phrase}
        </span>
      ))}

      {/* Clipping window, inset outward past the text box so the flip is
          hidden at its edges without cropping ascenders or descenders. */}
      <span
        aria-hidden
        className="pointer-events-none absolute overflow-hidden [perspective:700px]"
        style={{
          top: `-${CLIP_BLEED}`,
          bottom: `-${CLIP_BLEED}`,
          left: 0,
          right: 0,
        }}
      >
        {previous !== null && (
          <span
            key={`out-${previous}`}
            className={`${layer} animate-flip-out-up [transform-origin:50%_100%]`}
            style={layerStyle}
          >
            {phrases[previous]}
          </span>
        )}

        <span
          key={`in-${index}`}
          className={`${layer} ${
            previous === null ? "" : "animate-flip-in-up"
          } [transform-origin:50%_0%]`}
          style={layerStyle}
        >
          {phrases[index]}
        </span>
      </span>

      {/* Absolutely positioned, so it stays out of grid sizing. Carries the
          real phrase for screen readers, which never see the animated copies. */}
      <span className="sr-only">{phrases[index]}</span>
    </span>
  );
}
