# eshaanpunalekar.com

Personal portfolio site — [eshaanpunalekar.com](https://eshaanpunalekar.com)

## Overview

A single-scroll portfolio built from scratch (hand-coded, not a
template) showcasing my work as a CS student at UC Irvine and Data &
Automation Intern at CliftonLarsonAllen. Home flows through Hero →
About/Journey → Stack → Projects, with dedicated pages for full
project case studies, resume, and contact.

## Stack

- **Framework:** Next.js 14 (App Router), TypeScript
- **Styling:** Tailwind CSS
- **Email:** Resend (contact form via Server Action)
- **Deployment:** Vercel

## Features

- Dark glassmorphic design system — frosted glass panels, ambient
  animated gradient blobs (with mouse-follow drift), custom
  magnetic-snap cursor with blend-mode invert
- Full-screen particle entrance animation (canvas-based, assembles
  into initials on first visit per session)
- Flowing tag-cloud Stack section with weighted skill emphasis
- Self-drawing scroll-linked timeline blending work history and
  project milestones
- Live GitHub API integration on the Projects page — per-repo stats
  and recent commit activity feed
- 3D cursor-tilt on project cards and headshot
- View Transitions API for page navigation
- Command palette (⌘K) for quick site navigation
- Recruiter Mode — a distinct, printable, animation-free view of the
  same content for fast resume-style scanning
- Full accessibility fallbacks: `prefers-reduced-motion` respected
  throughout, low-end-device detection for the entrance animation

## Running locally

```bash
npm install
npm run dev
```

## Environment variables

```
RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=
```

## Additional Details

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

## Development Roadmap

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
