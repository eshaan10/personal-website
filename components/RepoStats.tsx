import { relativeTime, type RepoStats } from "@/lib/github";

/**
 * Live stats strip for a project card.
 *
 * Star and issue counts are omitted when zero rather than rendered as "0" —
 * an explicit zero reads as a negative signal on a personal project, whereas
 * its absence reads as "not relevant here".
 */
export default function RepoStatsStrip({ stats }: { stats: RepoStats }) {
  const parts: string[] = [];

  if (stats.language) parts.push(stats.language);
  if (stats.lastCommit) parts.push(relativeTime(stats.lastCommit));
  if (stats.stars > 0) parts.push(`★ ${stats.stars}`);
  if (stats.openIssues > 0) parts.push(`${stats.openIssues} open`);

  if (parts.length === 0) return null;

  return (
    <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-label text-text-muted">
      {parts.map((part, index) => (
        <li key={part} className="flex items-center gap-3">
          {index > 0 && (
            <span aria-hidden className="opacity-40">
              ·
            </span>
          )}
          {part}
        </li>
      ))}
    </ul>
  );
}
