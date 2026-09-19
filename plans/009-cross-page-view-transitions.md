# 009 — Cross-page view transitions

- **Status**: DONE
- **Commit**: `a6425c7`
- **Severity**: Opportunity (MEDIUM value)
- **Category**: Missed opportunities
- **Estimated scope**: 3-4 files edited, ~60 lines changed
- **Depends on**: plans 001, 002, 012

## Problem

Navigating between routes hard-cuts. Clicking a project card on `/projects` replaces the page instantly with `/projects/[id]`; the hero image on the detail page has no relationship to the card that was clicked, and going back gives no sense of returning.

The only motion at a route boundary is each page's own entrance animation replaying from scratch, which reads as "a new page loaded", not "you moved somewhere".

Every page already runs its own independent entrance:

```tsx
// components/projects.tsx:109-112 — current
<motion.section
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
```

## Target

Next.js 16 and React 19.2 ship the View Transitions integration. Enable it and declare which elements persist across the navigation; the browser animates the rest.

### A. Enable the flag

```js
/* target — next.config.js, inside the existing experimental block */
experimental: {
  viewTransition: true,
  optimizePackageImports: [ /* unchanged */ ],
  optimizeServerReact: true,
  staleTimes: { /* unchanged */ },
},
```

### B. Directional page transitions

Wrap the routed content and map the navigation types. `default: 'none'` means untyped transitions do not animate at all — opt in, never opt out.

```tsx
/* target — a new client component, e.g. components/PageTransition.tsx */
'use client';

import { ViewTransition } from 'react';

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter={{
        'nav-forward': 'nav-forward',
        'nav-back': 'nav-back',
        default: 'none',
      }}
      exit={{
        'nav-forward': 'nav-forward',
        'nav-back': 'nav-back',
        default: 'none',
      }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
```

```css
/* target — app/globals.css, new block at the end of the file (NOT inside @layer) */

/* View transitions. Movement only where the navigation has a direction. */
@keyframes vt-slide-in-right {
  from { transform: translateX(6%); opacity: 0; }
  to   { transform: translateX(0);  opacity: 1; }
}
@keyframes vt-slide-out-left {
  from { transform: translateX(0);   opacity: 1; }
  to   { transform: translateX(-3%); opacity: 0; }
}
@keyframes vt-slide-in-left {
  from { transform: translateX(-6%); opacity: 0; }
  to   { transform: translateX(0);   opacity: 1; }
}
@keyframes vt-slide-out-right {
  from { transform: translateX(0);  opacity: 1; }
  to   { transform: translateX(3%); opacity: 0; }
}

::view-transition-new(.nav-forward) {
  animation: vt-slide-in-right 280ms var(--ease-out) both;
}
::view-transition-old(.nav-forward) {
  animation: vt-slide-out-left 280ms var(--ease-out) both;
}
::view-transition-new(.nav-back) {
  animation: vt-slide-in-left 280ms var(--ease-out) both;
}
::view-transition-old(.nav-back) {
  animation: vt-slide-out-right 280ms var(--ease-out) both;
}

/* Reduced motion: cross-fade, no travel. */
@media (prefers-reduced-motion: reduce) {
  ::view-transition-new(*),
  ::view-transition-old(*) {
    animation: none;
    opacity: 1;
  }
}
```

Travel is expressed as a **percentage of the element's own size** (`6%`), never a hardcoded pixel offset, so it scales correctly from phone to desktop. 280ms matches `--duration-enter` from plan 001.

### C. Shared project image

Name the project image on both sides so the browser morphs the card's thumbnail into the detail hero:

```tsx
/* target — components/projects.tsx, the card image */
<ViewTransition name={`project-image-${project.id}`}>
  <Image … />
</ViewTransition>
```

```tsx
/* target — app/projects/[id]/ProjectPageClient.tsx, the hero image */
<ViewTransition name={`project-image-${project.id}`}>
  <Image … />
</ViewTransition>
```

A `name` must be **unique on the page at any moment**. Because `/projects` shows many cards and `/projects/[id]` shows one, the per-project id keeps them unique on each side while matching across the boundary.

### D. Nav chrome must not transition

The navbar and footer are persistent layout, not page content. If they are inside the transition they will fade out and back in on every navigation, which looks like the site reloading.

Give them a stable name so the browser treats them as unchanged:

