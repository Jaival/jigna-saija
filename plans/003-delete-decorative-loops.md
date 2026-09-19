# 003 — Delete the 27 infinite decorative loops

- **Status**: DONE
- **Commit**: `a6425c7`
- **Severity**: HIGH
- **Category**: Purpose & frequency / Performance
- **Estimated scope**: 5 files edited, ~250 lines deleted

## Problem

Twenty-seven `repeat: Infinity` animations run permanently across the site, driving blurred blobs, rotating squares, pulsing rings and floating icons. None of them indicates state, provides feedback, explains a change or maintains spatial consistency. They are decoration on always-visible elements.

"It looks cool" is not a purpose for an element the user sees on every page load, and an animation that never ends is the most expensive kind: it holds compositor layers alive, prevents the tab from idling, and drains battery for the entire session.

Exact locations:

| File | Lines with `repeat: Infinity` | What it drives |
| --- | --- | --- |
| `app/page.tsx` | 24, 39, 56 | Three fixed full-viewport floating shapes (`FloatingElements`, lines 14-59) |
| `components/hero.tsx` | 80, 95 | Two blurred gradient blobs (`FloatingBgElements`, lines 66-102) |
| `components/aboutMe.tsx` | 130, 146, 203, 218, 387 | Two `blur-3xl` background blobs + three card-level loops |
| `components/designProcess.tsx` | 91, 120, 130, 205, 279, 295, 415, 426 | Background blobs, a 15s linear rotation, pulsing step indicators |
| `components/gallery/ImageGallery.tsx` | 547 | A looping element inside the image grid |

Representative code:

```tsx
// app/page.tsx:14-30 — current
const FloatingElements = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    {/* Floating geometric shapes using modern color palette */}
    <motion.div
      className="absolute top-20 left-10 w-6 h-6 rounded-full opacity-15 bg-gradient-brand"
      animate={{
        y: [0, -20, 0],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
```

```tsx
// components/aboutMe.tsx:118-133 — current
<motion.div
  className="absolute top-1/4 -left-20 w-40 h-40 rounded-full blur-3xl opacity-8"
  style={{
    background:
      'radial-gradient(circle, rgba(29, 103, 147, 0.08), rgba(52, 211, 153, 0.04))',
  }}
  animate={{
    scale: [1, 1.2, 1],
    rotate: [0, 180, 360],
  }}
  transition={{
    duration: 25,
    repeat: Infinity,
    ease: 'linear',
  }}
/>
```

Compounding the cost: several of these use `blur-3xl` (a 64px blur) on an animated element. Transition-time blur should stay under 20px — 64px blur that re-renders every frame is expensive, especially in Safari.

## Target

Delete the motion, keep the visual where it contributes. A static soft gradient wash is a legitimate design element; an animated one is not.

For every location listed above:

- If the element exists **only** to animate (the three shapes in `FloatingElements`), delete the element and its wrapper entirely.
- If the element is a **background wash** that reads fine while still (the blurred gradient blobs), convert `motion.div` → plain `div`, drop `animate` and `transition`, and keep `className` and `style`.
- If the loop is a **pulsing indicator** on a card or step, delete the `animate`/`transition` props only; the element keeps its static appearance.

Example conversion:

```tsx
// target — components/aboutMe.tsx, replacing lines 118-133
<div
  className="absolute top-1/4 -left-20 w-40 h-40 rounded-full blur-3xl opacity-8"
  style={{
    background:
      'radial-gradient(circle, rgba(29, 103, 147, 0.08), rgba(52, 211, 153, 0.04))',
  }}
/>
```

```tsx
// target — app/page.tsx: delete the FloatingElements component (lines 13-59)
// and its usage at line 113: <FloatingElements />
```

### Explicitly out of scope — do NOT delete these

These infinite loops are correct and must stay:

- `app/loading.tsx:18, 25, 32` — a loading indicator is constant motion by definition; `ease: 'linear'` on a spinner is right.
- `components/ui/skeleton.tsx` — `animate-pulse` on a skeleton communicates "still loading".
- The `.loader` keyframes in `app/globals.css` (`jump7456`, `shadow324`) — same reason.

## Repo conventions to follow

- Decorative wrappers in this repo are marked `pointer-events-none` and live directly inside the section's relative container. Exemplar: `components/hero.tsx:67` — `<div className="absolute inset-0 overflow-hidden pointer-events-none">`. Keep that wrapper when it still holds a static child; delete it when it becomes empty.
- Unused imports must go. After deleting the last `motion.` usage in a file, remove `motion` from its `motion/react` import. `bun run lint` will flag leftovers.

## Steps

