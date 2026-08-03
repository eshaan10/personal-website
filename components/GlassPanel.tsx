import type { ElementType, ComponentPropsWithoutRef, ReactNode } from "react";

type GlassPanelOwnProps<T extends ElementType> = {
  /** Render as a different element — `section`, `nav`, `article`, `aside`. */
  as?: T;
  /** `soft` for quiet callouts, `raised` for cards that need more presence. */
  tone?: "soft" | "raised";
  /** Corner radius step. `none` for full-bleed bars. */
  radius?: "none" | "sm" | "md" | "lg";
  /** Which edges get a hairline. `bottom` for full-bleed bars. */
  edge?: "all" | "bottom";
  /**
   * Light-sweep shine on hover. Opt-in rather than default: it belongs on
   * cards, but a nav bar that flashes every time the pointer crosses it is
   * a distraction, not polish.
   */
  shine?: boolean;
  className?: string;
  children?: ReactNode;
};

type GlassPanelProps<T extends ElementType> = GlassPanelOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof GlassPanelOwnProps<T>>;

const toneStyles = {
  soft: "border-glass-border-soft",
  raised: "border-glass-border shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset]",
} as const;

const radiusStyles = {
  none: "rounded-none",
  sm: "rounded-[10px]",
  md: "rounded-glass",
  lg: "rounded-[16px]",
} as const;

// Explicit rather than letting callers pass `border-t-0` in className —
// same-specificity width utilities would resolve by stylesheet order, not
// by the order they appear in the class string.
const edgeStyles = {
  all: "border",
  bottom: "border-b",
} as const;

/**
 * Frosted translucent surface. Use for cards, nav-on-scroll, and callouts —
 * not for body-text containers (see CLAUDE.md design system).
 */
export default function GlassPanel<T extends ElementType = "div">({
  as,
  tone = "soft",
  radius = "md",
  edge = "all",
  shine = false,
  className = "",
  children,
  ...rest
}: GlassPanelProps<T>) {
  const Component = (as ?? "div") as ElementType;

  return (
    <Component
      className={[
        "glass-blur",
        shine ? "glass-shine" : "",
        edgeStyles[edge],
        toneStyles[tone],
        radiusStyles[radius],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </Component>
  );
}
