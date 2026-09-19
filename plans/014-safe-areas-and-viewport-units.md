# 014 — Safe areas and dynamic viewport units

- **Status**: DONE (code complete; on-device checks not run)
- **Commit**: `a6425c7`
- **Severity**: HIGH
- **Category**: Mobile native feel (layout)
- **Estimated scope**: 5 files edited, ~30 lines changed
- **Depends on**: plan 013 (`viewportFit: 'cover'` — without it every `env()` below resolves to `0px`)
- **Source**: `mobile-native` skill — symptom table §3, §7

## Problem

### A. Nothing accounts for the notch or the home indicator

`grep -rn "safe-area\|env(" app components` returns **0 results**.

The site has two fixed-position elements, and both land in a system zone on a modern phone:

```tsx
// components/navBar.tsx:31-34 — current
<nav
  className={`fixed top-0 left-0 right-0 z-50 py-2 md:py-4 transition-all duration-300 ${…}`}
>
```

```tsx
// components/BackToTop.tsx:42 — current
className="fixed bottom-8 right-8 z-50 p-3 rounded-full shadow-lg bg-gradient-brand text-white …"
```

`bottom-8` is 32px. The iOS home indicator zone is ~34px tall. The Back-to-Top button therefore sits **directly on the home indicator**, where a tap is as likely to trigger the system swipe-up as to press the button.

The navbar has the mirror problem at the top: with `viewportFit: 'cover'` from plan 013 the page paints under the Dynamic Island, so the logo and menu button slide beneath it unless the bar pads itself back out.

Note the ordering dependency: **before** plan 013 the page is letterboxed and these zones are filled with the body background — ugly, but not a tap target under the notch. **After** plan 013 they become real collisions. The two plans must ship together or 013 makes this worse.

### B. `100vh` where the app needs the *visible* height

```tsx
// app/layout.tsx:83 — current
className="flex flex-col min-h-screen px-4 sm:px-8 md:px-16 lg:px-20 pt-20 md:pt-28 background"
```

```tsx
// app/page.tsx:87 — current
<div className="relative min-h-screen overflow-hidden">
```

```tsx
// app/projects/[id]/ProjectPageClient.tsx:37 — current
className="min-h-screen"
```

```tsx
// components/gallery/ImageGallery.tsx:349, 423 — current
className="fixed inset-0 w-screen h-screen max-w-none max-h-none min-w-full min-h-full p-6 bg-black/95 …"
className="relative w-full h-full max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)]"
```

Tailwind's `min-h-screen` / `h-screen` compile to `100vh`, which on mobile is the **largest** viewport — the height with the browser chrome collapsed. On page load the URL bar is visible, so a `100vh` element overflows by the height of that bar.

The lightbox is the worst case: it is a full-screen app shell pinned to the viewport, sized with `h-screen` and `max-h-[calc(100vh-3rem)]`. On an iPhone with the URL bar showing, the image is sized for a viewport taller than the one it is in, so the bottom of the image and the image counter at `components/gallery/ImageGallery.tsx:403-410` sit below the fold.

## Target

### A. Safe-area padding on the two fixed elements

```tsx
/* target — components/navBar.tsx, the <nav> element */
className="fixed top-0 left-0 right-0 z-50 py-2 md:py-4 pt-[env(safe-area-inset-top,0px)] nav-surface"
```

If plan 010 has already landed, the class list is `… nav-surface`; add the `pt-[env(...)]` to whatever is there. The inner container also needs horizontal insets for landscape, where the notch moves to the side:

```tsx
/* target — components/navBar.tsx:36, the inner max-w container */
className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ps-[max(1rem,env(safe-area-inset-left,0px))] pe-[max(1rem,env(safe-area-inset-right,0px))]"
```

```tsx
/* target — components/BackToTop.tsx:42 */
className="fixed right-8 z-50 p-3 rounded-full shadow-lg bg-gradient-brand text-white hover:shadow-xl transition-shadow duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bottom-[calc(2rem+env(safe-area-inset-bottom,0px))]"
```

Always give `env()` a fallback (`, 0px`) when it appears inside `calc()` or `max()` — without it the whole expression is invalid on browsers that do not support the function.

The lightbox needs bottom inset too, because its image counter is pinned to the bottom:

