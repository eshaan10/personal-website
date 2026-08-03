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
