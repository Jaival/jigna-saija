# 010 — Navbar scroll-edge material; fix `ease-in`

- **Status**: DONE
- **Commit**: `a6425c7`
- **Severity**: MEDIUM
- **Category**: Easing + Materials
- **Estimated scope**: 2 files edited, ~40 lines changed
- **Depends on**: plan 001

## Problem

### A. `ease-in` on the mobile menu exit

```tsx
// components/navBar.tsx:113-119 — current
<Transition
  show={isOpen}
  enter="transition ease-out duration-200 transform"
  …
  leave="transition ease-in duration-200 transform"
```

`ease-in` starts slow. On an exit, the slow part is exactly the moment the user is watching — they tapped a link and the menu lingers before committing to leaving. `ease-in` on UI is always a finding; exits use `ease-out` like entrances.

### B. The bar snaps between two states

```tsx
// components/navBar.tsx:31-34 — current
<nav
  className={`fixed top-0 left-0 right-0 z-50 py-2 md:py-4 transition-all duration-300 ${
    isScrolled ? 'glass shadow-lg' : 'bg-transparent'
  }`}
>
```

Two problems:

1. `transition-all` again (see plan 005) — here it is animating `backdrop-filter`, `background`, `border-color` and `box-shadow` simultaneously on every scroll past 20px.
2. `shadow-lg` under a floating bar is a hard boundary. A translucent layer over content should be separated by a **scroll edge** — a short blur/gradient fade where content meets the chrome — not a drop shadow, which reads as a card sitting on the page rather than a material the content passes beneath.

### C. The scroll listener is unthrottled

```tsx
// components/navBar.tsx:22-29 — current
useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 20);
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

A non-passive scroll listener calling `setState` on every scroll event. React bails out when the boolean is unchanged, so this is not catastrophic, but it blocks scroll on the main thread for no reason.

### D. The glass does not materialise

The bar goes from fully transparent to fully frosted in one property change. A glass surface arriving should animate its **blur radius and its opacity together**, so it reads as a material condensing rather than a layer being switched on.

## Target

### A. Symmetric easing

```tsx
/* target — components/navBar.tsx:113-119 */
enter="transition ease-out duration-200 transform"
…
leave="transition ease-out duration-150 transform"
```

The exit is slightly faster than the entrance — the system's response to a deliberate action snaps.

### B. Named properties + scroll edge

```tsx
/* target — components/navBar.tsx:31-34 */
<nav
  data-persistent
  data-scrolled={isScrolled ? '' : undefined}
  className="fixed top-0 left-0 right-0 z-50 py-2 md:py-4 nav-surface"
