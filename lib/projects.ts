/**
 * ⚠️ WHAT IS VERIFIED VS. WHAT IS DRAFT
 *
 * Verified (from you, or from the GitHub API):
 *   - name, tagline, statusLabel, tech, repo
 *   - MarketEdge's `description` is your wording, near-verbatim
 *
 * DRAFT — written by me, plausible but unconfirmed:
 *   - every `caseStudy` field (problem / approach / architecture)
 *
 * The architecture notes are reasoned backwards from the stacks you gave me
 * (e.g. Prefect in MarketEdge's stack implies scheduled orchestration). That
 * is inference, not knowledge. Read each one before this goes public.
 */

export type ProjectTone = "shipped" | "in-progress";

export type ArchitectureNote = { title: string; body: string };

/**
 * Ambient glow accent, applied to the global background on case study pages.
 * RGB 0–255. Two stops so the two blobs stay distinguishable.
 */
export type Accent = { a: [number, number, number]; b: [number, number, number] };

export const MONOCHROME_ACCENT: Accent = {
  a: [220, 220, 225],
  b: [180, 180, 190],
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  /** Full status text, shown verbatim. */
  statusLabel: string;
  /** Drives the badge dot only. */
  tone: ProjectTone;
  tech: string[];
  repo: string;
  /** Deployed URL, where one exists. */
  liveUrl?: string;
  accent: Accent;
  featured?: boolean;
  caseStudy: {
    problem: string[];
    approach: string[];
    architecture: ArchitectureNote[];
    /**
     * Confirmed, shipped features. Where this is present the case study
     * leads with it instead of with inferred architecture.
     */
    features?: string[];
  };
};

