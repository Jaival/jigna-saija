# Jigna Saija Portfolio — v3 Upgrade Plan

- **Base commit**: `a6425c7`
- **Current version**: `2.0.0` (package.json)
- **Target version**: `3.0.0`
- **Stack**: Next.js 16.3, React 19.2, Tailwind CSS v4, Motion 13 (`motion/react`), Radix + Headless UI, next-themes
- **Authored with**: `improve-animations` (audit + plan format), `emil-design-eng` (craft bar), `apple-design` (materials, springs, typography), `find-animation-opportunities` (additive motion), `mobile-native` (platform layer)

---

## 1. What v3 is

v2 added a lot of motion. v3 removes most of it and makes the rest mean something.

The audit below found **264 motion call-sites** across 13 files, **27 infinite decorative loops**, **zero** reduced-motion support for any JS-driven animation, and **six `scale(0)` entrances**. The dominant entrance duration is **600ms** — double the 300ms budget for UI motion. The site is not under-animated; it is animated without a decision behind it.

A second audit — the mobile platform layer — found the site scores **zero on every item** of the `mobile-native` baseline: no tap-highlight suppression, no `touch-action`, no `overscroll-behavior`, no safe-area handling, no `:active` press feedback, `100vh` where the visible viewport is needed, and a `theme-color` for only one colour scheme. On a phone, which is how this audience browses a portfolio, those cost more than any animation does.

v3's thesis, in one line: **delete the decoration, fix the platform layer, and spend the whole motion budget on the two moments that matter — opening a project image, and moving between pages.**

### Non-goals

- No redesign of the information architecture. Same routes, same content, same data files.
- No new dependencies. Everything here ships with Next 16, React 19.2, Motion 13, or Tailwind v4.
- No rewrite of the contact form logic, email transport, or project data.

---

## 2. Audit findings

Every row was re-read at its cited location before being listed. Ordered by leverage (impact ÷ effort).

| # | Severity | Category | Location | Finding | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | **HIGH** | Accessibility | `app/globals.css:371-379` | The only reduced-motion handling is a blanket `animation-duration: 0.01ms !important` on `*`. It does not affect Motion's JS-driven inline transforms — **all 264 motion call-sites animate at full strength for users who asked for less motion** — and for the CSS it does reach, it removes opacity feedback too. `useReducedMotion` appears **0 times** in the codebase. | Plan 002 |
| 2 | **HIGH** | Purpose & frequency | `app/page.tsx:15-71`, `components/hero.tsx:67-102`, `components/aboutMe.tsx` (5), `components/designProcess.tsx` (8), `components/gallery/ImageGallery.tsx` (1) | **27 `repeat: Infinity` loops** driving blurred blobs, rotating squares and pulsing rings that never stop and carry no information. Permanent compositor work on every page, on every device, forever. | Plan 003 |
| 3 | **HIGH** | Easing & duration | 18 × `duration: 0.6`, 8 × `duration: 0.8`, 25 distinct duration values overall; `app/page.tsx:80-86` | Entrances run at 600–800ms against a **300ms budget for UI motion**. The hand-typed curve `[0.25, 0.46, 0.45, 0.94]` (`app/page.tsx:85`) is a weak, built-in-grade ease. No shared easing or duration tokens exist. | Plans 001, 006 |
| 4 | **HIGH** | Physicality | `components/hero.tsx:57`, `:236`, `:323`; `components/aboutMe.tsx:364`, `:373`; `components/designProcess.tsx:37` | Six entrances animate from **`scale: 0`** — nothing in the real world appears from nothing. Four of them add `rotate: -180` / `-90` on top, which reads as a loading spinner, not an arrival. | Plan 004 |
| 5 | **HIGH** | Cohesion | `components/hero.tsx:48-63` and throughout | Four unrelated spring configs (`damping 25/stiffness 120`, `20/150`, `stiffness 300/damping 20`, `400/15`) plus ad-hoc tweens. Nothing is tokenized, so no two components settle the same way. | Plan 001 |
| 6 | **MEDIUM** | Performance | 30 × `transition-all` — `components/contactMe.tsx:97,130,154,177,222,287,354,420,459`, `components/footer.tsx:96`, `app/not-found.tsx:29`, `app/projects/[id]/ProjectPageClient.tsx:225`, … | `transition-all` animates `box-shadow`, `background` and `border-color` off the GPU on every hover, on cards that are hovered constantly. | Plan 005 |
| 7 | **MEDIUM** | Accessibility | 45 × `whileHover`, none capability-gated | Touch taps fire synthetic hover via `pointerenter`, so a tapped gallery thumbnail stays 4% larger and lifted 4px until the next tap elsewhere. Tailwind's `hover:` utilities are **not** affected — v4 gates them behind `@media (hover: hover)` automatically. | Plan 005 |
| 8 | **MEDIUM** | Easing | `components/navBar.tsx:117` | `leave="transition ease-in duration-200"` — `ease-in` on UI is always a finding: it starts slow, delaying exactly the moment the user is watching. | Plan 010 |
| 9 | **MEDIUM** | Interruptibility | `components/gallery/ImageGallery.tsx:346-440` | The lightbox is a fixed-duration tween with `duration: 0.4` plus `delay: 0.3`/`0.4` chains, no drag, no velocity, and two `duration: 0.05` tweens (`:298`, `:337`) that are neither instant nor animated. Spamming next/prev restarts from zero. | Plan 007 |
| 10 | **MEDIUM** | Materials | `components/contactMe.tsx:97,177` — `bg-white/80 backdrop-blur-sm` over the page's gradient wash | Light translucent surfaces stacked on light translucent surfaces: legibility collapses and the depth hierarchy reads as noise. | Plan 011 |
| 11 | **LOW** | Correctness (non-motion) | `app/page.tsx:1-12`, `app/projects/page.tsx`, `app/contact-me/page.tsx` | The home page is `'use client'` purely to host decorative motion, which forced its `export const metadata` to be **commented out** (`app/page.tsx:7-12`). `/`, `/projects` and `/contact-me` ship **no page-level metadata** — only `/projects/[id]` does. | Plan 012 |
| 12 | **HIGH** | Mobile platform | `app/globals.css`, `app/layout.tsx:58-62` | Zero hits for `-webkit-tap-highlight-color`, `touch-action`, `overscroll-behavior` and CSS `:active` across the whole codebase. Every tap paints a grey flash, no element responds until the finger *lifts*, and Android pull-to-refresh fires at the top of any page — which will actively fight the lightbox drag gesture in plan 007. `theme-color` is set for **dark only**, and matched against the OS preference while `next-themes` switches a class, so the status bar can be white over a dark page. | Plan 013 |
| 13 | **HIGH** | Mobile platform | `components/navBar.tsx:31`, `components/BackToTop.tsx:42`, `components/gallery/ImageGallery.tsx:349,423`, `app/layout.tsx:83` | Zero hits for `env(safe-area-inset-*)`. Back-to-Top is pinned at `bottom-8` (32px) — directly on the ~34px iOS home indicator. And `min-h-screen` / `h-screen` compile to `100vh`, the *largest* viewport, so the lightbox image and its counter sit below the fold whenever the URL bar is showing. | Plan 014 |

