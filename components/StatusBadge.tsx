import type { Project } from "@/lib/projects";

const toneDot: Record<Project["tone"], string> = {
  shipped: "bg-[rgba(240,240,245,0.9)]",
  "in-progress": "bg-[rgba(180,180,190,0.65)]",
};

/**
 * Renders `statusLabel` verbatim — these strings carry real caveats
 * ("not yet available to end users"), so they must not be abbreviated
 * down to a one-word badge.
 */
export default function StatusBadge({
  project,
  className = "",
}: {
  project: Project;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-start gap-2 font-mono text-[10px] uppercase leading-relaxed tracking-label text-text-secondary ${className}`}
    >
      <span
        aria-hidden
        className={`mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full ${toneDot[project.tone]}`}
      />
      {project.statusLabel}
    </span>
  );
}