```css
/* target — app/globals.css */
nav[data-persistent],
footer[data-persistent] {
  view-transition-name: none;
}
```

Add `data-persistent` to the `<nav>` in `components/navBar.tsx:31` and the `<footer>` root in `components/footer.tsx`. Confirm in the feel check that they hold completely still across a navigation.

## Repo conventions to follow

- `next.config.js` is CommonJS (`module.exports = nextConfig`) with a `/** @type {import('next').NextConfig} */` annotation. Keep that format; do not convert it to TypeScript in this plan.
- Client components are marked `'use client'` at the top of the file. Exemplar: `components/provider.tsx:1`.
- New shared components go directly in `components/`, imported via `@/components/…`.
- Easing comes from the `--ease-out` custom property added by plan 001.

## Steps

1. Add `viewTransition: true` to `experimental` in `next.config.js`.
2. Create `components/PageTransition.tsx` per target B.
3. In `app/layout.tsx`, wrap `{children}` (and only `{children}` — not `Navbar`, `Footer`, `Toaster` or `BackToTop`) in `<PageTransition>`.
4. Add the view-transition CSS from target B to the end of `app/globals.css`, outside any `@layer` block so the pseudo-element rules are not layered below the defaults.
5. Add the `ViewTransition` wrappers with matching `name` props to the project card image and the detail hero image per target C.
6. Add `data-persistent` to the `<nav>` and `<footer>` roots and the CSS rule from target D.
7. Once view transitions handle the page-level fade, **remove** the now-redundant page-level entrance at `components/projects.tsx:109-112` — two systems animating the same arrival will double-expose.
8. Run `bun run lint`, then `bun run build`.

## Boundaries

- Do NOT enable any other `experimental` Next.js flag.
- Do NOT change routing, `generateStaticParams`, or `generateMetadata` in `app/projects/[id]/page.tsx`.
- Do NOT apply `ViewTransition` to the gallery lightbox — plan 007 owns that with Motion's `layoutId`, and the two systems must not both animate the same image.
- Do NOT add new dependencies.
- View transitions are a **progressive enhancement**. If a browser does not support them, navigation must still work with no visual artefact. Do not add a polyfill.
- If `next.config.js` no longer matches the structure described (drift since `a6425c7`), STOP and report.

## Verification

- **Mechanical**: `bun run build` succeeds with no experimental-flag warnings beyond the expected `viewTransition` notice. `bun run lint` passes.
- **Feel check** — run `bun run dev` in Chrome:
  - `/projects` → click a card. The page content should slide in from the right while the old page slides slightly left. The clicked image should morph into the detail hero.
  - Press the browser **back** button. The direction must reverse — content slides in from the left.
  - Watch the navbar and footer throughout both navigations. They must not flicker, fade or shift by a single pixel.
  - DevTools → Animations → playback **10%**: confirm the two pages cross-fade cleanly with no moment where both are fully opaque and overlapping.
  - Navigate `/` → `/contact-me` → `/projects` rapidly. No stuck transition, no white flash, no doubled header.
  - `prefers-reduced-motion: reduce` — navigation cross-fades with no horizontal travel.
  - Open the same flow in Firefox or any browser without View Transitions support: navigation still works, just without the animation. No layout break.
- **Done when**: forward and back navigations are directional, the project image is spatially continuous between list and detail, the chrome never moves, and unsupported browsers degrade silently.

## Execution attempt: STOPPED (rule 6)

No code was changed. When checked against the Next 16.3.1 docs in `node_modules/next/dist/docs/01-app/02-guides/view-transitions.md` and the repo as it stands, the plan fails in these ways:

