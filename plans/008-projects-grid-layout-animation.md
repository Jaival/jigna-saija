# 008 — Layout animation on the projects grid

- **Status**: DONE
- **Commit**: `a6425c7`
- **Severity**: Opportunity (MEDIUM value)
- **Category**: Missed opportunities
- **Estimated scope**: 1 file edited (`components/projects.tsx`), ~40 lines changed
- **Depends on**: plans 001, 006

## Problem

`/projects` has a search box, a category filter (`all` / `interior` / `architecture`), a sort control (`newest` / `oldest` / `title`) and a grid/list view toggle. All four rearrange the grid.

```tsx
// components/projects.tsx:45-76 — current (abridged)
const filteredProjects = useMemo(() => {
  let filtered = allProjects;
  if (deferredSearch) { … }
  if (selectedCategory !== 'all') { … }
  filtered.sort((a, b) => { … });
  return filtered;
}, [allProjects, deferredSearch, selectedCategory, sortBy]);
```

When the user switches sort from `newest` to `title`, every card **teleports** to its new position in a single frame. The user has no way to follow a card they were looking at — the grid simply becomes a different grid. Same on category filter, same on the grid/list toggle.

This is the textbook case for layout animation: a state change that rearranges existing elements, where the rearrangement is the information.

The component already imports `AnimatePresence` (line 4) but only uses it for the item fade — the reordering itself is unanimated.

## Target

Motion's `layout` prop makes each card animate from its previous rect to its new one automatically, using FLIP. Combined with a stable `layoutId`, a card that survives a filter change moves rather than being destroyed and recreated.

```tsx
/* target — the card wrapper inside the grid map */
<motion.div
  key={project.id}
  layout
  layoutId={`project-card-${project.id}`}
  variants={enterVariants}
  initial="hidden"
  animate="visible"
  exit={{ opacity: 0, scale: 0.96, transition: { duration: duration.press } }}
  transition={spring}
  className={/* unchanged */}
>
```

Three things matter here:

1. **`key={project.id}`**, not the array index. An index key makes React reuse the DOM node for a *different* project, so the card's content swaps while its position stays — the exact opposite of what layout animation should show. Verify the current key before editing.
2. **`layout`** animates position and size changes. **`layoutId`** additionally connects a card across mount/unmount, so filtering from `all` → `interior` moves the surviving interior cards instead of fading them out and back in.
3. **`transition={spring}`** — critically damped, `bounce: 0`. Cards rearranging is on-screen movement, not a thrown object; overshoot here would read as sloppy.

Wrap the grid in `LayoutGroup` so sibling layout animations are measured together in one pass:

```tsx
/* target — imports */
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { enterVariants, spring, duration } from '@/lib/motion';
```

```tsx
/* target — grid container */
<LayoutGroup>
  <motion.div layout className={/* existing grid classes */}>
    <AnimatePresence mode="popLayout">
      {filteredProjects.map((project) => ( … ))}
    </AnimatePresence>
  </motion.div>
</LayoutGroup>
```

`mode="popLayout"` removes exiting cards from layout flow immediately, so the remaining cards start moving into the gap right away instead of waiting for the exit to finish.

### The view-mode toggle

`viewMode` switches between `grid` and `list` class strings. With `layout` on each card, the toggle becomes a morph for free — cards slide and resize into rows. Confirm this in the feel check; if the aspect-ratio change causes distortion, add `layout="position"` to the inner image wrapper so only its position animates while its size snaps.

### Search: no layout animation

Search filtering already runs through `useDeferredValue` (line 15) and can change results on every keystroke. Rearranging the whole grid 8 times a second is worse than teleporting. Gate it:

```tsx
/* target */
const isSearching = deferredSearch.length > 0;
…
<motion.div layout={!isSearching} … >
```

While a search term is active, cards snap. Once it is cleared, layout animation returns. Typing is a high-frequency action and high-frequency actions get less animation, not more.

## Repo conventions to follow

