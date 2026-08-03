import { STACK, type StackItem } from "@/lib/stack";
import { SECTION_IDS } from "@/lib/nav";

/**
 * Tag cloud, deliberately not cards.
 *
 * The project cards elsewhere on Home are bordered glass panels, so this
 * section reads as flowing text instead: no containers, no chips, no rules.
 * Emphasis comes from type weight, size, and colour intensity, which is what
 * makes it a cloud rather than an alphabetised list in a box.
 */

const WEIGHT_STYLES: Record<StackItem["weight"], string> = {
  3: "text-xl font-semibold text-text-primary md:text-2xl",
  2: "text-base font-medium text-text-secondary md:text-lg",
  1: "text-sm font-normal text-text-muted md:text-base",
};

export default function StackSection() {
  return (
    <section
      id={SECTION_IDS.stack}
      className="mx-auto w-full max-w-5xl scroll-mt-28 px-6 pb-32 md:px-10"
    >
      <p className="label-mono">
        <span className="text-text-primary">02</span>
        <span className="mx-2 text-text-muted">//</span>
        <span>stack</span>
      </p>

      <h2 className="mt-6 max-w-3xl text-3xl font-semibold leading-[1.08] tracking-[-0.02em] text-text-primary md:text-5xl">
        What I work with.
      </h2>

      <div className="mt-14 space-y-12">
        {STACK.map((category) => (
          <div key={category.id}>
            <p className="label-mono">{category.label}</p>

            {/* Baseline-aligned inline flow, so mixed type sizes sit on one
                line rather than stepping up and down. */}
            <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-2 leading-snug">
              {category.items.map((item, index) => (
                <span key={item.name} className="flex items-baseline gap-x-3">
                  {index > 0 && (
                    <span aria-hidden className="text-sm text-text-muted/50">
                      ·
                    </span>
                  )}
                  <span className={WEIGHT_STYLES[item.weight]}>
                    {item.name}
                  </span>
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