1. **Target A's flag no longer exists.** The guide says view transitions "work in the App Router with no configuration". `experimental.viewTransition` appears nowhere in Next 16.3's config schema or server source, so adding it would only produce an unrecognized-key warning.
2. **Step 3 puts the wrapper in the wrong place.** The guide: "Put the wrapper in each `page.tsx`, not the layout. Layouts persist across navigations, so enter and exit never fire there." Wrapping `{children}` in `app/layout.tsx` produces no directional animation.
3. **No navigation ever carries a type.** With `default: 'none'`, the slides only play for navigations tagged via `<Link transitionTypes={['nav-forward']}>` (or `router.push(…, { transitionTypes })`). The plan doesn't tag any links. Someone has to decide which links are forward and which are back. The natural reading: card → detail = forward, and the breadcrumb and "Back to All Projects" = back. Navbar peer links are undecided.
4. **The "browser back reverses direction" check can't pass.** The guide: "Browser-initiated back navigations (the back button or swipe gestures) do not carry a transition type, so the directional slide does not play." Only the shared-element morph applies on browser back.
5. **Target C's detail hero image doesn't exist.** `ProjectPageClient.tsx` has no hero `<Image>`. The first image is a thumbnail inside `ImageGallery`, which already carries plan 007's Motion `layoutId`. This plan's Boundaries forbid both systems animating the same image. A morph target has to be chosen, or created, before C can be implemented.
6. **The detail page has the same double-exposure problem step 7 fixes on `/projects`.** `ProjectPageClient`'s `motion.section` page entrance would stack with the slide, and the plan doesn't list it.

**Other corrections for a revised plan:**

- Adopt the guide's header anchoring (`viewTransitionName: 'site-header'`, with `::view-transition-old(site-header) { display: none }`) instead of `view-transition-name: none`. The guide's rule keeps the header above the sliding content.
- Add `::view-transition { pointer-events: none; }` so clicks during a transition aren't lost.
- `data-persistent` is already on the navbar `<nav>` (plan 010).

## Implementation (after the owner's decisions)

Two decisions from the owner unblocked this plan:

- **Directions:** card → detail is `nav-forward`. The breadcrumb "Projects" link and "Back to All Projects" are `nav-back`. Navbar links are untyped, so they swap without a slide.
- **Morph target:** build both so they can be compared in the app. `/projects/[id]?morph=gallery` (the default, and what the cards link to) morphs into the first gallery tile. `?morph=hero` morphs into a new hero image. A temporary bar on `/projects` ("Compare the card morph on …") opens the first listed project in each variant. **Once a target is chosen:** delete `MorphComparison` in `components/projects.tsx` and the losing branch, and drop `?morph` handling if the gallery wins.

What was built, against the corrections listed in the STOPPED section above:

