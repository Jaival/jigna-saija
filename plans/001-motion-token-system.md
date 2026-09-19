# 001 — Establish the motion token system

- **Status**: DONE
- **Commit**: `a6425c7`
- **Severity**: HIGH
- **Category**: Cohesion & tokens
- **Estimated scope**: 2 files (1 new, 1 edited), ~90 lines added

## Problem

There is no shared vocabulary for motion. Every component invents its own curve, duration and spring, so no two elements settle the same way.

Four unrelated spring configs in a single file:

```tsx
// components/hero.tsx:43-63 — current
const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      damping: 25,
      stiffness: 120,
    },
  },
};

const cardVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      damping: 20,
      stiffness: 150,
    },
  },
};
```

```tsx
// components/hero.tsx:139-143 — current
transition={{
  type: 'spring',
  stiffness: 300,
  damping: 20,
}}
```

```tsx
// components/hero.tsx:170 — current
transition={{ type: 'spring', stiffness: 400, damping: 15 }}
```

A hand-typed easing curve that is no stronger than a built-in:

```tsx
// app/page.tsx:81-86 — current
transition={{
  duration: 0.6,
  delay: delay * 0.1,
  ease: [0.25, 0.46, 0.45, 0.94],
}}
```

Across `app/` and `components/` there are **25 distinct duration values** (`0.05`, `0.1`, `0.15`, `0.2`, `0.25`, `0.3`, `0.4`, `0.5`, `0.6`, `0.8`, `1`, `1.5`, `2`, `2.5`, `3`, `4`, `8`, `10`, `12`, `15`, `18`, `20`, `25`, `30`) with no scale behind them.

This matters because motion is how the site communicates that its parts belong to one system. Nine components settling nine different ways reads as nine different products.

## Target

Two token surfaces, one for CSS and one for Motion. No component ever hand-types a curve, duration or spring again.

### A. CSS tokens — `app/globals.css`

Added inside the existing `@theme { … }` block (Tailwind v4). Overriding `--ease-out` and `--ease-in-out` is deliberate: it upgrades every existing Tailwind `ease-out` / `ease-in-out` utility in the codebase to the strong curve in one edit.

```css
/* target — inside @theme, replacing the "Animation Variables" comment block's position */

/* Motion: easing */
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);

/* Motion: duration scale (see V3_UPGRADE_PLAN.md §5) */
--duration-press: 160ms;
--duration-tooltip: 180ms;
--duration-dropdown: 220ms;
--duration-modal: 320ms;
--duration-enter: 280ms;
```

### B. Motion tokens — new file `lib/motion.ts`

```ts
/**
 * Motion tokens for the whole site. Every duration, curve and spring lives here.
 * Values are fixed by V3_UPGRADE_PLAN.md §5 — do not hand-type new ones in components.
 */
import type { Transition, Variants } from 'motion/react';

/** Strong easing curves. Mirror the CSS custom properties in app/globals.css. */
export const ease = {
  out: [0.23, 1, 0.32, 1],
  inOut: [0.77, 0, 0.175, 1],
  drawer: [0.32, 0.72, 0, 1],
} as const;

/** Duration scale in seconds. UI motion stays at or under 0.3. */
export const duration = {
  press: 0.16,
  tooltip: 0.18,
  dropdown: 0.22,
  enter: 0.28,
  modal: 0.32,
} as const;

/** Critically damped. The default for anything the user did not throw. */
export const spring: Transition = {
  type: 'spring',
  bounce: 0,
  duration: 0.4,
};

/** Slight overshoot. Only after a flick, drag release or other carried momentum. */
export const springMomentum: Transition = {
  type: 'spring',
  bounce: 0.2,
  duration: 0.4,
};

/** Standard entrance tween for content arriving on scroll. */
export const enterTransition: Transition = {
  duration: duration.enter,
  ease: ease.out,
};

/** Stagger between siblings in a group entrance. 30–80ms; never blocks interaction. */
export const STAGGER = 0.05;

/** The one entrance the whole site uses. Fades up a short distance, scales from 0.96. */
export const enterVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: enterTransition },
};

/** Parent of a staggered group. Pair with enterVariants on the children. */
export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: STAGGER },
  },
};
```

## Repo conventions to follow

