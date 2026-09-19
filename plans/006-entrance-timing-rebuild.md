# 006 — Rebuild entrance timing to the 300ms budget

- **Status**: DONE
- **Commit**: `a6425c7`
- **Severity**: HIGH
- **Category**: Easing & duration
- **Estimated scope**: 6 files edited, ~120 lines changed
- **Depends on**: plans 001, 004

## Problem

Entrances are roughly twice as long as they should be, and the delay chains stack on top of them.

The site-wide section entrance:

```tsx
// app/page.tsx:62-88 — current
const SectionWrapper = ({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{
      duration: 0.6,
      delay: delay * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94],
    }}
    className={className}
  >
    {children}
  </motion.div>
);
```

- `duration: 0.6` is **double** the 300ms budget for UI motion.
- `ease: [0.25, 0.46, 0.45, 0.94]` is a weak curve, barely stronger than the browser default. It gives the motion no character and no snap.
- `y: 30` is a long travel distance for a fade-up; the element visibly slides rather than settling.

The section dividers are worse:

```tsx
// app/page.tsx:120-126 — current
<motion.div
  className="my-12 md:my-16 mx-auto w-24 h-1 rounded-full divider-brand"
  initial={{ scaleX: 0 }}
  whileInView={{ scaleX: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8, ease: 'easeOut' }}
/>
```

800ms for a 96px decorative line to draw itself. It is the slowest animation on the page and carries the least information.

Across the codebase: **18 occurrences of `duration: 0.6`** and **8 of `duration: 0.8`**. Stagger values are also inconsistent — `staggerChildren: 0.05` at `components/hero.tsx:36` and `components/aboutMe.tsx:46`, but `0.1` with `delayChildren: 0.2` at `components/projects.tsx:94-97`, so the projects grid takes visibly longer to assemble than the hero.

## Target

Everything entering uses the shared `enterVariants` / `enterTransition` from `lib/motion.ts`: `280ms`, `cubic-bezier(0.23, 1, 0.32, 1)`, `y: 12`, `scale: 0.96`. Stagger is `50ms` everywhere.

### A. `SectionWrapper`

```tsx
/* target — app/page.tsx, replacing lines 62-88 */
const SectionWrapper = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={enterTransition}
    className={className}
  >
    {children}
  </motion.div>
);
```

The `delay` prop is removed entirely. Sections enter when they scroll into view — a delay on a scroll-triggered entrance means the user has already looked at an empty space. The `margin` moves from `-50px` to `-80px` so the entrance starts slightly earlier and has finished by the time the section is properly in frame.

Update the three call sites at `app/page.tsx:116`, `:132` and `:138` to drop `delay={1}` / `delay={2}`.

### B. Section dividers

```tsx
/* target — app/page.tsx, both divider instances (lines 120-126 and 129-135) */
<motion.div
  className="my-12 md:my-16 mx-auto w-24 h-1 rounded-full divider-brand"
  initial={{ scaleX: 0, opacity: 0 }}
  whileInView={{ scaleX: 1, opacity: 1 }}
  viewport={{ once: true }}
  transition={enterTransition}
  style={{ transformOrigin: 'center' }}
/>
```

280ms, strong ease-out, growing from its centre.

### C. Stagger containers — one value everywhere

```tsx
/* target — components/hero.tsx:31-39, components/aboutMe.tsx:41-49,
   components/projects.tsx:91-100 all become: */
const containerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: STAGGER },
  },
};
```

Note `hidden: { opacity: 1 }`: the container itself should not fade. Only its children animate, otherwise the group double-fades and the stagger is invisible.

```tsx
/* target — the item variants in those same three files all become: */
const itemVariants: Variants = enterVariants;
```

…or simply import and use `enterVariants` directly and delete the local declaration.

### D. Sweep every remaining long duration

Replace every remaining `duration: 0.6` and `duration: 0.8` in `app/` and `components/` with `duration.enter` (`0.28`) from `lib/motion.ts`, **except** the two exemptions listed under Boundaries.

Replace every `delay: index * 0.05 + 0.3`-style expression with `delay: index * STAGGER` — the constant offsets are what push arrivals past a second.

## Repo conventions to follow

- `import { motion, type Variants } from 'motion/react';`
- `import { enterTransition, enterVariants, STAGGER, duration } from '@/lib/motion';`
- Variants are module-scope constants named `*Variants`. Exemplar: `components/hero.tsx:31`.
- Scroll entrances use `whileInView` + `viewport={{ once: true }}`. Exemplar: `app/page.tsx:77-79`.

## Steps

1. `app/page.tsx` — apply targets A and B; remove the `delay` prop from `SectionWrapper` and from its three call sites; add the `@/lib/motion` import.
2. `components/hero.tsx` — replace `containerVariants` (31-39) and `itemVariants` (41-52) per target C. Replace `transition={{ delay: 0.8 }}` at line 184 with `transition={{ ...enterTransition, delay: STAGGER * 2 }}`. Replace the `duration: 0.6` shine sweep at line 192 with `duration: duration.enter`.
3. `components/aboutMe.tsx` — replace `containerVariants` (41-49) and `itemVariants` (51-62) per target C; sweep remaining `0.6`/`0.8` durations per D.
4. `components/projects.tsx` — replace `containerVariants` (91-100) and `itemVariants` (102-108) per target C. Note the existing `staggerChildren: 0.1, delayChildren: 0.2` becomes `staggerChildren: STAGGER` with no `delayChildren`. Replace the section-level `transition={{ duration: 0.6 }}` at line 112 with `transition={enterTransition}`.
5. `components/designProcess.tsx` and `components/contactMe.tsx` — sweep per D.
6. `app/projects/[id]/ProjectPageClient.tsx` — sweep per D.
7. Run `bun run lint --fix`, then `bun run lint`.