- `components/projects.tsx` is a `'use client'` component using `useState` + `useMemo` + `useDeferredValue`. Keep that structure.
- Variants come from `@/lib/motion` after plan 001/006; do not redeclare `enterVariants` locally.
- Tailwind class strings stay inline in `className`, built with template literals as the file already does.

## Steps

1. Update the imports in `components/projects.tsx` per the Target section.
2. Verify the current map key. If it is an array index, change it to `project.id`.
3. Wrap the grid container in `LayoutGroup` and add `layout` to the container `motion.div`.
4. Change the existing `AnimatePresence` to `mode="popLayout"`.
5. Add `layout`, `layoutId`, `exit` and `transition={spring}` to each card wrapper per the Target section.
6. Add the `isSearching` gate so `layout={!isSearching}` on the cards.
7. Run `bun run lint --fix`, then `bun run lint`.

## Boundaries

- Do NOT change the filtering, sorting or search logic in the `useMemo` blocks (lines 33-90).
- Do NOT change `useDeferredValue` usage or the `isSearching` state that already exists at line 23 — add the new derived boolean under a different name if it collides.
- Do NOT change the grid/list Tailwind class strings, spacing or card markup.
- Do NOT add `layout` to the search input, filter buttons or sort control — controls must not move while being used.
- Do NOT add new dependencies.
- If `lib/motion.ts` does not exist, STOP — plan 001 must land first.

## Verification

- **Mechanical**: `bun run lint` and `bun run build` pass.
- **Feel check** — run `bun run dev`, go to `/projects`:
  - Pick a card near the middle and watch it. Switch sort from `newest` to `title`. The card must **travel** to its new position; you should be able to follow it with your eyes the whole way.
  - Switch category `all` → `interior`. Architecture cards fade out and interior cards **slide up into the gaps** — they do not blink to new positions.
  - Toggle grid ↔ list. Cards should resize and reflow continuously. If any image distorts mid-transition, apply the `layout="position"` fix noted in the Target section.
  - Type in the search box quickly. The grid should **snap** between results, not animate on every keystroke. If it animates while typing, the `isSearching` gate is wrong.
  - DevTools → Animations → playback **10%**: confirm cards follow straight, settled paths with no overshoot and no jitter at the end.
  - DevTools → Performance: record a sort change. Frames should stay at 60fps; layout animation runs on transforms, so there should be no layout thrash in the flame chart.
  - `prefers-reduced-motion: reduce` — cards should snap to their new positions with a fade, no travel.
- **Done when**: a card can be visually tracked through a sort or filter change, search never animates the grid, and a sort change holds 60fps.

## Implementation notes (deviations from the plan as written)

**1. The grid is grouped by category, not one `filteredProjects.map`.** The plan
describes a single grid inside an existing `AnimatePresence`. At `a6425c7` the file
already rendered one `ProjectGrid` per category from `groupedProjects`, with no
`AnimatePresence` around the cards. Only the description was simplified; the keys,
`useDeferredValue` and `isSearching` all matched, so this was not treated as drift.
The target was applied at both levels:
- **Sections:** `LayoutGroup` → `AnimatePresence mode="popLayout"` around the category
  sections. Each section has `layout="position"` and a `duration.press` fade on exit.
  Switching `all` → `architecture` fades the interior section out, and the
  architecture section travels up into its place.
- **Cards:** inside `ProjectGrid`, each branch (grid and list) is a `layout` container
  holding `AnimatePresence mode="popLayout"`, with the target's card wrapper. Both
  branches share a small `renderCards` helper so the wrapper is written once. The card
  components and the class strings are unchanged.

**2. Cards and sections use `layout="position"`, not `layout`.** This is the fix the
plan gives for distortion, applied to the wrapper rather than the inner image. Grid
cards (326×353) and list rows (1041×146) have different aspect ratios. A screenshot
60ms into grid → list showed the image and text squashed across the whole card, not
just the image. With `position`, the size snaps and the card still travels. Within a
grid, sort and filter never change a card's size, so nothing is lost there.
Sections use `position` so their heading is not stretched when the section's height
changes.