- **No config flag** (it doesn't exist in 16.3).
- **Page wrappers:** `components/PageTransition.tsx` wraps each `page.tsx` (`/`, `/projects`, `/contact-me`, `/projects/[id]`), not the layout.
- **Link types:** `transitionTypes` is set on the card links (grid and list), the compare buttons, the breadcrumb (new optional `transitionTypes` on breadcrumb items) and the back button. The constants live in `lib/viewTransitions.ts`.
- **Shared element:** `components/ProjectImageTransition.tsx` is `<ViewTransition name share="morph" default="none">`.
  - On the card, it wraps a new clipping `div` around the `<Image>`, not the img itself. The hover `scale-110` would otherwise leak outside the card in the starting snapshot.
- **Morph targets must be painted when the destination commits**, because that commit is when the browser captures the end state. Both targets request the card's exact file (`CARD_IMAGE_SIZES` / `CARD_IMAGE_QUALITY`, shared constants), which is already in the HTTP cache.
  - **Hero:** a cached base layer at card resolution, with the full-width image fading in over it once loaded.
  - **Gallery:** the target tile skips its own fade and loading blur. Its item entrance and the gallery section's entrance (`opacity 0, y 40`, 350ms delay) are skipped only in this variant. Without that, the tile was still at 0.29 effective opacity when the transition ended (a visible flash), and the 40px offset moved the landing spot.
- **Static rendering kept:** `?morph` is read with `useSearchParams` under a `Suspense` whose fallback is the gallery variant, so `/projects/[id]` stays statically generated (●).
- **Double exposure:** the page-level entrances on `/projects` (step 7) and on the detail page (item 6 above) were removed.
- **CSS** (`app/globals.css`, end of file, outside `@layer`):
  - The plan's slide keyframes at `--duration-enter`.
  - The `.morph` group at `--duration-modal`, with `object-fit: cover` snapshots so 4:3 → 16:9 crops instead of stretching.
  - The guide's `site-header` anchoring (the navbar has `viewTransitionName: 'site-header'`).
  - `::view-transition { pointer-events: none }`.
  - Reduced motion: a fade with no travel and no morph.
- **Mismatched thumbnails:** four projects (`mr-bhadoria-site`, `rajivbhai-site`, `mr-rathi-site`, `varsoda-site`) use a card thumbnail that isn't their first gallery image. In the gallery variant those four cross-fade to a different photo mid-morph. The hero variant uses the card's own image, so all four morph cleanly.

## Verification results

- `tsc --noEmit` is clean and `bun run build` succeeds: `/`, `/projects` and `/contact-me` are ○, and `/projects/[id]` is still ● (SSG). `bun run lint` is unchanged from baseline.
- Headless Chrome against the prod build, with `document.startViewTransition` instrumented to list every pseudo-element animation:
  - **Forward** (compare buttons, card click): `nav-forward`, old page `vt-slide-out-left` / new page `vt-slide-in-right` (280ms), and `group(project-image-<id>)` morph (320ms). PASS for both variants.
  - **Back** (the back button and the breadcrumb): `nav-back`, `vt-slide-out-right` / `vt-slide-in-left`, and the morph back into the card. PASS.
  - **Navbar:** the `site-header` group never animates in any navigation. PASS.
  - **Untyped navbar navigation:** no slide, no morph. PASS.
  - **Browser back:** no view transition at all. This matches the docs (no type), and navigation still works.
  - **Hand-off:** the target's effective opacity (product of all ancestors) is 1.00, with the image loaded, from the first sampled frame of the transition to its end, in both variants, forward and back. No flash when the live element takes over. PASS.
  - **Timing** (3 runs each, warm): both variants are ready at about 95–140ms and finished at about 585–610ms, with no long tasks.
  - **Rapid** `/` → `/contact-me` → `/projects` at 60, 120 and 300ms spacing: transitions queue serially, it ends on `/projects` with one header, and nothing gets stuck.
    - Seen once, not reproducible: in an earlier run after many navigations, one transition took about 4s and a queued one was aborted by Chrome ("DOM update timed out"). The page still ended correct.
  - **Reduced motion:** every layer uses `vt-fade-in` / `vt-fade-out` (280ms), with no slide keyframes and no group morph. PASS.
- **NOT RUN:**
  - DevTools 10% playback.
  - Firefox, or any browser without View Transitions support.
  - A real phone.

## Decision: gallery target

The owner chose **the gallery image**. The hero variant, the `?morph=` query handling (`useSearchParams` + `Suspense`), and the temporary `MorphComparison` bar on `/projects` were removed. `/projects/[id]` renders `ProjectPageClient` directly inside `PageTransition`, and every card morphs into the first gallery tile.

- **All 21 projects now pair cleanly.** For `mr-bhadoria-site`, `rajivbhai-site`, `mr-rathi-site` and `varsoda-site`, the card's cover photo was moved to the front of its `imgUrls` in `data/projects.ts`. This keeps the chosen covers; the rest of each gallery's order is unchanged. Checked with a script: every card's `imgUrl` equals its project's `imgUrls[0]`, and there are no duplicates.
- **Verified in prod headless Chrome on `varsoda-site`:** the `project-image-varsoda-site` group morphs, and the card and tile resolve to the same file (`varsoda_site_pic_7.jpg`, q=90).

Owner-requested changes made in the same pass (outside this plan's original scope):

- **Focus.** The per-component `focus:ring-2 … ring-offset-2` rings (shown on every mouse click, with a white offset halo) and `focus:outline-none focus:underline` were removed from every component. They're replaced by one global `:focus-visible` rule in `app/globals.css`: a 2px `--focus-ring` outline (button-blue in light, light-periwinkle in dark), 2px offset (1px on fields). It is keyboard-only and follows border-radius. The contact form keeps its red/green states via `focus-visible:outline-red-500` / `outline-green-500`.
  - Verified: after a mouse click the outline is `none`; after Tab it is a 2px solid outline on buttons and the select.
- **`images.qualities`.** Next 16 only allows listed qualities; unlisted ones warned and quietly fell back to 75. `next.config.js` now lists `[75, 90, 95]`.
  - The list thumbnail went 80 → 75, gallery tiles 95 → 90, and the lightbox stays 95.
  - Verified: the optimizer returns 200 for 75/90/95 and 400 for 80.
  - Dev console across `/projects`, a detail page with the lightbox open, `/` and `/contact-me`: no quality warnings.
- **Hydration warning.** The dev console showed a mismatch on `<html>` on every page load: next-themes sets the theme class and `color-scheme` before hydration (this predates v3). Fixed by adding `suppressHydrationWarning` to `<html>` in `app/layout.tsx`, as next-themes recommends. It covers that element only. The console is now clean.