export const PROJECTS: Project[] = [
  {
    slug: "scout",
    name: "Scout",
    tagline: "Full-stack multi-sport recruiting platform",
    description:
      "Connects athletes with college programs. Began as a soccer-only recruiting tool and expanded into a multi-sport platform.",
    statusLabel: "Shipped — not yet available to end users",
    tone: "shipped",
    tech: [
      "Next.js",
      "TypeScript",
      "FastAPI",
      "PostgreSQL",
      "Clerk",
      "Anthropic API",
    ],
    repo: "https://github.com/eshaan10/scout-recruiting",
    // Neon terminal green.
    accent: { a: [70, 240, 130], b: [30, 185, 95] },
    featured: true,
    caseStudy: {
      problem: [
        "College recruiting runs on access. Athletes with the right club, the right camp, or the right family connections get seen; comparable athletes without those things do not. The filtering happens long before anyone evaluates a highlight reel.",
        "The tooling reinforces it. Recruiting services are priced for families who can absorb the cost, and the free alternative is a spreadsheet of coach emails and a cold outreach campaign that mostly goes unanswered.",
        "Scout started as a soccer-specific answer to that and grew into a multi-sport platform once the same structure turned out to hold across sports.",
      ],
      approach: [
        "The core bet is that a structured, comparable athlete profile beats an unstructured highlight reel for discovery. If every athlete's data lives in the same shape, programs can filter, and athletes stop competing on production value.",
        "Expanding from soccer to multi-sport meant separating what is universal — identity, academics, eligibility, contact — from what is sport-specific, so a new sport is a configuration change rather than a fork.",
      ],
      architecture: [
        {
          title: "Next.js front end, FastAPI service layer",
          body: "TypeScript throughout the client with a separate Python API, which keeps the data and model-facing work in the ecosystem that suits it rather than forcing everything into one runtime.",
        },
        {
          title: "PostgreSQL as the profile store",
          body: "Relational fits the domain: athletes, programs, sports, and the many-to-many interest between them are all joins, and recruiting filters are exactly the queries a relational engine is good at.",
        },
        {
          title: "Clerk for identity",
          body: "Athletes, coaches, and programs are distinct roles with different permissions. Delegating auth avoids hand-rolling session and role handling on a platform holding minors' data.",
        },
        {
          title: "Anthropic API",
          body: "Used in the matching and profile layer — turning unstructured athlete and program information into the comparable structure the rest of the platform depends on.",
        },
      ],
    },
  },
  {
    slug: "marketedge",
    name: "MarketEdge",
    tagline: "Prediction-market divergence engine",
    description:
      "An independent auditor comparing Kalshi prediction-market pricing against traditional sportsbook odds, detecting divergences and grading its own calibration over time.",
    statusLabel: "In progress",
    tone: "in-progress",
    tech: ["Python", "FastAPI", "PostgreSQL", "Prefect", "httpx", "Docker"],
    repo: "https://github.com/eshaan10/MarketEdge",
    accent: { a: [90, 145, 230], b: [60, 105, 195] },
    featured: true,
    caseStudy: {
      problem: [
        "Kalshi and traditional sportsbooks price the same real-world events through completely different mechanisms. Kalshi is an exchange where traders set the price; a sportsbook sets a line and manages its own exposure. When those two prices disagree, the disagreement is information.",
        "Nearly every tool in this space is built to tell you what to bet. That framing is convenient, because a tool that only makes claims never has to be right — no prediction is ever checked against what actually happened.",
      ],
      approach: [
        "MarketEdge is deliberately not a pick-winners bot. It is an independent auditor: it observes both sides, reports where they diverge, and then holds itself accountable for whether its own confidence was justified.",
        "The honesty-first part is the calibration grading. When the engine says an event is 70% likely, roughly 70% of those calls should come in. Tracking that over time turns the tool from something that makes assertions into something with a measurable track record — including a measurably bad one, if that is what the data shows.",
        "This inverts the usual incentive. Most systems are optimized to look confident; this one is optimized to be checkable.",
      ],
      architecture: [
        {
          title: "Prefect for scheduled collection",
          body: "Odds and market prices are only meaningful as a time series, so ingestion has to run on a reliable schedule with retries and visible failures. A cron job that silently dies leaves gaps that corrupt every downstream calibration number.",
        },
        {
          title: "httpx against two very different sources",
          body: "An exchange API and sportsbook odds have different shapes, rate limits, and failure modes. Both get normalized into one internal representation before anything is compared.",
        },
        {
          title: "PostgreSQL as an append-only history",
          body: "Calibration scoring depends on knowing what was believed at the time, not just the current state. Prices are appended rather than overwritten, so past claims stay auditable after the outcome is known.",
        },
        {
          title: "FastAPI read layer",
          body: "Serves current divergences and historical calibration, keeping the query surface separate from the ingestion pipeline.",
        },
        {
          title: "Docker",
          body: "Pins the pipeline, scheduler, and database together so a scheduled run behaves identically in development and deployment.",
        },
      ],
    },
  },
  {
    slug: "returntrack",
    name: "ReturnTrack",
    tagline: "Never miss a return window again",
    description:
      "Photograph a receipt and Claude's vision API extracts the items, then ReturnTrack tracks every return deadline and warranty countdown before it lapses.",
    statusLabel: "Shipped as a web app — app store release pending",
    tone: "shipped",
    tech: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "Anthropic API",
      "Clerk",
    ],
    repo: "https://github.com/eshaan10/ReturnTrack",
    liveUrl: "https://return-track.vercel.app/",
    accent: { a: [240, 175, 70], b: [205, 140, 45] },
    featured: true,
    caseStudy: {
      /**
       * ⚠️ `problem` and `approach` below are framing prose written by me,
       * extrapolated from the landing page line "Never miss a return window
       * again". They make no claims about implementation.
       *
       * `features` is the confirmed, shipped feature list you supplied.
       * `architecture` is deliberately EMPTY — the previous inferred
       * architecture notes were invented and have been deleted rather than
       * rewritten. Nothing replaced them because nothing is evidenced.
       */
      problem: [
        "Return windows expire quietly. Nothing reminds you, the deadline lives in fine print on a receipt you have already thrown away, and the cost of missing it is invisible — you just quietly keep something you meant to send back.",
        "Warranties are worse, because the window is longer. By the time the thing actually breaks, the receipt is long gone and the coverage period is impossible to prove.",
      ],
      approach: [
        "The whole product hinges on capture being effortless. Photograph the receipt and the items, prices, and dates come out of it automatically — no typing, no manual entry, nothing to abandon after the first week.",
        "Everything downstream is then a countdown problem rather than a data-entry problem: what expires soonest, how much value is still protected, and what has already been resolved.",
      ],
      architecture: [],
      features: [
        "Receipt capture by photo, with AI vision extraction pulling out items automatically — or manual entry when you'd rather type it in.",
        "Dashboard stats bar showing items expiring this week, total dollar value protected, and active item count at a glance.",
        "Per-item detail: store, price, a return deadline countdown, and a separate, longer warranty countdown tracked independently.",
        "Status management across Active, Returned, and Kept — anything inactive moves into a Resolved section so the main view stays current.",
        "Search and category filtering across everything tracked.",
        "CSV export of your full item history.",
        "Dark mode toggle.",
      ],
    },
  },
  {
    slug: "sprout",
    name: "Sprout",
    tagline: "A calm, minimal daily-learning tracker",
    description:
      "Log one thing you learned each day and have it graded by the Anthropic API. Deliberately small: one entry, one prompt, no streak-shaming.",
    statusLabel: "Shipped",
    tone: "shipped",
    tech: ["Next.js", "Tailwind", "Anthropic API"],
    repo: "https://github.com/eshaan10/sprout",
    liveUrl: "https://sprout-track.vercel.app/",
    // Sage/olive, matching Sprout's own UI — warm cream ground, sage accent.
    accent: { a: [124, 144, 112], b: [150, 168, 130] },
    caseStudy: {
      /**
       * ⚠️ `problem` and `approach` are framing prose written by me from your
       * one-line description. `architecture` is EMPTY — I have no confirmed
       * implementation detail for Sprout beyond its three-item stack.
       */
      problem: [
        "Learning trackers fail the same way habit apps do: they optimise for the streak rather than the substance. Logging becomes a box to tick, and the entry degrades into a word or two written to keep a number alive.",
        "The other failure is friction. Anything that asks for tags, categories, and structured reflection at the end of a long day simply does not get opened.",
      ],
      approach: [
        "One entry a day, one question: what did you actually learn? Keeping the surface deliberately small is the feature, not a limitation of scope.",
        "Grading the entry via the Anthropic API turns it from a diary into a mirror — a vague entry reads as vague, which is a far more useful signal than an unbroken streak counter.",
        "The interface is intentionally calm: warm cream ground, sage accent, serif headings. It should feel like a notebook, not a productivity dashboard.",
      ],
      architecture: [],
    },
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter((project) => project.featured);

export function getProject(slug: string) {
  return PROJECTS.find((project) => project.slug === slug);
}