**3. `popLayout` parents get `style={{ position: 'relative' }}`.** Motion's docs
require a non-static parent, because exiting children are popped to
`position: absolute`. It is an inline style so the Tailwind class strings stay
untouched.

**4. The search gate also reads the urgent input:**
`hasSearchTerm = searchInput.length > 0 || deferredSearch.length > 0`, with
`animateLayout = !hasSearchTerm`. It is named `hasSearchTerm` so it doesn't collide
with the existing `isSearching` state. With `deferredSearch` alone, the first
keystroke still animated the whole grid: 196 layout transforms were observed.
Motion decides whether to animate from the *previous* render's `layout` prop, and
the deferred value flips in the same render that changes the cards. The urgent input
flips one render earlier. `layoutId` is gated the same way, because a card
re-entering with a live `layoutId` would otherwise morph in.

**5. Cards inherit `initial`/`animate` from their container instead of setting them
explicitly.** An explicit `animate` on a child takes it out of the parent's
`staggerChildren`, which would undo plan 006's entrance stagger. Cards that re-enter
later (for example after clearing a search) still play `enterVariants` from `hidden`.

**6. The local `itemVariants` in `ProjectGrid` was removed.** It was
`y: 20, scale: 0.95, 0.3s easeOut`; cards now use the shared `enterVariants`, as the
target shows.

### Found, not fixed (outside Boundaries)

- **Sorting does nothing in the default `all` view (pre-existing at `a6425c7`).**
  `filteredProjects` starts from `let filtered = allProjects`. With no search and no
  category filter, `filtered.sort()` sorts that array in place and returns the same
  reference, so `groupedProjects`'s `useMemo` never recomputes and the cards keep
  their order. Sorting works once a category or search term creates a new array. The
  one-line fix is `let filtered = [...allProjects]`, but it is inside the "do not
  change the sorting logic" boundary. The sort feel check below was run with the
  `architecture` filter for this reason.
- **`react-hooks/set-state-in-effect` at `projects.tsx` (`setIsSearching` in an
  effect)** is the pre-existing lint error. The fix derives it
  (`searchInput !== deferredSearch`), but the Boundaries protect that state.

## Verification results

Measured by driving headless Chrome (1280×800) over the DevTools protocol against
`bun run dev` on `/projects`, sampling every card's rect and inline transform every
35ms. The in-app preview browser was unavailable.

- **Sort `newest` → `title` (architecture filter): PASS.** All 8 cards travel along
  straight paths through 11–12 distinct rects and settle at about 500ms. For example,
  Bungalow at Bopal goes 112,1153 → 278,795 → 441,444 → 467,390 → 470,383. Every path
  is monotonic, with no overshoot and no jitter at the end.
- **Category `all` → `architecture`: PASS.** Interior cards fade out in about 160ms.
  The architecture section travels 2483 → 2188 → 509 → 389 → 383. `architecture` →
  `all` travels back down the same way.
- **Grid ↔ list: PASS after note 2.** Cards travel to their row or column. Screenshots
  at 60ms and 180ms show no distortion. Before note 2, the 60ms frame was visibly
  squashed.
- **Search typing ("residence" at 70ms per key, then 9 backspaces): PASS after note
  4.** Zero layout transforms on any card while typing. While clearing, only the
  uniform `enterVariants` fade-up plays on returning cards and sections; nothing
  travels.
- **`prefers-reduced-motion: reduce` (emulated): PASS.** On sort, each card has two
  distinct rects (old, then new) and no travel.
- **Frame pacing during sort (dev build, headless, indicative only):** no long tasks.
  Median frame 4–8ms, p95 13–17ms, 1–2 frames over 20ms per sort (the React commit).
  A DevTools Performance recording on real hardware was **NOT RUN**.
- **DevTools 10% playback eye check: NOT RUN.** It needs a human; the rect paths above
  are the numeric stand-in.
- `tsc --noEmit`: clean. `bun run build`: succeeds, including plan 007's changes.
  `bun run lint`: unchanged pre-existing baseline (the error above plus 2
  `opengraph-image` warnings).