### Missed opportunities (additive)

| Opportunity | Where | Why it earns its motion |
| --- | --- | --- |
| **Shared-element lightbox** — thumbnail expands into the full image via `layoutId`, dismissed by dragging with velocity | `components/gallery/ImageGallery.tsx` | This is the one interaction an architecture portfolio exists for. It currently crossfades and teleports. Spatial continuity here is worth more than every decorative loop combined. |
| **Cross-page view transitions** — the `/projects` card morphs into the `/projects/[id]` hero | `next.config.js`, `app/projects/**` | Next 16 + React 19.2 ship `<ViewTransition>` with `nav-forward` / `nav-back` transition types. Navigation currently hard-cuts. |
| **Layout animation on filter/sort** | `components/projects.tsx:45-90` | Cards teleport to new positions when the category or sort changes. `layout` explains the rearrangement for free. |
| **Scroll-edge material on the navbar** | `components/navBar.tsx:31-34` | The bar snaps between `bg-transparent` and `glass shadow-lg`. A scroll-edge fade that materializes (blur and scale together) reads as a real surface arriving. |

---

## 3. Execution roadmap

Four phases. Each phase is independently shippable; **do not start a phase before the one above it is merged.**

### Phase 1 — Foundation (blocking)

| Plan | Title | Severity |
| --- | --- | --- |
| [001](plans/001-motion-token-system.md) | Establish the motion token system | HIGH |
| [002](plans/002-reduced-motion-support.md) | Real `prefers-reduced-motion` support | HIGH |
| [013](plans/013-mobile-platform-baseline.md) | Mobile platform baseline and press feedback | HIGH |
| [014](plans/014-safe-areas-and-viewport-units.md) | Safe areas and dynamic viewport units | HIGH |

Everything downstream consumes the tokens from 001 and the hook from 002.

**013 and 014 must ship together.** 013 adds `viewport-fit=cover`, which makes the page paint under the notch and the home indicator; 014 is what pads the content back out. Landing 013 alone puts tap targets under system UI.

### Phase 2 — Subtraction

