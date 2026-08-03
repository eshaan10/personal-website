/**
 * ⚠️ ALL COPY BELOW IS PLACEHOLDER except the two load-bearing facts already
 * established in lib/ (the CLA internship, MarketEdge in progress). Anything
 * phrased as a personal interest or intention is my invention — rewrite it in
 * your own words.
 *
 * `NOW_UPDATED` must be changed by hand. A "right now" blurb showing a stale
 * date is worse than none: it advertises abandonment.
 */

export const NOW_UPDATED = "July 2026";

export const NOW_SECTIONS: { title: string; items: string[] }[] = [
  {
    title: "Working on",
    items: [
      "Interning at CliftonLarsonAllen on the digital team, building machine learning and data science tooling.",
      "Actively building this site — currently the shader background and the recruiter-mode document system.",
      "MarketEdge — extending the calibration scoring so the engine's own accuracy is measurable over a longer window, not just per-event.",
      "Getting ReturnTrack from a shipped web app to an app store release.",
    ],
  },
  {
    title: "Learning",
    items: [
      "Data pipeline orchestration in earnest — retries, backfills, and what it takes for a scheduled job to fail loudly instead of silently.",
      "Practical evaluation for LLM-backed features: how to tell whether an extraction step actually got better or just changed.",
    ],
  },
];
