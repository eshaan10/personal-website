# eshaanpunalekar.com — Project Context

## Stack
Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion.
Deploy target: Vercel.

## Design system
**Aesthetic:** Dark glassmorphic. Frosted translucent panels over a deep
near-black gradient background. Monochrome — no color accent, neutral
white/gray glow only. Corporate-clean, restrained.

**Background:** `linear-gradient(160deg, #1B1B1D, #0E0E0F 60%)`

**Ambient glow blobs (behind content, blurred, animated):**
- Two soft radial-gradient blobs, `rgba(220,220,225,0.18)` and
  `rgba(180,180,190,0.12)`, `filter: blur(10px)`.
- Ambient drift: slow (8-12s+), organic, non-synced looping keyframes —
  never fast, never in sync with each other.
- Mouse-follow: blobs also drift subtly toward cursor position, layered
  on top of the ambient drift (not replacing it).
- Must respect `prefers-reduced-motion` — disable all blob motion when set.

**Glass panel recipe (cards, callouts, nav-on-scroll):**
```
background: rgba(255,255,255,0.05-0.08);
backdrop-filter: blur(12-14px);
border: 1px solid rgba(255,255,255,0.1-0.14);
border-radius: 10-16px;
```
Use glass selectively (cards, nav, callouts) — not on body text containers.
Backdrop blur is expensive: keep a lighter/no-blur fallback for mobile.

**Typography:**
- Display/headings: Inter, 600-700 weight
- Body: Inter, 400
- Small labels/eyebrow text/stats: JetBrains Mono, uppercase, letter-spaced

**Colors:**
- Text primary: `#F2F2F2` / `#EFEFEF`
- Text secondary: `#ADADB2` / `#98989E`
- Borders/dividers: `rgba(255,255,255,0.08-0.14)`

## Sitemap
1. **Home** — hero, compact timeline slice, featured projects (3 cards),
   about teaser, contact CTA
2. **Projects index** — all projects browsable
3. **Project case studies** (individual pages) — Scout, MarketEdge, Sprout,
   UI toolkit
4. **About** — full story, CLA/UCI background, full timeline, personality
5. **Resume** — page + downloadable/printable version
6. **Now** — what I'm currently working on/learning
7. **Contact**

## Feature list (build in this priority order — do not skip ahead)

**Phase 1 — foundation:**
- Base layout, design tokens, fonts, glass panel component
- Hero section with animated blobs (ambient + mouse-follow)
- Scroll-aware nav (transparent → frosted on scroll)
- Custom easing on all transitions (no default ease-in-out)

**Phase 2 — core content:**
- Timeline component (self-drawing line on scroll, glowing "present" node)
- Project cards with 3D cursor-tilt
- Count-up stat numbers
- Projects index + case study page template

**Phase 3 — polish:**
- Light-sweep hover shine on glass cards
- Custom cursor states
- Custom scrollbar styling
- Live GitHub contribution graph embed
- Print stylesheet for /resume

**Phase 4 — stretch (only after 1-3 are solid):**
- View Transitions API for page navigation
- WebGL shader background (replacing CSS blobs) — optional upgrade
- Live coding-status widget (GitHub/Spotify API)
- Dynamic OG image generation per project page
- Scroll-velocity-reactive animation timing
- Recruiter-mode toggle (condensed, animation-off view)
- Command palette (Cmd+K) nav
- Hidden easter egg interaction

## Working agreement (for token/credit efficiency)
- Work one phase, one feature at a time. Do not jump ahead to later phases
  unprompted.
- Before introducing a new dependency, state it and wait for confirmation.
- Prefer editing/extending existing components over rewriting files wholesale.
- Flag scope creep — if a request implies significantly more work than
  asked, say so before proceeding.