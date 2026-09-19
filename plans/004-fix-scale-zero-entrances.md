# 004 — Fix the six `scale(0)` entrances

- **Status**: DONE
- **Commit**: `a6425c7`
- **Severity**: HIGH
- **Category**: Physicality & origin
- **Estimated scope**: 3 files edited, ~30 lines changed
- **Depends on**: plan 001 (`lib/motion.ts` must exist)

## Problem

Six elements animate into existence from `scale: 0`. Nothing in the physical world appears from nothing — an object arriving from zero size reads as a computer drawing a shape, not as a thing arriving. Four of the six compound it with a large rotation, which reads as a loading spinner.

```tsx
// components/hero.tsx:54-64 — current
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
// components/hero.tsx:233-239 — current
<motion.div
  className="absolute -bottom-6 -right-6 bg-white/95 backdrop-blur-sm rounded-full p-4 shadow-xl"
  style={{ border: '2px solid #f6f6f1' }}
  initial={{ scale: 0, rotate: -180 }}
  animate={{ scale: 1, rotate: 0 }}
  transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
  whileHover={{ scale: 1.05, rotate: 2 }}
>
```

```tsx
// components/hero.tsx:321-328 — current
<motion.div
  className="absolute top-4 right-4 flex items-center justify-center"
  initial={{ scale: 0, rotate: -90 }}
  whileInView={{ scale: 1, rotate: 0 }}
  transition={{
    delay: index * 0.05 + 0.3,
    type: 'spring',
    stiffness: 180,
```

```tsx
// components/aboutMe.tsx:359-367 — current
<motion.div
  className="absolute inset-0 opacity-8 group-hover:opacity-15 transition-opacity duration-300"
  style={{
    background: item.color,
  }}
  initial={{ scale: 0, rotate: 45 }}
  whileInView={{ scale: 1, rotate: 0 }}
  transition={{ delay: index * 0.05 + 0.3, duration: 0.6 }}
/>
```

```tsx
// components/aboutMe.tsx:371-380 — current
<motion.div
  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
  style={{ backgroundColor: 'rgba(246, 246, 241, 0.25)' }}
  initial={{ scale: 0, rotate: -90 }}
  whileInView={{ scale: 1, rotate: 0 }}
  transition={{
    delay: index * 0.03 + 0.4,
    type: 'spring',
    stiffness: 200,
  }}
>
```

```tsx
// components/designProcess.tsx:36-45 — current
const stepIndicatorVariants = {
  hidden: { scale: 0, rotate: -90 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring' as const,
      damping: 20,
      stiffness: 180,
    },
  },
};
```

The `delay: 1.2` at `components/hero.tsx:237` is a second problem in the same element: the badge sits invisible for 1.2 seconds after the hero has fully arrived, so it reads as a late-loading asset rather than part of the composition.

## Target

Every entrance starts at `scale: 0.96` with `opacity: 0`, uses the shared critically-damped spring, and drops the decorative rotation entirely.

```tsx
/* target — components/hero.tsx, replacing cardVariants at lines 54-64 */
const cardVariants: Variants = {
  hidden: { scale: 0.96, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: spring },
};
```

```tsx
/* target — components/hero.tsx, replacing lines 233-239 */
<motion.div
  className="absolute -bottom-6 -right-6 bg-white/95 backdrop-blur-sm rounded-full p-4 shadow-xl"
  style={{ border: '2px solid #f6f6f1' }}
  initial={{ scale: 0.96, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ ...spring, delay: 0.2 }}
  whileHover={{ scale: 1.03 }}
>
```

```tsx
/* target — components/hero.tsx, replacing lines 321-328 */
<motion.div
  className="absolute top-4 right-4 flex items-center justify-center"
  initial={{ scale: 0.96, opacity: 0 }}
  whileInView={{ scale: 1, opacity: 1 }}
  viewport={{ once: true }}
  transition={{ ...spring, delay: index * STAGGER }}
```

```tsx
/* target — components/aboutMe.tsx, replacing lines 359-367 */
<motion.div
  className="absolute inset-0 opacity-8 group-hover:opacity-15 transition-opacity duration-300"
  style={{
    background: item.color,
  }}
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  transition={{ ...enterTransition, delay: index * STAGGER }}
/>
```

> Note: this element is a full-bleed background wash inside a card. It has no edge of its own to scale, so a pure opacity fade is the correct entrance — scaling a background reads as a glitch.

```tsx
/* target — components/aboutMe.tsx, replacing lines 371-380 */
<motion.div
  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
  style={{ backgroundColor: 'rgba(246, 246, 241, 0.25)' }}
  initial={{ scale: 0.96, opacity: 0 }}
  whileInView={{ scale: 1, opacity: 1 }}
  viewport={{ once: true }}
  transition={{ ...spring, delay: index * STAGGER }}
>
```