```tsx
/* target — components/gallery/ImageGallery.tsx, the image counter at line 407 */
className="absolute left-1/2 -translate-x-1/2 z-50 bg-black/60 text-white px-6 py-3 rounded-2xl text-sm font-medium backdrop-blur-md border border-white/20 shadow-lg bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
```

### B. The right viewport unit per case

The choice is not "replace `vh` with `dvh`" — the two units are for different jobs:

- **`dvh`** resizes as the URL bar collapses. Correct for an app shell or a pinned overlay that should always track the visible area.
- **`svh`** is the *smallest* the viewport gets, so it never overflows and never shifts mid-scroll. Correct for a hero or a page-height container on scrolling content — `dvh` there would cause a layout shift as the user scrolls and the chrome collapses.

| Location | Current | Target | Why |
| --- | --- | --- | --- |
| `components/gallery/ImageGallery.tsx:349` | `h-screen … min-h-full` | `h-dvh min-h-dvh` | Pinned full-screen overlay — must track the visible area. |
| `components/gallery/ImageGallery.tsx:423` | `max-h-[calc(100vh-3rem)]` | `max-h-[calc(100dvh-3rem)]` | Same overlay; the image must fit the visible height. |
| `app/layout.tsx:83` | `min-h-screen` | `min-h-svh` | Scrolling document — `svh` is stable, `dvh` would shift the footer mid-scroll. |
| `app/page.tsx:87` | `min-h-screen` | `min-h-svh` | Same. |
| `app/projects/[id]/ProjectPageClient.tsx:37` | `min-h-screen` | `min-h-svh` | Same. |
| `components/ui/toast.tsx:19` | `max-h-screen` | `max-h-dvh` | Fixed viewport-pinned overlay. |

Tailwind v4 ships `dvh` / `svh` / `lvh` variants (`h-dvh`, `min-h-svh`, `max-h-dvh`) out of the box — no config or arbitrary-value syntax needed.

`lvh` is the old `100vh` behaviour. Do not use it.

## Repo conventions to follow

- Arbitrary values are already used inline in this codebase. Exemplar: `components/gallery/ImageGallery.tsx:423` uses `max-w-[calc(100vw-3rem)]`, and `components/navBar.tsx:69` uses `min-h-[44px]`. Match that style rather than adding CSS classes.
- Logical properties (`ps-` / `pe-`) are preferred over `pl-` / `pr-` for the landscape insets so RTL keeps working; the rest of the file uses physical properties, so this is the one deliberate exception — note it in a comment.
- Fixed overlays set `z-50` and live in `components/`. Exemplar: `components/BackToTop.tsx:42`.

## Steps

1. Confirm plan 013 has landed — `grep -n "viewportFit" app/layout.tsx` must return a match. If it does not, STOP; every `env()` in this plan would silently resolve to `0px` and you would be unable to verify the work.
2. Apply the safe-area targets from section A to `components/navBar.tsx` (two places), `components/BackToTop.tsx` and `components/gallery/ImageGallery.tsx`.
3. Apply every row of the table in section B.
4. Run `bun run lint`, then `bun run build`.

## Boundaries

- Do NOT apply `env(safe-area-inset-*)` to normal page content. Only fixed/absolute chrome — the navbar, the Back-to-Top button, the lightbox counter. Page content inherits the spacing through the navbar's padding.
- Do NOT replace `w-screen` with `w-dvw` — horizontal viewport units do not have the URL-bar problem and `dvw` can introduce its own scrollbar rounding issues.
- Do NOT use `lvh` anywhere.
- Do NOT change the navbar's scroll behaviour, the Back-to-Top scroll handler, or the lightbox's open/close logic.
- Do NOT add a `100vh` fallback line — this project targets modern browsers and `dvh`/`svh` are supported across all of them.
- Do NOT add new dependencies.

## Verification

- **Mechanical**:
  - `grep -rn "min-h-screen\|h-screen\|100vh" app components` returns nothing.
  - `grep -rn "env(safe-area-inset" app components` returns at least four matches.
  - `bun run lint` and `bun run build` pass.
