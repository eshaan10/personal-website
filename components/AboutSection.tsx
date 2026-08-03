import Link from "next/link";
import GlassPanel from "./GlassPanel";
import Timeline from "./Timeline";
import { SECTION_IDS } from "@/lib/nav";
import { NOW_SECTIONS, NOW_UPDATED } from "@/lib/now";
import { COMPACT_TIMELINE_COUNT, TIMELINE } from "@/lib/timeline";

/**
 * Compact About: the "right now" blurb (formerly /now) plus the leading slice
 * of the timeline, with a link out to the full journey. The complete timeline
 * and long-form about live at /journey.
 */
export default function AboutSection() {
  return (
    <section
      id={SECTION_IDS.about}
      className="mx-auto w-full max-w-5xl scroll-mt-28 px-6 pb-32 md:px-10"
    >
      <p className="label-mono">
        <span className="text-text-primary">01</span>
        <span className="mx-2 text-text-muted">//</span>
        <span>about</span>
      </p>

      <h2 className="mt-6 max-w-3xl text-3xl font-semibold leading-[1.08] tracking-[-0.02em] text-text-primary md:text-5xl">
        Right now.
      </h2>

      <p className="mt-6 max-w-xl leading-relaxed text-text-secondary">
        A snapshot of where my attention is, rather than everything I&apos;ve
        done. Updated <span className="text-text-primary">{NOW_UPDATED}</span>.
      </p>

      {/* No panels — matches the Stack section's treatment and the same
          block on /journey. */}
      <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-0">
        {NOW_SECTIONS.map((section, index) => (
          <div
            key={section.title}
            className={
              index === 0
                ? "md:pr-12"
                : "md:border-l md:border-glass-border-soft md:pl-12"
            }
          >
            <h3 className="label-mono">{section.title}</h3>
            <ul className="mt-6 space-y-4">
              {section.items.map((item) => (
                <li
                  key={item.slice(0, 40)}
                  className="relative max-w-md pl-5 text-sm leading-relaxed text-text-secondary before:absolute before:left-0 before:top-[9px] before:h-1 before:w-1 before:rounded-full before:bg-text-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-20">
        <p className="label-mono">Recently</p>
        <Timeline
          entries={TIMELINE.slice(0, COMPACT_TIMELINE_COUNT)}
          className="mt-10"
        />
      </div>

      <Link
        href="/journey"
        className="ease-smooth mt-14 inline-flex rounded-[10px] border border-glass-border px-5 py-3 font-mono text-[11px] uppercase tracking-label text-text-primary transition-colors duration-300 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
      >
        See full journey →
      </Link>
    </section>
  );
}
