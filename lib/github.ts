/**
 * GitHub REST integration for the projects page.
 *
 * Cached with `next.revalidate` (hourly). Unauthenticated GitHub allows 60
 * requests/hour per IP; this makes 2 per repo, so 8 total per revalidation —
 * comfortable alone, but Vercel's egress IPs are shared, so set GITHUB_TOKEN
 * to move onto the 5,000/hour authenticated ceiling if you ever see gaps.
 *
 * Every failure path returns null/empty rather than throwing. Stats are a
 * garnish; they must never take down the page or the build.
 */

const REVALIDATE_SECONDS = 3600;

export type RepoStats = {
  stars: number;
  language: string | null;
  openIssues: number;
  lastCommit: string | null;
};

export type CommitEntry = {
  sha: string;
  repo: string;
  message: string;
  url: string;
  date: string;
};

/** Pulls "owner/name" out of a github.com URL. */
export function parseRepoUrl(url: string): { owner: string; name: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/?#]+)/);
  if (!match) return null;
  return { owner: match[1], name: match[2].replace(/\.git$/, "") };
}

function headers(): HeadersInit {
  const base: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "eshaanpunalekar.com",
  };
  if (process.env.GITHUB_TOKEN) {
    base.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return base;
}

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: headers(),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) {
      console.warn(`[github] ${response.status} for ${url}`);
      return null;
    }
    return (await response.json()) as T;
  } catch (error) {
    console.warn("[github] request failed", url, error);
    return null;
  }
}

type RepoResponse = {
  stargazers_count: number;
  language: string | null;
  open_issues_count: number;
};

type CommitResponse = {
  sha: string;
  html_url: string;
  commit: { message: string; author: { date: string } | null };
};

/**
 * One round trip for every repo, returning both the per-card stats and the
 * commits that feed the activity list — the last-commit timestamp comes from
 * the commits call rather than the repo's `pushed_at`, which also moves for
 * tag and branch pushes that aren't commits.
 */
export async function getProjectActivity(
  repoUrls: { slug: string; url: string }[],
  commitLimit = 10,
): Promise<{
  stats: Record<string, RepoStats>;
  commits: CommitEntry[];
}> {
  const results = await Promise.all(
    repoUrls.map(async ({ slug, url }) => {
      const parsed = parseRepoUrl(url);
      if (!parsed) return null;

      const { owner, name } = parsed;
      const base = `https://api.github.com/repos/${owner}/${name}`;

      const [repo, commits] = await Promise.all([
        getJson<RepoResponse>(base),
        getJson<CommitResponse[]>(`${base}/commits?per_page=5`),
      ]);

      const list: CommitEntry[] = Array.isArray(commits)
        ? commits
            .filter((commit) => commit?.commit?.author?.date)
            .map((commit) => ({
              sha: commit.sha,
              repo: name,
              message: commit.commit.message.split("\n")[0],
              url: commit.html_url,
              date: commit.commit.author!.date,
            }))
        : [];

      if (!repo) return { slug, stats: null, commits: list };

      return {
        slug,
        stats: {
          stars: repo.stargazers_count,
          language: repo.language,
          openIssues: repo.open_issues_count,
          lastCommit: list[0]?.date ?? null,
        } satisfies RepoStats,
        commits: list,
      };
    }),
  );

  const stats: Record<string, RepoStats> = {};
  const commits: CommitEntry[] = [];

  for (const result of results) {
    if (!result) continue;
    if (result.stats) stats[result.slug] = result.stats;
    commits.push(...result.commits);
  }

  commits.sort((a, b) => b.date.localeCompare(a.date));

  return { stats, commits: commits.slice(0, commitLimit) };
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["week", 604_800],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

/** "3 days ago" — computed at render time against the cached timestamp. */
export function relativeTime(iso: string): string {
  const seconds = (Date.now() - new Date(iso).getTime()) / 1000;
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const [unit, size] of UNITS) {
    if (seconds >= size) {
      return formatter.format(-Math.floor(seconds / size), unit);
    }
  }
  return "just now";
}
