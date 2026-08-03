import GlassPanel from "./GlassPanel";

const USERNAME = "eshaan10";

/**
 * Monochrome contribution grid.
 *
 * Rendered from GitHub's public contributions fragment rather than an
 * external image service: no third-party dependency, no off-palette green,
 * and no request from the visitor's browser to a host we don't control.
 *
 * The trade-off is that this is an undocumented endpoint — so every failure
 * path degrades to a quiet message instead of breaking the page or the build.
 */
type Day = { date: string; level: number };

const LEVEL_FILL = [
  "rgba(255,255,255,0.05)",
  "rgba(235,235,240,0.18)",
  "rgba(235,235,240,0.34)",
  "rgba(235,235,240,0.52)",
  "rgba(240,240,245,0.74)",
];

async function fetchContributions(): Promise<{
  days: Day[];
  total: string | null;
} | null> {
  try {
    const response = await fetch(
      `https://github.com/users/${USERNAME}/contributions`,
      {
        headers: { "User-Agent": "eshaanpunalekar.com" },
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) return null;
    const html = await response.text();

    const days: Day[] = [];
    const cellPattern = /<td[^>]*class="ContributionCalendar-day"[^>]*>/g;

    for (const [tag] of Array.from(html.matchAll(cellPattern))) {
      const date = tag.match(/data-date="([^"]+)"/)?.[1];
      const level = tag.match(/data-level="(\d+)"/)?.[1];
      if (date && level) days.push({ date, level: Number(level) });
    }

    if (days.length === 0) return null;

    days.sort((a, b) => a.date.localeCompare(b.date));

    const total =
      html.match(/([\d,]+)\s*\n?\s*contributions?\s*\n?\s*in the last year/)?.[1] ??
      null;

    return { days, total };
  } catch {
    return null;
  }
}

export default async function GitHubContributions() {
  const data = await fetchContributions();

  if (!data) {
    return (
      <GlassPanel radius="lg" className="p-6">
        <p className="label-mono">GitHub</p>
        <p className="mt-3 text-sm text-text-muted">
          Contribution graph unavailable right now —{" "}
          <a
            href={`https://github.com/${USERNAME}`}
            className="text-text-secondary underline decoration-white/25 underline-offset-4 hover:text-text-primary"
          >
            github.com/{USERNAME}
          </a>
        </p>
      </GlassPanel>
    );
  }

  const { days, total } = data;

  // Lay out by real calendar position: the first week is usually partial, so
  // chunking the array by 7 would shear every column after it.
  const firstDate = new Date(`${days[0].date}T00:00:00Z`);
  const offset = firstDate.getUTCDay();
  const DAY_MS = 86_400_000;

  const cells = days.map((day) => {
    const elapsed = Math.round(
      (new Date(`${day.date}T00:00:00Z`).getTime() - firstDate.getTime()) /
        DAY_MS,
    );
    const index = offset + elapsed;
    return { ...day, column: Math.floor(index / 7) + 1, row: (index % 7) + 1 };
  });

  const columns = Math.max(...cells.map((cell) => cell.column));

  return (
    <GlassPanel radius="lg" className="p-6 md:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="label-mono">GitHub — last 12 months</p>
        <a
          href={`https://github.com/${USERNAME}`}
          className="ease-smooth font-mono text-[11px] uppercase tracking-label text-text-secondary transition-colors duration-300 hover:text-text-primary"
        >
          @{USERNAME} →
        </a>
      </div>

      {total && (
        <p className="mt-4 text-sm text-text-secondary">
          <span className="text-text-primary">{total}</span> contributions in
          the last year
        </p>
      )}

      <div className="mt-5 overflow-x-auto pb-1">
        <div
          role="img"
          aria-label={`GitHub contribution graph for ${USERNAME}${
            total ? `: ${total} contributions in the last year` : ""
          }`}
          className="grid w-max gap-[3px]"
          style={{
            gridTemplateColumns: `repeat(${columns}, 10px)`,
            gridTemplateRows: "repeat(7, 10px)",
            gridAutoFlow: "column",
          }}
        >
          {cells.map((cell) => (
            <div
              key={cell.date}
              title={`${cell.date} — level ${cell.level}`}
              className="rounded-[2px]"
              style={{
                gridColumn: cell.column,
                gridRow: cell.row,
                backgroundColor: LEVEL_FILL[cell.level] ?? LEVEL_FILL[0],
              }}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-label text-text-muted">
          Less
        </span>
        {LEVEL_FILL.map((fill, index) => (
          <span
            key={index}
            className="h-[10px] w-[10px] rounded-[2px]"
            style={{ backgroundColor: fill }}
          />
        ))}
        <span className="font-mono text-[10px] uppercase tracking-label text-text-muted">
          More
        </span>
      </div>
    </GlassPanel>
  );
}
