/**
 * Identity, contact, and resume content.
 *
 * Everything in this file is now transcribed from resume.pdf — no invented
 * skills, coursework, employment, or awards remain. The earlier guessed
 * LinkedIn URL and the inferred coursework list have both been replaced.
 *
 * ⚠️ ONE CONFLICT TO RESOLVE: you previously gave me the CLA title as
 * "Digital / Data and Automation Intern, ML & Data Science". The resume says
 * "Data and Automation Intern" at "CliftonLarsonAllen". You told me the
 * resume is ground truth, so the resume wins here and site-wide. Say the word
 * if the longer title is the correct one.
 */

export const PROFILE = {
  name: "Eshaan Punalekar",
  email: "eshaan.punalekar@gmail.com",
  github: "https://github.com/eshaan10",
  githubHandle: "eshaan10",
  linkedin: "https://www.linkedin.com/in/eshaan-punalekar/",
  linkedinHandle: "linkedin.com/in/eshaan-punalekar",
  location: "Irvine, CA",
  headline:
    "B.S. Computer Science (Intelligent Systems) at UC Irvine. Applied ML, data engineering, and full-stack products shipped end to end.",
};

export type ResumeRole = {
  org: string;
  title: string;
  location: string;
  date: string;
  bullets: string[];
  /**
   * Long-form narrative for the Journey page. Résumé, recruiter-doc, and
   * print contexts keep using `bullets` — prose of this length would swamp
   * the entries around it and break the one-page print target.
   */
  story?: string[];
};

export const EDUCATION = {
  org: "University of California, Irvine",
  title: "B.S. Computer Science (Spec. Intelligent Systems)",
  location: "Irvine, CA",
  date: "Expected June 2027",
  bullets: ["Minor: Innovation and Entrepreneurship."],
};

export const WORK_EXPERIENCE: ResumeRole[] = [
  {
    org: "CliftonLarsonAllen",
    title: "Data and Automation Intern",
    location: "Irvine, CA",
    date: "June 2026 — Present",
    bullets: [
      "Built human-review approval workflows, in-app preview cards, an admin page for prompt versioning, and a PowerPoint connector for an internal AI platform that converts client meeting transcripts into structured automation opportunities and solutions.",
      "Produced Risk, Value, and Change executive summaries from client discovery calls, supporting enterprise AI adoption assessments.",
      "Currently integrating Sage Intacct's MCP server to connect ERP financial data into agentic AI workflows for client engagements.",
    ],
  },
  {
    org: "Emergence AI",
    title: "Machine Learning Intern",
    location: "Irvine, CA",
    date: "July 2025 — Sep 2025",
    bullets: [
      "Built a standalone compliance MCP server, decoupling the agent from platform infrastructure and standardizing MCP development.",
      "Deployed the MCP server to Emergence's CRAFT platform, a natural-language interface for enterprise agent workflows.",
      "Implemented API auth, health and logs endpoints, and Dockerized configs to unify local, staging, and production deployments.",
      "Standardized Markdown rendering pipelines, improving reliability and reducing latency across multiple connector agents.",
    ],
  },
  {
    org: "Shift Technology",
    title: "Data Science Intern",
    location: "Boston, MA",
    date: "July 2024 — Sep 2024",
    bullets: [
      "Extracted and structured medical codes from healthcare PDFs to build a unified dataset for downstream AI workflows.",
      "Refined LangChain prompt pipelines for CPT↔ICD-10 relevance mapping, improving output consistency and accuracy.",
      "Labeled and validated hundreds of healthcare documents in Label Studio to strengthen LLM evaluation datasets.",
      "Delivered code-usage insights informing high-impact billing group selection and claims-evaluation model improvements.",
    ],
  },
  {
    org: "Scienaptic AI",
    title: "Data Science Intern",
    location: "New York, NY",
    date: "June 2023 — July 2023",
    bullets: [
      "Refined demographic datasets with Pandas, improving data quality for credit risk modeling pipelines across 3000+ counties.",
      "Engineered economic and demographic features that enhanced underwriting accuracy and model interpretability.",
      "Analyzed county risk patterns and delivered actionable insights, informing lending probability and credit modeling decisions.",
      "Built reproducible analysis workflows that stabilized risk models and streamlined future data updates.",
    ],
  },
];

/**
 * Resume-page project bullets, transcribed from the PDF.
 *
 * Kept here rather than in lib/projects.ts so the case study copy in that
 * file stays untouched — you're revising it separately.
 *
 * Note: MarketEdge does not appear on resume.pdf. It's included because it's
 * live work, using its existing site description. Remove it if the resume
 * omission was deliberate.
 */
