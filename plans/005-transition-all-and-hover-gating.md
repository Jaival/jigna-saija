# 005 — Retire `transition-all`; gate hover behind `hover: hover`

- **Status**: DONE (code complete; sticky-hover check not run on a phone)
- **Commit**: `a6425c7`
- **Severity**: MEDIUM
- **Category**: Performance + Accessibility
- **Estimated scope**: ~10 files edited, ~40 lines changed

## Problem

### A. `transition-all` × 30

`transition-all` animates every animatable property, including `box-shadow`, `background-color`, `border-color`, `width` and `height`. Shadow and background transitions run on the main thread through paint, not on the compositor. These sit on the most-hovered elements on the site.

```tsx
// components/contactMe.tsx:97 — current
<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 group">
```

```tsx
// components/contactMe.tsx:130 — current
className="p-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 group"
```

```tsx
// app/projects/[id]/ProjectPageClient.tsx:225 — current
className="inline-flex items-center gap-3 px-8 py-4 bg-button-blue hover:bg-honolulu-blue text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
```

```tsx
// app/not-found.tsx:29 — current
className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 dark:from-blue-500 dark:to-teal-400 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
```

Full list of `transition-all` sites: `components/contactMe.tsx:97, 130, 154, 177, 222, 287, 354, 420, 459`; `components/footer.tsx:96`; `app/not-found.tsx:29`; `app/projects/[id]/ProjectPageClient.tsx:225`; plus the remainder found by `grep -rn "transition-all" app components` (30 total).

Several also run at `duration-300`, at the top of the budget for a hover — hover feedback should be closer to `150ms`.

### B. Ungated hover — **JavaScript only**

On a touch device a tap fires a synthetic hover. The element the visitor just tapped stays stuck in its hovered state — scaled up, shadow raised — until they tap somewhere else. This portfolio's audience browses on phones.

