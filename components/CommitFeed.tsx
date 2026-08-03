import GlassPanel from "./GlassPanel";
import { relativeTime, type CommitEntry } from "@/lib/github";

/**
 * Recent commits across every tracked repo, merged chronologically.
 *
 * `rail` is the sidebar variant: smaller type, tighter rows, message wrapping
 * to two lines instead of truncating — in a narrow column truncation would
 * cut most messages to a couple of words.
 */
export default function CommitFeed({
  commits,
  variant = "panel",
}: {
  commits: CommitEntry[];
  variant?: "panel" | "rail";
}) {
  if (commits.length === 0) return null;

  const rail = variant === "rail";

  return (
    <GlassPanel radius="lg" className={rail ? "p-5" : "p-6 md:p-7"}>
      <p className="label-mono">Recent activity</p>

      <ul
        className={`divide-y divide-glass-border-soft ${rail ? "mt-4" : "mt-6"}`}
      >
        {commits.map((commit) => (
          <li
            key={commit.sha}
            className={`first:pt-0 last:pb-0 ${rail ? "py-2.5" : "py-3"}`}
          >
            <a
              href={commit.url}
              target="_blank"
              rel="noreferrer noopener"
              className={`ease-smooth group block transition-opacity duration-300 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current ${
                rail
                  ? ""
                  : "flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1"
              }`}
            >
              {rail ? (
                <>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-mono text-[9px] uppercase tracking-label text-text-muted">
                      {commit.repo}
                    </span>
                    <span className="shrink-0 font-mono text-[9px] uppercase tracking-label text-text-muted">
                      {relativeTime(commit.date)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-text-secondary group-hover:text-text-primary">
                    {commit.message}
                  </p>
                </>
              ) : (
                <>
                  <span className="flex min-w-0 flex-1 items-baseline gap-3">
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-label text-text-muted">
                      {commit.repo}
                    </span>
                    <span className="truncate text-sm text-text-secondary group-hover:text-text-primary">
                      {commit.message}
                    </span>
                  </span>

                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-label text-text-muted">
                    {relativeTime(commit.date)}
                  </span>
                </>
              )}
            </a>
          </li>
        ))}
      </ul>
    </GlassPanel>
  );
}