export const RESUME_PROJECTS: {
  name: string;
  stack: string;
  date: string;
  bullets: string[];
  onResume: boolean;
}[] = [
  {
    // ⚠️ resume.pdf calls this "ReturnGuard". Renamed site-wide at your
    // request — the PDF itself still needs updating to match.
    name: "ReturnTrack",
    stack: "Next.js, TypeScript, PostgreSQL, Prisma, Anthropic API, Clerk",
    date: "July 2026",
    onResume: true,
    bullets: [
      "Full-stack receipt-tracking app using Claude's vision API to extract items and compute return and warranty deadlines against a self-researched policy database covering 70+ policies across 50 retailers.",
      "Implemented multi-user auth, automated email reminders via cron jobs, and unit-tested deadline logic; deployed on Vercel.",
    ],
  },
  {
    name: "Scout",
    stack: "Next.js, TypeScript, FastAPI, PostgreSQL, Clerk, Anthropic API",
    date: "March 2026 — Present",
    onResume: true,
    bullets: [
      "Full-stack multi-sport recruiting platform with AI resume generation, coach outreach emails, and vector-based college matching.",
      "Engineered a browser-based highlight video compiler with FFmpeg.wasm for client-side stitching and Google Drive MCP export.",
    ],
  },
  {
    // Not on resume.pdf either — added because it's shipped work.
    name: "Sprout",
    stack: "Next.js, Tailwind, Anthropic API",
    date: "January 2026",
    onResume: false,
    bullets: [
      "A calm, minimal daily-learning tracker: log one thing you learned each day, graded via the Anthropic API.",
    ],
  },
  {
    name: "MarketEdge",
    stack: "Python, FastAPI, PostgreSQL, Prefect, httpx, Docker",
    date: "June 2026 — Present",
    onResume: false,
    bullets: [
      "An independent auditor comparing Kalshi prediction-market pricing against traditional sportsbook odds, detecting divergences and grading its own calibration accuracy over time.",
    ],
  },
];

export const LEADERSHIP: ResumeRole[] = [
  {
    org: "Kappa Sigma Fraternity",
    title: "VP of Finance",
    location: "Irvine, CA",
    date: "Jan 2024 — Jan 2025",
    bullets: [
      "Managed a $50,000+ budget for 50+ members; prepared financial models and reports for chapter leadership.",
      "Raised $7,000 for a Military Heroes philanthropy campaign and planned chapter events, negotiating venue and vendor contracts.",
    ],
    // Your draft, kept verbatim — every figure checks out against the résumé
    // bullets above ($50,000+, 50+ members, $7,000, Military Heroes).
    story: [
      "I served as VP of Finance for Kappa Sigma Fraternity from January 2024 to January 2025, managing a $50,000+ budget on behalf of more than 50 members. I prepared financial models and reports for chapter leadership, which meant translating what the chapter could actually afford into decisions the rest of the executive board could act on.",
      "One of the initiatives I'm proudest of was a philanthropy campaign for Military Heroes, where I helped raise $7,000. Alongside that, I planned chapter events end-to-end — negotiating venue and vendor contracts, which taught me a lot about managing budgets against real-world constraints rather than just a spreadsheet.",
    ],
  },
];

/** Grouped for readability; every item is from the resume's Skills line. */
export const SKILLS: { group: string; items: string[] }[] = [
  {
    group: "Languages",
    items: ["Python", "C++", "SQL", "JavaScript", "TypeScript"],
  },
  {
    group: "ML & data",
    items: ["PyTorch", "sklearn", "LangChain", "Pandas", "OpenCV", "SciPy"],
  },
  {
    group: "Platforms & MLOps",
    items: ["MLOps", "Azure Foundry", "Databricks", "Docker", "Postman"],
  },
  {
    group: "Automation",
    items: ["Power Apps", "Power Automate"],
  },
];

export const COURSEWORK: string[] = [
  "Machine Learning & Data Mining",
  "Artificial Intelligence",
  "Applied Probability for CS",
  "Computer Vision",
  "AI in Biomedicine",
  "Design & Analysis of Algorithms",
  "Information Retrieval",
  "Data Management",
  "System Design",
];

export type Involvement = {
  name: string;
  role: string;
  date: string;
  /**
   * One line for résumé and recruiter-doc contexts, where the full narrative
   * would swamp entries around it.
   */
  summary: string;
  /** Long-form narrative — Journey page only. */
  story: string[];
};

export const INVOLVEMENTS: Involvement[] = [
  {
    name: "Gram Oorja",
    role: "Community service — rural sustainable energy nonprofit",
    date: "2022 — 2024",
    summary:
      "Helped organize and oversee a solar microgrid installation for a village of ~200 people, bringing running water and electricity to 40+ households.",
    // Your words, verbatim — only split into paragraphs for readability.
    story: [
      "I grew up in India, and given the country's demographics I participated in a great deal of community service and charity work. From 2022 to 2024, I worked with a nonprofit called Gram Oorja, which focuses on bringing sustainable energy solutions to rural communities.",
      "I helped organize and oversee a project that installed a solar microgrid in a village of about 200 people, providing running water and electricity to more than 40 households. Being on the ground and working directly with families showed me how transformative the right technology can be, especially in communities that have historically been overlooked.",
      "Toward the end of the project, I even began using early versions of ChatGPT to organize tasks and coordinate communication — and that small introduction showed me how AI could support real-world development work.",
    ],
  },
];

export const AWARDS: string[] = [
  "Dean's Honor List, 2024–2026",
  "Senior Class Valedictorian",
  "CIF Scholastic Championship",
  "President's List",
];