>
```

```css
/* target — app/globals.css, new utility next to the existing @utility glass block */
@utility nav-surface {
  background: transparent;
  backdrop-filter: blur(0px) saturate(100%);
  transition:
    backdrop-filter 220ms var(--ease-out),
    background-color 220ms var(--ease-out);

  &[data-scrolled] {
    background-color: color-mix(in oklab, var(--color-background) 72%, transparent);
    backdrop-filter: blur(16px) saturate(180%);

    /* Scroll edge: a short fade where content passes under the chrome,
       instead of a drop shadow that reads as a floating card. */
    &::after {
      content: '';
      position: absolute;
      inset: 100% 0 auto 0;
      height: 24px;
      pointer-events: none;
      background: linear-gradient(
        to bottom,
        color-mix(in oklab, var(--color-background) 72%, transparent),
        transparent
      );
      backdrop-filter: blur(4px);
      mask-image: linear-gradient(to bottom, black, transparent);
    }
  }
}
```

Blur stays at 16px — transition-time blur over 20px is expensive, especially in Safari, and this one animates.

Note the bar also needs `position: relative`-style containment for the `::after`; `fixed` already establishes it, so no change is needed.

### C. Passive, throttled listener

```tsx
/* target — components/navBar.tsx:22-29 */
useEffect(() => {
  let frame = 0;
  const handleScroll = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      setIsScrolled(window.scrollY > 20);
      frame = 0;
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => {
    window.removeEventListener('scroll', handleScroll);
    if (frame) cancelAnimationFrame(frame);
  };
}, []);
```

### D. Logo and link hover

```tsx
// components/navBar.tsx:38-41 — current
className="flex items-center group transition-transform duration-200 hover:scale-105"
```

`scale-105` on a logo is a large jump for a constantly-visible element. Reduce to `hover:scale-[1.02]` and shorten to `duration-150`, and let plan 005's `@media (hover: none)` gate handle touch.

Same for the nav icons at line 77: `group-hover:scale-110` → `group-hover:scale-[1.06]`, `duration-200` → `duration-150`.

## Repo conventions to follow

- Custom utilities are declared with Tailwind v4's `@utility` at the top level of `app/globals.css`. Exemplar: the existing `@utility glass { … }` block — copy its nesting style and its use of `color-mix(in oklab, …)`.
- `components/navBar.tsx` is a `'use client'` component using `useState` + `useEffect` + `usePathname`. Keep that structure.
- The mobile menu uses `@headlessui/react`'s `Transition` with Tailwind class strings for enter/leave. Keep it; do not swap it for Motion.
- `data-persistent` on the `<nav>` is also required by plan 009. Adding it here is intentional and harmless if 009 has not landed.

## Steps

1. In `app/globals.css`, add the `@utility nav-surface` block immediately after the existing `@utility glass { … }` block.
2. In `components/navBar.tsx`, replace the `<nav>` opening tag (lines 31-34) per target B.
3. Replace the scroll `useEffect` (lines 22-29) per target C.
4. Change `leave="transition ease-in duration-200 transform"` (line 117) to `leave="transition ease-out duration-150 transform"`.
5. Apply the hover reductions from target D at lines 38-41 and 77.
6. Verify the `isScrolled` variable is still used for the link colour logic at lines 70-75 — it is, and that logic stays unchanged.
7. Run `bun run lint --fix`, then `bun run lint`.

## Boundaries

- Do NOT change the navigation links array, routes, `aria-current`, `aria-label`, or focus-ring classes.
- Do NOT remove the `glass` utility — it is used elsewhere; `nav-surface` is additive.
- Do NOT change the mobile menu's markup or its open/close state logic.
- Do NOT replace Headless UI `Transition` with Motion.
- Do NOT add new dependencies.
- If `lib/motion.ts` / the `--ease-out` token does not exist, STOP — plan 001 must land first.

## Verification

- **Mechanical**:
  - `grep -n "ease-in " components/navBar.tsx` returns nothing (`ease-in-out` is fine if present).
  - `grep -n "transition-all" components/navBar.tsx` returns nothing.
  - `bun run lint` and `bun run build` pass.
- **Feel check** — run `bun run dev`:
  - Scroll down slowly from the top of `/`. The bar should **condense**: the blur builds up alongside the background rather than switching on. There should be no drop shadow — instead a short soft fade below the bar where content passes under it.
  - Scroll back to the top. The material dissolves at the same rate.
  - DevTools → Animations → playback **10%**: confirm the blur and background arrive together, not in sequence.
  - Scroll over a dark project image and confirm the nav text is still legible against the translucent bar in both light and dark theme.
  - Mobile viewport: open the menu, then tap a link. The menu should leave **fast and immediately** — no slow start.
  - DevTools → Performance: record a scroll from top to bottom. The scroll listener should show at most one callback per frame.
  - `prefers-reduced-motion: reduce` — the bar still becomes opaque (that is comprehension, not decoration), it just does so without an animated blur ramp.
- **Done when**: no `ease-in` remains in the navbar, the scrolled state reads as a material rather than a shadowed card, and scrolling costs at most one rAF callback per frame.

## Implementation notes

- **Expected drift from earlier plans, kept as is:**
  - Plan 005 had already replaced the `<nav>`'s `transition-all duration-300` with named properties at 150ms.
  - Plan 014 had added the safe-area `pt-[calc(…env(safe-area-inset-top)…)]` padding.
  - The new `<nav>` keeps plan 014's padding classes and replaces only the transition/`glass shadow-lg` part with `nav-surface`.
  - The logo and icon hovers were already `duration-150` (plan 005), so only the scale values changed.
- **Misquote in this plan:** the "current" block for target A shows `enter="… duration-200 …"`, but at `a6425c7` the enter was already `duration-300`. The target (`duration-200`) was applied.
- **Added reduced-motion handling to `nav-surface`:** under `prefers-reduced-motion: reduce` it transitions only `background-color`, so the blur switches on without a ramp, as the verification section asks. The global reduced-motion rule (plan 002) targets animations, not transitions, so without this the blur would still have ramped.

Found, not fixed (outside Boundaries):

- In the light theme the logo's white "J" strokes nearly vanish against the scrolled bar. The logo asset is white. This was already true with the old `glass` background (92% card-white), and it isn't something the plan's material change introduced.

## Verification results

- `grep -n "ease-in " components/navBar.tsx`: no output. `grep -n "transition-all" components/navBar.tsx`: no output. PASS.
- `tsc --noEmit` is clean and `bun run build` succeeds. `bun run lint` is unchanged from baseline (the pre-existing `projects.tsx` error plus 2 `opengraph-image.tsx` warnings).
- Headless Chrome against the prod build, computed style sampled every animation frame inside the page:
  - **Condense (scroll down):** `backdrop-filter` and `background-color` interpolate together (e.g. `blur(15.3px) saturate(1.77)` at alpha 0.69 in the same frame), settling at `blur(16px) saturate(1.8)` / alpha 0.72.
  - **Dissolve (scroll up):** they fall together frame by frame (10.3px/0.46 → 5.9px/0.27 → 3.2px/0.14 → 0). PASS.
  - `box-shadow` is `none` in both states. The `::after` scroll edge exists (24px) only when `data-scrolled` is set. PASS.
  - **Reduced motion:** `backdrop-filter` jumps to its end value while `background-color` still fades (alpha 0 → 0.47 → 0.72). PASS.
  - **Legibility:** screenshots of the scrolled bar over project images in light and dark themes show legible nav links in both. See the logo note above.
  - **Mobile menu (390×844):** the leave runs 150ms on `cubic-bezier(0.23, 1, 0.32, 1)`. Opacity is at 0.50 about 20ms after the leave starts, with no slow start. The enter runs 200ms on the same curve. PASS.
- **Scroll listener:** passive, and rAF-coalesced by construction (one pending frame at a time, cancelled on unmount). NOT RUN: a DevTools Performance recording on real hardware.
- **NOT RUN:** 10% playback in DevTools. The per-frame samples above stand in for it.
