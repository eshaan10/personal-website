/**
 * `weight` drives type size, font weight, and colour intensity in the tag
 * cloud: 3 = lead with it, 2 = solid working knowledge, 1 = supporting.
 *
 * ML / AI and Cloud / Tools weights are yours — you named the primaries
 * directly. Languages and Web / Full-stack weights are still MY GUESSES,
 * drawn from how often each appears across your projects and resume; worth
 * a pass, since they drive how the section reads.
 */

export type StackItem = { name: string; weight: 1 | 2 | 3 };

export type StackCategory = {
  id: string;
  label: string;
  items: StackItem[];
};

export const STACK: StackCategory[] = [
  {
    id: "languages",
    label: "Languages",
    items: [
      { name: "Python", weight: 3 },
      { name: "TypeScript", weight: 3 },
      { name: "SQL", weight: 3 },
      { name: "JavaScript", weight: 3 },
      { name: "C++", weight: 2 },
      { name: "Java", weight: 2 },
      { name: "HTML", weight: 2 },
      { name: "CSS", weight: 2 },
      { name: "Swift", weight: 1 },
    ],
  },
  {
    id: "web",
    label: "Web / Full-stack",
    items: [
      { name: "Next.js", weight: 3 },
      { name: "FastAPI", weight: 3 },
      { name: "PostgreSQL", weight: 3 },
      { name: "Tailwind", weight: 3 },
      { name: "Prisma", weight: 2 },
      { name: "Clerk", weight: 2 },
    ],
  },
  {
    // Primary four lead; everything else drops to the smallest tier so the
    // four actually read as primary rather than as "slightly bigger".
    id: "ml",
    label: "ML / AI",
    items: [
      { name: "MCP", weight: 3 },
      { name: "PyTorch", weight: 3 },
      { name: "LangChain", weight: 3 },
      { name: "Azure OpenAI", weight: 3 },
      { name: "Anthropic API", weight: 1 },
      { name: "Pandas", weight: 1 },
      { name: "Prompt engineering", weight: 1 },
      { name: "API integration", weight: 1 },
      { name: "scikit-learn", weight: 1 },
      { name: "Computer vision", weight: 1 },
      { name: "AI model training", weight: 1 },
      { name: "OpenCV", weight: 1 },
      { name: "Data labeling", weight: 1 },
    ],
  },
  {
    id: "cloud",
    label: "Cloud / Tools",
    items: [
      { name: "Databricks", weight: 3 },
      { name: "Postman", weight: 3 },
      { name: "Docker", weight: 1 },
      { name: "Git", weight: 1 },
      { name: "Azure Foundry", weight: 1 },
      { name: "Power Apps", weight: 1 },
      { name: "Power Automate", weight: 1 },
    ],
  },
];

/** Flat list, heaviest first — used by the resume's skills block. */
export const STACK_FLAT = STACK.flatMap((category) => category.items);
