import Link from "next/link";
import GlassPanel from "./GlassPanel";
import PhraseRotator from "./PhraseRotator";
import { NAV_SENTINEL_ID } from "@/lib/nav";

/**
 * Module scope, not inline: a fresh array each render would restart the
 * rotator's effect on every parent re-render.
 */
const HEADLINE_PHRASES = [
  "actually works.",
  "checks its own work.",
  "knows when it's guessing.",
  "grades itself.",
  "progressively improves.",
  "holds up under real conditions.",
  "knows its own limits.",
];

const NAME = "Eshaan Punalekar";

export default function Hero() {
  return (
    // Centered — hero only. Stack, Projects, and Timeline stay left-aligned.
    <section className="relative mx-auto flex min-h-[88svh] w-full max-w-5xl flex-col items-center justify-center px-6 py-24 text-center md:px-10">
      <p
        className="label-mono animate-rise-in"
        style={{ animationDelay: "60ms" }}
      >
        {NAME} — Irvine, CA
      </p>

      <h1
        className="animate-rise-in mt-6 max-w-4xl text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-text-primary sm:text-5xl md:text-6xl"
        style={{ animationDelay: "140ms" }}
      >
        I build software that
        <PhraseRotator
          phrases={HEADLINE_PHRASES}
          className="text-text-secondary"
        />
      </h1>

      <p
        className="animate-rise-in mt-6 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg"
        style={{ animationDelay: "240ms" }}
      >
        Computer Science @ UC Irvine, focused on Intelligent Systems, with a
        minor in Innovation &amp; Entrepreneurship. I like building things that
        solve niche problems.
      </p>

      <div
        className="animate-rise-in mt-10 flex flex-wrap items-center justify-center gap-3"
        style={{ animationDelay: "340ms" }}
      >
        <Link
          href="/projects"
          className="ease-smooth rounded-[10px] bg-text-primary px-5 py-3 text-sm font-medium text-ink-900 transition-[transform,opacity] duration-300 hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/40"
        >
          View Projects
        </Link>

        <GlassPanel
          as={Link}
          href="/resume"
          tone="raised"
          radius="sm"
          className="ease-smooth px-5 py-3 text-sm font-medium text-text-primary transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-white/[0.1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/40"
        >
          View Resume
        </GlassPanel>
      </div>

      {/* Marks the hero's bottom edge — Nav observes this to decide when to frost. */}
      <div
        id={NAV_SENTINEL_ID}
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-full"
      />
    </section>
  );
}