**Important scoping correction:** this project is on **Tailwind CSS v4**, where the `hover:` variant already compiles to `@media (hover: hover)` by default (this replaced v3's opt-in `future.hoverOnlyWhenSupported`). So every Tailwind `hover:scale-*` / `hover:shadow-*` utility in this codebase is **already gated** and needs no change. Do not add a CSS override for them — it would be dead code.

The real gap is JavaScript. Motion's `whileHover` fires on `pointerenter`, which a touch tap triggers. There are **45 `whileHover` props** across `app/` and `components/` and none of them are capability-gated. The worst offenders are the ones that scale:

```tsx
// components/BackToTop.tsx:39-40 — current
whileHover={{ scale: 1.1 }}
whileTap={{ scale: 0.9 }}
```

```tsx
// components/gallery/ImageGallery.tsx:252-260 — current
whileHover={{
  scale: 1.04,
  y: -4,
  zIndex: 10,
}}
```

A tapped gallery thumbnail stays 4% larger and lifted 4px until the next tap somewhere else.

## Target

### A. Name the properties, shorten the duration

Replace `transition-all duration-300` with an explicit property list at `duration-150`:

```tsx
/* target — components/contactMe.tsx:97 */
<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-150 ease-out group">
```

Mapping to apply at each site — pick the narrowest utility that covers what actually changes on hover:

| What changes on hover | Replace `transition-all` with |
| --- | --- |
| shadow only | `transition-shadow duration-150 ease-out` |
| transform (scale/translate) only | `transition-transform duration-150 ease-out` |
| colour / background / border only | `transition-colors duration-150 ease-out` |
| opacity only | `transition-opacity duration-150 ease-out` |
| transform **and** shadow | `transition-[transform,box-shadow] duration-150 ease-out` |
| transform **and** colour | `transition-[transform,color,background-color] duration-150 ease-out` |

Form inputs (`components/contactMe.tsx:222, 287, 354, 420`) change border colour and ring on focus — use `transition-colors duration-150 ease-out`.

> `ease-out` now resolves to `cubic-bezier(0.23, 1, 0.32, 1)` because plan 001 overrode the token. Adding it explicitly is cheap and makes the intent readable.

### B. Gate `whileHover` behind a capability query

Tailwind's `hover:` utilities need **no change** — v4 gates them already (see Problem §B). Add no CSS for this.

Motion's `whileHover` is the part that is not gated. Fire it only when the device has a real pointer:

```tsx
/* target — add to lib/motion.ts (created by plan 001) */

/** True when the device has a real pointer. Hover motion should be gated on this. */
export function useHasHover() {
  const [hasHover, setHasHover] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setHasHover(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setHasHover(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return hasHover;
}
```

Apply it to every `whileHover` that moves the element (`scale`, `x`, `y`, `rotate`). The three highest-traffic surfaces are mandatory; the rest follow the same pattern:

```tsx
/* target — pattern, e.g. components/projects.tsx card wrapper */
const hasHover = useHasHover();
…
<motion.div whileHover={hasHover ? { scale: 1.02 } : undefined} …>
```

| File | Line | Current `whileHover` |
| --- | --- | --- |
| `components/gallery/ImageGallery.tsx` | 252-256 | `{ scale: 1.04, y: -4, zIndex: 10 }` |
| `components/BackToTop.tsx` | 39 | `{ scale: 1.1 }` |
| `components/projects.tsx` | card wrapper | scale on the project card |

A `whileHover` that only changes `opacity` or a colour can stay ungated — a stuck fade is invisible; a stuck scale is not.

## Repo conventions to follow

- Tailwind utility strings are written inline in `className`; there is no `cva` variant layer for these cards. Keep edits inline.
- `cn()` from `@/lib/utils` is used when class strings are conditional. Exemplar: `components/ui/button.tsx`.
- Global CSS additions go inside `@layer base` in `app/globals.css`. Exemplar: the existing `*:focus-visible` block at `app/globals.css:320-323`.
- Client hooks live alongside the values they serve; `lib/motion.ts` already holds motion constants, so `useHasHover` belongs there. It will need `'use client';` at the top of `lib/motion.ts` and `import { useEffect, useState } from 'react';`.

## Steps

1. Run `grep -rn "transition-all" app components` to get the full list of 30 sites.
2. For each site, read what actually changes on `hover:` / `focus:` in that same class string and replace `transition-all duration-*` using the mapping table above. Where the original duration was `duration-300` or longer, use `duration-150`; where it was already `duration-200`, use `duration-150`.
3. Add `'use client';` to the top of `lib/motion.ts`, add `import { useEffect, useState } from 'react';`, and append the `useHasHover` hook from section B.
4. Gate every movement `whileHover` behind `useHasHover()`, starting with the three rows in the table in section B. Run `grep -rn "whileHover" app components` to find the rest.
5. Run `bun run lint --fix`, then `bun run lint`.

## Boundaries

- Do NOT add any `@media (hover: none)` or `@media (hover: hover)` CSS for Tailwind utilities. Tailwind v4 gates `hover:` already; adding it would be dead code.
- Do NOT remove hover feedback — colour, shadow and opacity changes stay on all devices. Only hover-driven **movement** is gated.
- Do NOT change `focus-visible` styles or the focus ring.
- Do NOT touch the form submission logic in `components/contactMe.tsx` or `app/actions/contact.ts`.
- Do NOT gate `whileTap` — press feedback is correct on touch, and plan 013 depends on it.
- Do NOT add new dependencies.
- If `lib/motion.ts` does not exist, STOP — plan 001 must land first.

## Verification

- **Mechanical**:
  - `grep -rn "transition-all" app components` returns nothing.
  - `grep -rn "hover: hover" lib` returns the `useHasHover` hook. `grep -rn "hover: none" app components` returns **nothing**.
  - `bun run lint` and `bun run build` pass.
- **Feel check**:
  - Desktop: hover a project card and a contact card. The shadow and scale should respond immediately and settle fast — noticeably quicker than before.
  - DevTools → Rendering → **Paint flashing** on: hovering a card should flash a small region, not repaint large areas. Hovering a `transition-transform`-only element should flash nothing.
  - **Real hardware required.** Sticky hover does not reproduce in Chrome's device emulation — testing there will tell you it is fixed when it is not. Run the dev server on `0.0.0.0`, open it on a phone by LAN IP, then tap a project card, a gallery thumbnail and the Back-to-Top button, and confirm none of them stays enlarged after your finger lifts.
- **Done when**: no `transition-all` remains, hover feedback is ≤150ms, and no card retains a hovered appearance after a tap on a touch device.

## Implementation notes (deviations from the plan as written)

**1. `useHasHover` uses `useSyncExternalStore`, not `useState` + `useEffect`.**
The hook as written in section B trips this repo's own lint rule
(`react-hooks/set-state-in-effect`) on the synchronous `setHasHover(mq.matches)`
in the effect body — it introduced a *new* lint error where there had been none.
`useSyncExternalStore` is the React 19 idiom for exactly this (subscribe to an
external store, read a snapshot) and it is lint-clean:

```ts
const HOVER_QUERY = '(hover: hover) and (pointer: fine)';
function subscribeToHover(onChange: () => void) { … }
const getHoverSnapshot = () => window.matchMedia(HOVER_QUERY).matches;
const getHoverServerSnapshot = () => false;   // SSR and first paint agree
export function useHasHover() {
  return useSyncExternalStore(subscribeToHover, getHoverSnapshot, getHoverServerSnapshot);
}
```

Same media query, same semantics.

**2. `components/hero.tsx`'s "See Projects" `<Link>` lost its transition entirely
rather than getting a narrower one.** Nothing on that element changes on hover —
the hover lives on the parent `motion.div`. `transition-all duration-300` there
was animating nothing. The mapping table has no row for "nothing changes"; the
right answer was to delete it.

**3. Every *other* narrow transition was also normalised to 150ms.** The Steps
only cover `transition-all` sites, but the Done-when says "hover feedback is
≤150ms", and a browser audit found 71 elements still transitioning at 200–500ms
through pre-existing `transition-colors duration-200` / `transition-opacity
duration-300` utilities. 25 such sites across 12 files were moved to
`duration-150`.

**4. `components/projects.tsx` image zoom went 700ms → 150ms.** Step 2 is explicit
("where the original duration was `duration-300` or longer, use `duration-150`"),
so the rule was applied. Flagging it because a 110% Ken-Burns zoom at 150ms is a
much harder, snappier effect than the original — this is the one site in this plan
where the mechanical rule may have overshot the intent. Worth a look during the
Phase 4 surface pass.

## Verification results

- `grep -rn "transition-all" app components` → nothing.
- Browser audit on `/projects`: **0** elements with a real (non-zero-duration)
  `transition-property: all`; 148 transitioning elements, all with named
  properties; longest remaining duration **0.16s**.
- `grep -rn "hover: hover" lib` → the hook. `grep -rn "hover: none" app components`
  → nothing (no dead CSS added, per the plan's boundary).
- **42 of 45 `whileHover` props gated.** The 3 left ungated are opacity-only
  (`ImageGallery.tsx:299, 338`, `hero.tsx:188`), which the plan says to leave —
  a stuck fade is invisible.
- `(hover: hover) and (pointer: fine)` confirmed present in the shipped client bundle.
- `tsc --noEmit`: clean. `bun run build`: succeeds. `bun run lint`: back to the
  pre-existing baseline (the new error introduced by the plan's hook is gone).
- **Sticky hover on a phone: NOT VERIFIED.** No physical device. Attempts to drive
  Motion's hover with synthetic `PointerEvent`s did not fire it, so even the
  desktop half could not be confirmed by automation. The gating is correct by
  construction — `whileHover={undefined}` disables hover motion outright — but
  "no card stays enlarged after a tap" has not been observed.

## Sign-off

Marked DONE by the owner on 2026-09-19 so v3 can ship. The physical-phone checks in this plan's Verification section were not run by the executor; the owner will run them on their own phone against the deployed build. Anything that fails there should reopen this plan.