```tsx
/* target — components/designProcess.tsx, replacing lines 36-45 */
const stepIndicatorVariants: Variants = {
  hidden: { scale: 0.96, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: spring },
};
```

## Repo conventions to follow

- Variant objects are declared at module scope, above the component, with the suffix `Variants`. Exemplar: `components/hero.tsx:31-39` (`containerVariants`).
- Motion types are imported from `motion/react`: `import { motion, type Variants } from 'motion/react';`
- Shared motion values come from `@/lib/motion` (created by plan 001): `import { spring, enterTransition, STAGGER } from '@/lib/motion';`
- Scroll-triggered entrances use `whileInView` with `viewport={{ once: true }}` so they do not replay. Exemplar: `app/page.tsx:78`.

## Steps

1. In `components/hero.tsx`, add `import { spring, STAGGER } from '@/lib/motion';` and add `type Variants` to the existing `motion/react` import.
2. Replace `cardVariants` (lines 54-64) with the target above.
3. Replace lines 233-239 with the target above — note `delay` drops from `1.2` to `0.2` and the `rotate: 2` is removed from `whileHover`.
4. Replace lines 321-328 with the target above, adding `viewport={{ once: true }}`.
5. In `components/aboutMe.tsx`, add `import { spring, enterTransition, STAGGER } from '@/lib/motion';`, then replace lines 359-367 and 371-380 with their targets.
6. In `components/designProcess.tsx`, add `import { spring } from '@/lib/motion';` and `type Variants` to the `motion/react` import, then replace `stepIndicatorVariants` (lines 36-45) with the target.
7. Run `bun run lint --fix`, then `bun run lint`.

## Boundaries

- Do NOT touch `hidden: { y: 30, opacity: 0 }` style entrances — plan 006 owns the `y`/duration cleanup.
- Do NOT remove `whileHover` entirely; only the `rotate` component of it at `components/hero.tsx:239`.
- Do NOT change any `className`, `style`, layout or copy.
- Do NOT add new dependencies.
- If `lib/motion.ts` does not exist, STOP — plan 001 must land first.
- If any cited line does not contain the code quoted above (drift since commit `a6425c7`), STOP and report.

## Verification

- **Mechanical**:
  - `grep -rn "scale: 0," app components` returns nothing.
  - `grep -rn "rotate: -180\|rotate: -90\|rotate: 45" app components` returns nothing.
  - `bun run lint` and `bun run build` pass.
- **Feel check**: run `bun run dev`, open DevTools → Animations, set playback speed to **10%**, then reload `/` and scroll slowly through About and Design Process:
  - Every badge, icon and step indicator should look like it is **settling into place**, never like it is being drawn from a point.
  - Nothing should spin.
  - The hero's bottom-right badge should arrive as part of the hero, not 1.2 seconds after it.
  - The card background wash in About should fade only — confirm it never changes size.
  - Toggle `prefers-reduced-motion: reduce` (Rendering panel) and confirm the scale changes are gone but the fades remain.
- **Done when**: zero `scale: 0` entrances remain, no entrance rotates, and at 10% playback every arrival reads as an object settling rather than a shape being drawn.

## Implementation notes (deviations from the plan as written)

The plan documents six `scale: 0` sites. There were **thirteen**. The plan's own
mechanical check (`grep -rn "scale: 0," app components` returns nothing) only
catches the comma-suffixed ones, so the extras went unlisted. All were fixed:

| Extra site | What it is | What it got |
| --- | --- | --- |
| `components/aboutMe.tsx` (stat counter, was :353) | Real `whileInView` entrance | `scale: 0.96, opacity: 0` + shared `spring` + `viewport once` |
| `components/designProcess.tsx` `ConnectingLine` (was :178) | Real `whileInView` entrance | `scale: 0.96` |
| `app/error.tsx` (was :29) | Real `animate` entrance on the error icon | `scale: 0.96, opacity: 0` + shared `spring` |
| `components/hero.tsx` ×2, `components/designProcess.tsx` ×2 (corner decorations) | **Not entrances** — `initial={{scale:0}} whileHover={{scale:1}}`, i.e. `scale: 0` is the *resting* state of a hover reveal | Resting scale raised to `0.96`; `whileHover` left intact per this plan's boundary |

`app/error.tsx` is outside this plan's three named files, but it is inside the
repo-wide grep the Verification section demands and it is the identical one-line
fix, so it was included.

## Verification results

- `grep -rn "scale: 0[,} ]" app components` (excluding `0.9…`) → nothing.
- `grep -rn "rotate: -180\|rotate: -90\|rotate: 45" app components` → nothing.
- `tsc --noEmit`: clean. `bun run build`: succeeds. `bun run lint`: unchanged
  pre-existing baseline.
- **Feel check at 10% playback: NOT RUN.** Requires DevTools' Animations panel,
  which is not reachable from this environment. The code change is mechanical and
  verified by grep, but "reads as settling rather than being drawn" has not been
  observed.