1. `app/page.tsx` — delete the `FloatingElements` component (lines 13-59) and its render site (`<FloatingElements />`, line 113). Keep the static `radial-gradient` background div at lines 101-110; it does not animate.
2. `components/hero.tsx` — delete the `FloatingBgElements` component (lines 66-102) and its render site (`<FloatingBgElements />`, line 118).
3. `components/aboutMe.tsx` — convert the blobs at lines 117-152 to plain `div`s per the Target example. At lines 196-225 and 380-395, delete the `animate` and `transition` props whose transition contains `repeat: Infinity`, leaving the element and its other props intact.
4. `components/designProcess.tsx` — same treatment at lines 85-95, 120, 130, 205, 273-300, 415, 426. Lines 120, 130, 205, 415 and 426 are single-line `transition={{ … repeat: Infinity … }}` props: delete the whole `transition` prop **and** the `animate` prop it pairs with.
5. `components/gallery/ImageGallery.tsx` — delete the `animate` + `transition` pair at lines ~540-550 containing `repeat: Infinity`.
6. In each edited file, remove any now-unused import and any `motion.div` that no longer has a single motion prop (convert it to `div`).
7. Run `bun run lint --fix` and then `bun run lint` to catch leftovers.

## Boundaries

- Do NOT delete entrance animations (`initial` / `animate` / `whileInView` pairs **without** `repeat`). Those are plan 006's concern.
- Do NOT delete `whileHover` / `whileTap` props. Those are plan 005's concern.
- Do NOT touch `app/loading.tsx`, `components/ui/skeleton.tsx`, or the `.loader` utility in `app/globals.css`.
- Do NOT change layout, spacing, colours or copy. Only motion props and the elements that exist solely to carry them.
- Do NOT add new dependencies.
- If a cited line does not contain what this plan describes (drift since commit `a6425c7`), STOP and report.

## Verification

- **Mechanical**:
  - `grep -rn "repeat: Infinity" app components` returns **only** the three lines in `app/loading.tsx` and nothing else.
  - `bun run lint` passes with no unused-import warnings.
  - `bun run build` succeeds.
- **Feel check**: run `bun run dev` and on `/`, `/projects` and any `/projects/[id]`:
  - Open DevTools → Performance, record 5 seconds while **not** interacting. The main thread and compositor should be essentially flat. Before this change they show continuous frame activity.
  - Open DevTools → Rendering → **Paint flashing**. With the page idle, nothing should flash green.
  - Confirm the pages still look composed — the soft gradient washes are still there, they just hold still.
- **Done when**: no `repeat: Infinity` outside `app/loading.tsx`; an idle page produces no repainting; the visual composition of each section is unchanged apart from being still.

## Implementation notes (deviations from the plan as written)

**1. `components/gallery/ImageGallery.tsx:547` was NOT deleted.** The plan's table
calls it "a looping element inside the image grid" and step 5 says to remove it. It
is actually the spinner inside the per-thumbnail `{isLoading && …}` overlay — a
loading indicator, which this plan's own "explicitly out of scope" section says to
keep ("a loading indicator is constant motion by definition"). Deleting it would
leave a static ring that reads as a broken image. The audit mislabelled it; the
plan's stated principle wins over its step list.

**2. `components/hero.tsx` had 5 infinite loops, not the 2 the plan lists** (lines
80 and 95). The three extra ones were inside the card renderer: a
`backgroundPosition` drift on the card wash, a `textShadow` pulse on the step
number, and a 15s ring rotation. All three were removed — same category, same
reasoning, they were simply missed in the audit.

**3. Hero's `FloatingBgElements` was converted, not deleted.** Step 2 says delete
the component and its render site. Its two children are `blur-xl` radial-gradient
washes — the exact "background wash that reads fine while still" case the Target
section says to convert. Deleting them would change the hero's composition, which
this plan's "Done when" says must stay unchanged. They are now plain `div`s.
`app/page.tsx`'s `FloatingElements` *was* deleted outright as instructed — those
were solid dots and a ring that exist only to move.

## Verification results

- `grep -rn "repeat: Infinity" app components` → `app/loading.tsx` (3),
  `components/ui/skeleton.tsx` (2), `components/gallery/ImageGallery.tsx:547` (the
  loading spinner, see note 1). All three are loading indicators. No decorative
  loops remain.
- `bun run build`: succeeds. `tsc --noEmit`: clean. `bun run lint`: unchanged
  pre-existing baseline, no unused-import warnings.
- **Idle-repaint check: PASSED, measured.** On `/` in a real browser, after letting
  entrance animations settle, sampled inline `transform`/`opacity` styles across 116
  elements over three consecutive 3-second windows: **0, 0, 0 mutations**. One
  `getAnimations()` entry remains with `iterations: 1` — a finished entrance, not a
  loop. Before this change the page mutated continuously.
- Home page composition confirmed unchanged apart from being still (visual check at
  1280×800).