- **Real hardware — mandatory.** Safe areas are `0px` in every desktop browser and the URL-bar effect on `vh` does not exist there. Emulation will show you a passing result on a broken layout. On a notched phone (iPhone X or later, or a modern Android with a cutout), via `bun run dev --hostname 0.0.0.0` and the LAN IP:
  - **Portrait, page at the top**: the navbar logo and menu button must sit fully below the notch / Dynamic Island, not under it. The translucent bar itself *should* extend up behind it — that is the point of `viewport-fit=cover`.
  - Scroll to the bottom of `/projects`. The Back-to-Top button must sit clearly **above** the home indicator. Try to tap it five times in a row; none of the taps should trigger the system swipe-up gesture.
  - **Rotate to landscape.** The navbar contents must not slide under the side notch.
  - Open a gallery image. The image and the `N / M` counter must both be fully visible **with the URL bar showing**, before you scroll. This is the exact case `100vh` was getting wrong.
  - Scroll down a project page so the URL bar collapses, then scroll back up so it reappears. The footer must not jump — that is the `svh` choice doing its job. If it jumps, something was set to `dvh` that should be `svh`.
  - Open the contact form and focus a field so the software keyboard appears. On Android the layout should shrink to the remaining space (this is `interactiveWidget` from plan 013); the submit button must remain reachable.
  - Install as a PWA / add to home screen if that is a target, and repeat the notch and home-indicator checks — standalone mode changes the insets.
- **Done when**: no interactive element sits in a system zone in portrait or landscape, the lightbox fits the visible viewport with the URL bar showing, and scrolling does not shift the page height — all confirmed on a physical notched phone.

## Implementation notes (deviations from the plan as written)

**The navbar safe-area utilities had to be additive, not replacements.** Section A's
target class lists are wrong in a way that only shows on desktop:

- `py-2 md:py-4 pt-[env(safe-area-inset-top,0px)]` — Tailwind emits `pt-*` *after*
  `py-*` (verified: `.py-2` at byte 41464, `.pt-[calc(…)]` at 42183 in the built
  stylesheet; same ordering at the `md:` breakpoint). So the bare `env()` would win
  and collapse the navbar's top padding to **0** on every device where the inset is
  `0px` — i.e. all desktops.
- `ps-[max(1rem,env(…))]` has the same problem against `sm:px-6 lg:px-8`:
  `padding-inline-start` is emitted after `padding-inline`, so a flat `max(1rem, …)`
  would drop the navbar's responsive horizontal padding from 1.5rem/2rem to 1rem.

Shipped instead:

```tsx
/* <nav> */
py-2 md:py-4
pt-[calc(0.5rem+env(safe-area-inset-top,0px))]
md:pt-[calc(1rem+env(safe-area-inset-top,0px))]

/* inner container */
px-4 sm:px-6 lg:px-8
ps-[max(1rem,env(safe-area-inset-left,0px))]   pe-[max(1rem,env(safe-area-inset-right,0px))]
sm:ps-[max(1.5rem,env(safe-area-inset-left,0px))] sm:pe-[max(1.5rem,env(safe-area-inset-right,0px))]
lg:ps-[max(2rem,env(safe-area-inset-left,0px))]   lg:pe-[max(2rem,env(safe-area-inset-right,0px))]
```

Same result on a notched phone, no regression anywhere else.

Also applied from the section A target verbatim: `BackToTop.tsx`'s shadow transition
went `duration-200` → `duration-150 ease-out`. That is a timing change, not a safe-area
one — it was carried in the plan's target string. It is inside the craft bar, so it
stayed.

## Verification results

- `grep -rn "min-h-screen\|h-screen\|100vh" app components` → no matches.
- `grep -rn "env(safe-area-inset" app components` → 5 matches across 4 files.
- `bun run build`: succeeds, no warnings. `tsc --noEmit`: clean.
- `bun run lint`: unchanged pre-existing baseline.
- **Real-hardware checks: NOT RUN — no physical notched phone available.** Safe areas
  are `0px` and the URL-bar effect on `vh` does not exist in any desktop browser, so
  none of the portrait/landscape/home-indicator/lightbox-fit checks have been
  observed. See the Status line.

## Sign-off

Marked DONE by the owner on 2026-09-19 so v3 can ship. The physical-phone checks in this plan's Verification section were not run by the executor; the owner will run them on their own phone against the deployed build. Anything that fails there should reopen this plan.