## Boundaries

- **Exempt from the 300ms budget** (leave as-is, and add a one-line comment saying why):
  - `app/loading.tsx` — loading indicators are constant motion.
  - Any explicitly marketing-only hero copy reveal, **if** you keep one; document the reason inline. Default is to bring it into budget.
- Do NOT delete `repeat: Infinity` loops — plan 003 owns that and should already be merged.
- Do NOT change `scale: 0` values — plan 004 owns that and should already be merged.
- Do NOT change markup structure, layout, copy, or colours.
- Do NOT add new dependencies.
- If `lib/motion.ts` does not exist, STOP — plan 001 must land first.
- If a cited line does not contain the code quoted above (drift since `a6425c7`), STOP and report.

## Verification

- **Mechanical**:
  - `grep -rn "duration: 0\.[6-9]" app components` returns nothing outside the documented exemptions.
  - `grep -rn "0.25, 0.46, 0.45, 0.94" app components` returns nothing.
  - `grep -rn "staggerChildren" app components` shows `STAGGER` at every site, no numeric literals.
  - `bun run lint` and `bun run build` pass.
- **Feel check**: run `bun run dev` and load `/` with a hard refresh:
  - Time from first paint to the hero being fully settled should feel **immediate**, not like a sequence playing out. If you can count the steps, it is still too slow.
  - Scroll to About and Design Process at a normal reading speed. Each section should already be settled by the time your eye reaches it — you should never be waiting for content.
  - DevTools → Animations → playback **10%**: confirm the fade-up travels a short distance and decelerates hard at the end (strong ease-out) rather than gliding at a constant rate.
  - Scroll fast to the bottom and back. Nothing should still be mid-animation.
  - Toggle `prefers-reduced-motion: reduce` and confirm sections appear with a fade and no movement.
- **Done when**: no UI entrance exceeds 300ms, every stagger is 50ms, the weak hand-typed curve is gone, and scrolling the home page at reading speed never leaves you waiting for a section to arrive.

## Implementation notes (deviations from the plan as written)

**1. Non-indexed delay ladders were halved onto `STAGGER` multiples.** Target D only
gives a rule for `delay: index * 0.05 + 0.3`-style expressions, but most of the long
chains on this site are hand-tuned *fixed* ladders — `app/projects/[id]/ProjectPageClient.tsx`
runs `delay: 0.1, 0.2, … 0.9`, and `app/error.tsx` runs `0.2 … 0.6`. Those are exactly
what the plan means by "the constant offsets are what push arrivals past a second".
Applied rule: `delay: D` → `STAGGER * round(D / 0.1)`, i.e. every ladder halves while
keeping its authored ordering. The longest chain on `/` went 1080ms → 700ms.

**2. The sweep covered `duration > 0.3`, not just `0.6` and `0.8`.** Target D names
only those two, but the Done-when says "no UI entrance exceeds 300ms" and there were
also `0.4` and `0.5` tweens. All of them now use `duration.enter`.

**3. `designProcess.tsx`'s `cardVariants` and `aboutMe.tsx`'s `imageVariants` were
brought onto the shared `spring`.** Neither is named in the Steps, but both were
bespoke springs (`damping: 25/stiffness: 120` with `duration: 0.5`; `damping: 20/
stiffness: 120`). The second one measured at **650ms** in the browser — the single
slowest entrance left on the home page. Both now use `spring` from `lib/motion`.
`cardVariants` also dropped its `rotateY: -8`, which was a 3D card flip that nothing
else on the site does.

**4. `components/ui/grip.tsx` was swept too** (`delay: i * 0.1` → `i * STAGGER`). Not
in the Steps, but it is the same indexed-ladder pattern target D describes.

**5. The 400ms springs are not a budget violation.** 28 animations on `/` run at
400ms. All are the shared `spring` — `{ type: 'spring', bounce: 0, duration: 0.4 }`
— which V3_UPGRADE_PLAN §5 fixes as the default spring. The 300ms ceiling applies to
tweens.

## Verification results

**Measured in a real browser** on a fresh load of `/`, scrolling the full page and
sampling `document.getAnimations()` every 25ms:

| | Before this plan | After |
| --- | --- | --- |
| Distinct durations | 150, 280, **300, 400, 650** | 150, 280, 300, 400 |
| Tweens over 300ms | 28 | **0** |
| Max delay | 800ms | 400ms |
| Longest single chain (delay + duration) | 1080ms | **700ms** |

Same sweep on a fresh `/projects`: 9 animations, durations 150ms and 300ms only,
no delay over 250ms.

- `grep -rn "duration: 0\.[4-9]" app components` → nothing outside `app/loading.tsx`
  and `components/ui/skeleton.tsx` (the documented exemptions).
- `grep -rn "0.25, 0.46, 0.45, 0.94" app components` → nothing.
- `grep -rn "staggerChildren" app components` → 6 sites, all `STAGGER`, no numeric
  literals, no `delayChildren` anywhere.
- `tsc --noEmit`: clean. `bun run build`: succeeds. `bun run lint`: unchanged
  pre-existing baseline.
- **Reduced-motion feel check: NOT RUN** — no way to emulate `prefers-reduced-motion`
  from this environment.
