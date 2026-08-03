/**
 * Lives outside Nav.tsx on purpose: Nav is a client module, and every export
 * of a "use client" file becomes a client reference — a server component
 * importing this from there would get a proxy, not the string.
 */
export const NAV_SENTINEL_ID = "hero-end";

export const NAV_HEIGHT = 72;

export type NavLink = { href: string; label: string };

/**
 * Primary nav — the four pages a visitor evaluating Eshaan actually needs,
 * in the order they'd want them. The recruiter toggle sits after these as a
 * control, not a link.
 */
/**
 * The first three are in-page sections on Home, not routes. Resume is a real
 * page, and the recruiter toggle sits after them as a control.
 */
export const PRIMARY_NAV: NavLink[] = [
  { href: "/#about", label: "About" },
  { href: "/#stack", label: "Stack" },
  { href: "/#projects", label: "Projects" },
  { href: "/resume", label: "Resume" },
];

export const SECTION_IDS = {
  about: "about",
  stack: "stack",
  projects: "projects",
} as const;

/**
 * Contact stays a standalone page and lives here, in the footer — visible on
 * every page at every viewport, without hiding the conversion action behind a
 * menu click. Now is no longer a route at all: its content is the Home About
 * section, and the full version lives at /journey.
 */
export const SECONDARY_NAV: NavLink[] = [
  { href: "/journey", label: "Journey" },
  { href: "/contact", label: "Contact" },
];

export const ALL_NAV = [...PRIMARY_NAV, ...SECONDARY_NAV];