- Design tokens live in `app/globals.css` inside `@theme { … }`. Exemplar: the existing `--radius-sm: 0.25rem;` … `--radius-2xl: 1rem;` group at `app/globals.css:99-104`. Add motion tokens in the same style, with a section comment.
- Shared TypeScript helpers live in `lib/` and are imported via the `@/` alias. Exemplar: `lib/utils.ts` (6 lines, a single named export, imported as `import { cn } from '@/lib/utils'`).
- Motion is imported as `import { motion } from 'motion/react'` — package `motion`, not `framer-motion`.

## Steps

1. Create `lib/motion.ts` with exactly the contents of section B above.
2. In `app/globals.css`, inside the existing `@theme { … }` block and immediately after the `/* Border Radius */` group that ends with `--radius-2xl: 1rem;` (line 104), insert the two token groups from section A above. Keep the existing `/* Animation Variables */` block and its `@keyframes accordion-*` definitions untouched.
3. Do not change any component in this plan. Consumption happens in plans 004, 006, 007, 008 and 010.

## Boundaries

- Do NOT edit any file under `components/` or `app/` other than `app/globals.css`.
- Do NOT delete or modify the existing `--animate-accordion-*` variables or the `@keyframes accordion-down` / `accordion-up` blocks.
- Do NOT add new dependencies.
- Do NOT rename existing colour tokens.
- If the `@theme` block does not look like the excerpt above (drift since commit `a6425c7`), STOP and report instead of improvising.

## Verification

- **Mechanical**: `bun run lint` passes. `bun run build` succeeds. `bunx tsc --noEmit` reports no errors from `lib/motion.ts`.
- **Token check**: In a browser devtools console on the running site, `getComputedStyle(document.documentElement).getPropertyValue('--ease-out')` returns `cubic-bezier(0.23, 1, 0.32, 1)`.
- **Feel check**: Because `--ease-out` now overrides Tailwind's default, existing `ease-out` utilities change feel. Run `bun run dev`, hover a nav link (`components/navBar.tsx:69`) and a project card, and confirm the movement now starts fast and settles gently rather than moving at a constant rate. Nothing should look broken — only crisper.
- **Done when**: `lib/motion.ts` exists and exports `ease`, `duration`, `spring`, `springMomentum`, `enterTransition`, `STAGGER`, `enterVariants`, `staggerContainer`; the five `--duration-*` and three `--ease-*` custom properties resolve at runtime; build is clean.

## Implementation notes (deviations from the plan as written)

1. **The motion tokens live in their own `@theme static { … }` block**, placed just
   before the `@layer theme` dark-mode overrides — not inside the main `@theme`
   block as section A specified. Reason: Tailwind v4 emits only the theme
   variables some generated utility actually uses. With the tokens in the plain
   `@theme` block, a clean build emitted `--ease-out` and nothing else; the four
   unused `--duration-*` and `--ease-drawer` resolved to empty at runtime, which
   fails this plan's own "Done when". `static` forces all eight out. Marking the
   *whole* existing `@theme` block static was rejected — it would also emit every
   unused colour variable.

2. **Two `@source not` directives were added at the top of `app/globals.css`**,
   excluding `plans/` and `V3_UPGRADE_PLAN.md`. Tailwind's automatic source
   detection was scanning these markdown files and turning quoted class names in
   prose into real utilities, including the literal `pt-[env(...)]` from plan 014,
   which produced a CSS optimizer warning on every build. Not a motion concern,
   but it was introduced by the plan documents themselves.

## Verification results

- `bunx tsc --noEmit` (local `typescript`): clean, 0 errors.
- `bun run build`: succeeds, 28/28 static pages, no CSS warnings.
- Token check performed against the emitted stylesheet rather than devtools — all
  eight custom properties present in `.next/static/chunks/*.css`:
  `--ease-out`, `--ease-in-out`, `--ease-drawer`, `--duration-press`,
  `--duration-tooltip`, `--duration-dropdown`, `--duration-modal`, `--duration-enter`.
- **Feel check: NOT RUN.** Requires `bun run dev` and a browser.
- `bun run lint`: **fails, pre-existing.** 1 error + 2 warnings at base commit
  `a6425c7`, none in files this plan touches:
  - `components/projects.tsx:27` — `react-hooks/set-state-in-effect` (error)
  - `app/opengraph-image.tsx:236,250` — `@next/next/no-img-element` (warnings)
  Plan 008 owns `projects.tsx`; fix the lint error there.
