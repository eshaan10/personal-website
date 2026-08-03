"use client";

import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  to: number;
  /** Milliseconds for the full run. */
  duration?: number;
  suffix?: string;
  className?: string;
};

/** Matches the `ease-entrance` token so the number settles like everything else. */
const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

/**
 * Counts up once, when scrolled into view. Renders the final value as the
 * initial state under reduced motion — and the `to` value is always present
 * in the DOM for screen readers via aria-label, since a mid-animation
 * number read aloud is meaningless.
 */
export default function CountUp({
  to,
  duration = 1600,
  suffix = "",
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }

    let frame = 0;
    let start: number | null = null;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(Math.round(easeOutQuint(progress) * to));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className={className} aria-label={`${to}${suffix}`}>
      <span aria-hidden>
        {value}
        {suffix}
      </span>
    </span>
  );
}
