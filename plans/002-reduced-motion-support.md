# 002 — Real `prefers-reduced-motion` support

- **Status**: DONE
- **Commit**: `a6425c7`
- **Severity**: HIGH
- **Category**: Accessibility
- **Estimated scope**: 2 files edited, ~20 lines changed

## Problem

The site has **264 Motion call-sites** and **zero** of them respond to `prefers-reduced-motion`. `useReducedMotion` appears nowhere in `app/`, `components/` or `lib/`.

The only handling is a blanket CSS override:

```css
/* app/globals.css:370-379 — current */
/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Two things are wrong with it:

1. **It does not reach Motion.** Motion animates by writing inline `transform` / `opacity` values on each frame via JS, not by setting CSS `transition-duration`. Every parallax, spring, slide-up entrance and infinite loop on this site plays at full strength for a user who explicitly asked the OS for less motion. On the home page alone that is a fixed full-viewport parallax (`components/hero.tsx:110-115`), three infinite rotating shapes and a full-page stagger.
2. **Where it does reach, it is too blunt.** Reduced motion means *fewer and gentler* animations, not zero. Nuking `transition-duration` to `0.01ms` on `*` removes opacity and colour feedback too — hover states, focus rings and form validation all hard-cut. The user loses comprehension aids they never asked to lose.

## Target

One provider-level switch that makes Motion honour the OS setting globally, plus a narrowed CSS rule that drops *movement* while keeping *opacity and colour*.

### A. `components/provider.tsx`

`MotionConfig` with `reducedMotion="user"` makes every `motion` component in the tree skip `transform` and `layout` animations when the OS asks, while still animating `opacity`. This is the single change that covers all 264 call-sites.

```tsx
/* target — components/provider.tsx, complete file */
'use client';

import { ThemeProvider } from 'next-themes';
import { MotionConfig } from 'motion/react';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      {/* reducedMotion="user" makes every motion component in the tree drop
          transform/layout animation when the OS asks, keeping opacity. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeProvider>
  );
}
```

### B. `app/globals.css`

```css
/* target — replaces app/globals.css:370-379 */
/* Reduced motion: drop movement, keep opacity and colour feedback. */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    /* Stop looping/keyframed motion outright. */
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }

  /* Transitions survive, but only for properties that do not move anything. */
  *,
  *::before,
  *::after {
    transition-property: opacity, color, background-color, border-color,
      box-shadow, fill, stroke !important;
    transition-duration: 150ms !important;
  }

  html {
    scroll-behavior: auto;
  }
}
```

## Repo conventions to follow

- `components/provider.tsx` is the single client-side provider wrapper, mounted once in `app/layout.tsx` around all children. Add global context providers there, not in `layout.tsx`.
- Motion is imported from `motion/react`. Exemplar: `components/hero.tsx:2` — `import { motion, useScroll, useTransform } from 'motion/react';`
- Global CSS lives in `app/globals.css` under `@layer base`. The reduced-motion block is already inside `@layer base` — keep it there.

## Steps

1. Replace the entire contents of `components/provider.tsx` with section A above.
2. In `app/globals.css`, replace lines 370-379 (the `/* Reduce motion for users who prefer it */` comment through the closing brace of its `@media` block) with section B above.
3. Leave `html { scroll-behavior: smooth; }` at `app/globals.css:366-368` in place — the new block overrides it inside the media query.

## Boundaries

- Do NOT add `useReducedMotion()` calls to individual components in this plan. `MotionConfig` covers them; per-component branching is only needed for the drag gesture in plan 007, which handles it itself.
- Do NOT delete the `repeat: Infinity` loops here — that is plan 003.
- Do NOT touch `app/layout.tsx`.
- Do NOT add new dependencies.
- If `components/provider.tsx` is not the 12-line file shown in the Problem section (drift since commit `a6425c7`), STOP and report.

## Verification

- **Mechanical**: `bun run lint` and `bun run build` both pass.
- **Feel check** — run `bun run dev`, open DevTools → Rendering → **Emulate CSS media feature `prefers-reduced-motion: reduce`**, then:
  - Load `/` and confirm the hero content **appears** rather than sliding up, and that the page does **not** parallax as you scroll (`components/hero.tsx:110-115`).
  - Hover a nav link and confirm the background colour still transitions — feedback is preserved, not killed.
  - Focus a contact form field (`/contact-me`) and confirm the focus ring still appears with a visible transition.
  - Trigger a validation error on the contact form and confirm the error text still fades in.
  - Open a gallery image on any `/projects/[id]` page and confirm the lightbox still opens and is dismissable.
  - Turn the emulation **off** and confirm all normal motion returns.
- **Done when**: with reduced motion emulated, no element changes position or scale on any route, opacity and colour feedback still works everywhere, and every page remains fully usable.

## Verification results

- `bun run build`: succeeds, 28/28 static pages, no warnings.
- `bun run lint`: unchanged from the pre-existing baseline (1 error + 2 warnings,
  all in files this plan does not touch — see plan 001's notes).
- **Feel check: pending.** Requires `bun run dev` with DevTools reduced-motion
  emulation. Both changes are in place and build clean, but "no element changes
  position or scale" has not been observed yet.