| Plan | Title | Severity |
| --- | --- | --- |
| [003](plans/003-delete-decorative-loops.md) | Delete the 27 infinite decorative loops | HIGH |
| [004](plans/004-fix-scale-zero-entrances.md) | Fix the six `scale(0)` entrances | HIGH |
| [005](plans/005-transition-all-and-hover-gating.md) | Retire `transition-all`; gate `whileHover` by pointer capability | MEDIUM |
| [006](plans/006-entrance-timing-rebuild.md) | Rebuild entrance timing to the 300ms budget | HIGH |

After Phase 2 the site should feel *quieter and faster*. If it doesn't, stop and re-check before adding anything back.

### Phase 3 — The two moments that matter

| Plan | Title | Severity |
| --- | --- | --- |
| [007](plans/007-lightbox-shared-element.md) | Shared-element lightbox with drag-to-dismiss | Opportunity |
| [008](plans/008-projects-grid-layout-animation.md) | Layout animation on the projects grid | Opportunity |
| [009](plans/009-cross-page-view-transitions.md) | Cross-page view transitions | Opportunity |

### Phase 4 — Surface and correctness

| Plan | Title | Severity |
| --- | --- | --- |
| [010](plans/010-navbar-scroll-edge.md) | Navbar scroll-edge material; fix `ease-in` | MEDIUM |
| [011](plans/011-design-foundations.md) | Typography tracking, palette consolidation, material stacking | MEDIUM |
| [012](plans/012-restore-page-metadata.md) | Restore page-level metadata (server/client split) | LOW |

---

## 4. How to execute

Each file under `plans/` is **self-contained**: exact file paths, current code verbatim, target values, and a feel check. An executing agent needs no other context.

```
Read plans/001-motion-token-system.md and implement it exactly.
Do not touch files outside its Boundaries section.
```

Recommended order is the phase order above. `plans/README.md` tracks status.

### Definition of done for v3

- [x] All 14 plans marked DONE in `plans/README.md` (005, 007, 013, 014 signed off by the owner; their phone checks happen after deploy)
- [x] `bun run lint` and `bun run build` clean (0 lint problems)
- [x] Zero `repeat: Infinity` outside `components/ui/skeleton.tsx`, except loading indicators that plan 003 deliberately kept: `app/loading.tsx` (3) and the per-image spinner in `components/gallery/ImageGallery.tsx`
- [x] Zero `transition-all` in `app/` and `components/`
- [x] Zero `scale: 0` entrances
- [x] Zero `100vh` / `min-h-screen` / `h-screen`
- [x] No UI entrance longer than 300ms (marketing hero copy exempt, with the reason in a comment)
- [x] With `prefers-reduced-motion: reduce` set in DevTools → Rendering, every page is usable, position changes are gone, and opacity feedback remains
- [ ] **On a physical phone** (owner, after deploy): no tap highlight, every control responds on press, no pull-to-refresh, nothing tappable in a system zone in portrait or landscape, status bar matches the page in all four theme/OS combinations
- [x] `package.json` version bumped to `3.0.0`

> The last item cannot be checked from a desktop browser. Chrome's device emulation reproduces none of the platform-layer behaviours — it will report a pass on a broken layout. Real hardware is the bar.

---

## 5. Craft bar

Copied here so the values are never re-derived downstream:

```css
--ease-out:    cubic-bezier(0.23, 1, 0.32, 1);     /* entering, exiting — the default */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);    /* moving/morphing on screen */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);     /* iOS-like drawer curve */
```

| Element | Duration |
| --- | --- |
| Button press feedback | 100–160ms |
| Tooltips, small popovers | 125–200ms |
| Dropdowns, selects | 150–250ms |
| Modals, drawers | 200–500ms |
| Marketing / explanatory | May exceed 300ms, with a reason in a comment |

- Default spring: `{ type: 'spring', bounce: 0, duration: 0.4 }` — critically damped.
- Momentum spring, only after a flick or drag release: `{ type: 'spring', bounce: 0.2, duration: 0.4 }`.
- Never `scale(0)`. Entrances start at `scale: 0.96`.
- Press feedback: `scale(0.97)` over 160ms, fired on **press**, not release.
- Animate `transform` and `opacity` only.
- Stagger is 30–80ms and must never block interaction.
- `ease-in` on UI is always wrong.

### Mobile platform floor

From the `mobile-native` skill. Plans 013 and 014 install this; nothing after them may regress it.

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content" />
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0f172a" />
```

```css
html {
  -webkit-tap-highlight-color: transparent;
  -webkit-text-size-adjust: 100%;
  overscroll-behavior: none;
}
button, a, [role='button'] {
  touch-action: manipulation;
  user-select: none;
}
```

Never ship: `user-scalable=no` or `maximum-scale=1`; `user-select: none` on `body`; `100vh` for an app shell; `100dvh` on a scrolling page (use `svh`); `env(safe-area-inset-*)` without `viewport-fit=cover`; press feedback on `click` only; user-agent sniffing to detect touch; or a verdict of "fixed" reached from device emulation.
