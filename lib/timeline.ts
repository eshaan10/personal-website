export type TimelineKind = "work" | "project" | "education";

export type TimelineEntry = {
  id: string;
  date: string;
  /** Renders the date with a dashed underline — still needs confirming. */
  datePlaceholder?: boolean;
  kind: TimelineKind;
  title: string;
  org: string;
  description: string;
  /**
   * The single anchor node that gets the breathing glow. Several entries are
   * ongoing ("— Present"), but only one carries the flag: more than one
   * pulsing dot reads as a rendering bug rather than emphasis.
   */
  present?: boolean;
};

export const KIND_LABEL: Record<TimelineKind, string> = {
  work: "Work",
  project: "Project",
  education: "Education",
};

/**
 * Newest first — the spine reads top-down from present into the past.
 * Roles and dates transcribed from resume.pdf.
 */
export const TIMELINE: TimelineEntry[] = [
  {
    id: "returntrack",
    date: "July 2026",
    kind: "project",
    title: "ReturnTrack",
    org: "Never miss a return window again",
    description:
      "Receipt-tracking app using Claude's vision API to extract line items and compute return and warranty deadlines against a self-researched policy database covering 70+ policies across 50 retailers.",
  },
  {
    id: "cla",
    date: "June 2026 — Present",
    kind: "work",
    title: "Data and Automation Intern",
    org: "CliftonLarsonAllen",
    description:
      "Building approval workflows, prompt-versioning tooling, and connectors for an internal AI platform that turns client meeting transcripts into structured automation opportunities.",
    present: true,
  },
  {
    id: "marketedge",
    date: "June 2026 — Present",
    kind: "project",
    title: "MarketEdge",
    org: "In progress",
    description:
      "A prediction-market divergence engine — surfaces pricing gaps across markets for the same underlying event, and grades its own calibration over time.",
  },
  {
    id: "scout",
    date: "March 2026 — Present",
    kind: "project",
    title: "Scout",
    org: "Full-stack multi-sport recruiting platform",
    description:
      "AI resume generation, coach outreach, and vector-based college matching, plus a browser-based highlight compiler built on FFmpeg.wasm.",
  },
  {
    id: "sprout",
    date: "January 2026",
    kind: "project",
    title: "Sprout",
    org: "Daily learning tracker",
    description:
      "A calm, minimal daily-learning tracker — log one thing you learned each day, graded by the Anthropic API.",
  },
  {
    id: "emergence",
    date: "July 2025 — Sep 2025",
    kind: "work",
    title: "Machine Learning Intern",
    org: "Emergence AI",
    description:
      "Built and deployed a standalone compliance MCP server to Emergence's CRAFT platform, decoupling the agent from platform infrastructure and standardizing MCP development.",
  },
  {
    id: "shift",
    date: "July 2024 — Sep 2024",
    kind: "work",
    title: "Data Science Intern",
    org: "Shift Technology",
    description:
      "Structured medical codes out of healthcare PDFs and refined LangChain pipelines for CPT↔ICD-10 relevance mapping, strengthening LLM evaluation datasets.",
  },
  {
    id: "scienaptic",
    date: "June 2023 — July 2023",
    kind: "work",
    title: "Data Science Intern",
    org: "Scienaptic AI",
    description:
      "Engineered economic and demographic features for credit risk models across 3000+ counties, improving underwriting accuracy and interpretability.",
  },
  {
    id: "uci",
    date: "Expected June 2027",
    kind: "education",
    title: "B.S. Computer Science (Intelligent Systems)",
    org: "UC Irvine — Minor: Innovation & Entrepreneurship",
    description:
      "Coursework across machine learning and AI, computer vision, information retrieval, algorithms, and system design.",
  },
];

/** Home page shows only the leading slice; /about shows the full spine. */
export const COMPACT_TIMELINE_COUNT = 3;
