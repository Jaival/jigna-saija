# 013 — Mobile platform baseline and press feedback

- **Status**: DONE (code complete; on-device checks not run)
- **Commit**: `a6425c7`
- **Severity**: HIGH
- **Category**: Mobile native feel (platform layer)
- **Estimated scope**: 2 files edited, ~50 lines added
- **Source**: `mobile-native` skill — symptom table §1, §2, §4, §5, §6, §8, §9, §10

## Problem

The site scores zero on the mobile platform baseline. Every one of these greps returns **0 results** across `app/` and `components/`:

| Grep | Hits | Symptom on a real phone |
| --- | --- | --- |
| `-webkit-tap-highlight-color` | **0** | A grey/blue rectangle flashes over every button, link and gallery thumbnail on tap. This is the single loudest "this is a website" tell. |
| `touch-action` | **0** | Taps feel laggy. iOS Safari still holds some elements for the double-tap-zoom check. |
| `overscroll-behavior` | **0** | Android Chrome pull-to-refresh fires when the user scrolls up at the top of a project page. Will actively fight the drag-to-dismiss gesture that plan 007 adds to the lightbox. |
| `user-select` / `select-none` | **1** | Long-pressing a button selects its label; long-pressing a gallery thumbnail pops the iOS copy/share callout instead of opening the image. |
| `:active` (CSS) | **0** | No press feedback except on the 11 elements that have Motion's `whileTap`. Everything else — every nav link, every project card link, the skip link, the footer buttons — responds only when the finger *lifts*, which reads as lag even at 0ms. |
| `-webkit-text-size-adjust` | **0** | iOS inflates font sizes in landscape. |

Plus a concrete defect in the viewport export:

```tsx
// app/layout.tsx:58-62 — current
export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#0f172a' }],
  width: 'device-width',
  initialScale: 1,
};
```

There is **only a dark `theme-color`**. A phone in light mode gets no `theme-color` at all and falls back to the browser's default chrome, so the status bar does not match the page. Worse, `next-themes` here is configured `defaultTheme="dark"` with `attribute="class"` (`components/provider.tsx:9`) — the theme is a **class**, not the OS preference, so even the dark entry is matched against the wrong signal. A user whose OS is light but whose site theme is dark gets a white status bar over a dark page.

There is also no `viewportFit: 'cover'`, which means `env(safe-area-inset-*)` resolves to `0px` everywhere — see plan 014, which depends on this.

### Already correct — do not "fix" these

- **Input font size.** The four form fields at `components/contactMe.tsx:222, 287, 354, 420` carry no font-size utility, so they inherit the body's `1rem` = 16px. iOS will not zoom on focus. Leave them alone. (The `text-sm` classes nearby are on `<label>` elements, which do not trigger zoom.)
- **`user-scalable` / `maximum-scale`** are absent from the viewport export, which is correct. Never add them.

## Target

### A. `app/globals.css` — the baseline block

Add inside `@layer base`, after the existing `body { … }` rule:

```css
/* Mobile platform baseline. Each line removes one "this is a website" tell.
   See plans/013-mobile-platform-baseline.md for the why behind each. */
html {
  /* Kill the grey flash the browser paints over tapped elements. Every
     tappable element gets its own :active state below to replace it. */
  -webkit-tap-highlight-color: transparent;
  /* No font inflation when the phone rotates to landscape. */
  -webkit-text-size-adjust: 100%;
}

html,
body {
  /* Stop Android pull-to-refresh and the whole-page iOS rubber band.
     Required before the lightbox drag-to-dismiss in plan 007 can work. */
  overscroll-behavior: none;
}

/* Controls are controls: instant click, no text selection, no long-press
   callout. Never apply these to body copy — users copy addresses and
   error messages, and that is content. */
button,
a,
[role='button'],
summary {
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

/* Press feedback. The browser's tap highlight is gone, so every tappable
   element must respond on press, not on release. 160ms, ease-out. */
button:active,
a:active,
[role='button']:active {
  transform: scale(0.97);
}

button,
a,
[role='button'] {
  transition: transform var(--duration-press) var(--ease-out);
}

/* Reduced motion keeps the press feedback — it is direct manipulation,
   not decoration — but drops the scale in favour of opacity. */
@media (prefers-reduced-motion: reduce) {
  button:active,
  a:active,
  [role='button']:active {
    transform: none;
    opacity: 0.7;
  }
}
```

`--duration-press` (`160ms`) and `--ease-out` come from plan 001.

> **Scope caution on `:active`.** A blanket `a:active { transform: scale(0.97) }` will also scale full-width block links and the skip link. Verify in the feel check; if any element scales awkwardly (notably the skip link at `app/layout.tsx:76` and the project card links), exclude it with `:not([data-no-press])` and add `data-no-press` to that element rather than removing the rule globally.

### B. `app/layout.tsx` — viewport export

```tsx
/* target — replacing app/layout.tsx:58-62 */
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
  // Lets the page paint under the notch and the home indicator. Without
  // this, every env(safe-area-inset-*) resolves to 0px — see plan 014.
  viewportFit: 'cover',
  // Android Chrome: the software keyboard shrinks the layout viewport, so
  // 100dvh and bottom-pinned UI react the way they already do on iOS.
  interactiveWidget: 'resizes-content',
};
```

Colour values match the site's own surfaces: `#ffffff` is `--color-background` in light mode and `#0f172a` is `--color-background` in the `.dark` block (`app/globals.css`). Match the top-of-page colour, not the brand colour.

### C. Theme-color must follow the class, not the OS

`next-themes` toggles a class, so the media-query `theme-color` tags above will disagree with the rendered theme whenever the user's site theme differs from their OS setting. Sync the active tag on theme change:

```tsx
/* target — new client component, components/ThemeColorSync.tsx */
'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

const COLORS = { light: '#ffffff', dark: '#0f172a' } as const;

/**
 * next-themes switches a class, but <meta name="theme-color"> is matched by
 * OS preference. Without this the status bar can be white over a dark page.
 */
export function ThemeColorSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) return;
    const color = COLORS[resolvedTheme === 'dark' ? 'dark' : 'light'];
    let tag = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]:not([media])',
    );
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = 'theme-color';
      document.head.appendChild(tag);
    }
    tag.content = color;
  }, [resolvedTheme]);

  return null;
}
```

An unmediated `theme-color` tag wins over the media-scoped ones, so this overrides correctly while the media tags remain as the pre-hydration default. Render `<ThemeColorSync />` inside `<Providers>` in `app/layout.tsx`.

### D. Gesture surfaces

The gallery grid is a scroll surface the user will also drag on once plan 007 lands. Declare what the browser still owns:

```tsx
/* target — components/gallery/ImageGallery.tsx, the lightbox image wrapper */
className="… touch-none"   /* the drag handler owns every axis */
```

```css
/* target — app/globals.css, if the lightbox content ever scrolls */
.lightbox-scroll {
  overflow-y: auto;
  overscroll-behavior: contain;
}
```

`contain` on inner scrollers keeps their own bounce but stops the page behind from moving. `none` on the root, `contain` on children.

## Repo conventions to follow

- Base element styles go inside `@layer base` in `app/globals.css`. Exemplar: the existing `*:focus-visible` block and the `body { … }` rule.
- The viewport export is already typed: `import { Metadata, Viewport } from 'next';` at `app/layout.tsx:7`. Extend the existing object; do not add a second export.
- Client components live in `components/` with `'use client'` on line 1 and are mounted inside `<Providers>`. Exemplar: `components/BackToTop.tsx`, mounted at `app/layout.tsx:90`.
- CSS custom properties are referenced as `var(--duration-press)`, matching plan 001's token names.

## Steps

1. Add the baseline block from target A to `app/globals.css` inside `@layer base`, after the `body { … }` rule.
2. Replace the `viewport` export in `app/layout.tsx` with target B.
3. Create `components/ThemeColorSync.tsx` with target C and render `<ThemeColorSync />` as the first child inside `<Providers>` in `app/layout.tsx`.
4. Add `touch-none` to the lightbox image wrapper in `components/gallery/ImageGallery.tsx` per target D. If plan 007 has already landed, this class is already there — verify rather than duplicate.
5. Run `bun run lint`, then `bun run build`.

## Boundaries

- Do NOT add `user-scalable=no` or `maximum-scale` under any circumstances — they are accessibility failures and this plan explicitly rejects them.
- Do NOT add `user-select: none` to `body`, `p`, `h1`–`h6`, or any content element. Controls only.
- Do NOT add a font-size rule for the inputs. They already inherit 16px; see "Already correct" above.
- Do NOT add `touch-action: none` to anything the user needs to scroll past — only the lightbox drag surface gets it.
- Do NOT sniff the user agent. Everything here is a media query, a meta tag, or a CSS declaration.
- Do NOT change the `next-themes` configuration in `components/provider.tsx`.
- Do NOT add new dependencies.
- If plan 001's `--duration-press` / `--ease-out` tokens do not exist, STOP — plan 001 must land first.

## Verification

- **Mechanical**:
  - `grep -n "tap-highlight\|overscroll-behavior\|touch-action" app/globals.css` returns all three.
  - `bun run build` succeeds, then `curl -s http://localhost:3000 | grep -o '<meta name="theme-color"[^>]*>'` returns **two** tags, one per colour scheme.
  - `curl -s http://localhost:3000 | grep -o 'viewport-fit=cover'` returns a match.
  - `bun run lint` passes.
- **Real hardware — this plan cannot be verified any other way.** Chrome device emulation reproduces none of these behaviours. Run `bun run dev --hostname 0.0.0.0`, open the LAN IP on a phone, then:
  - Tap a nav link, a project card and a gallery thumbnail. **No grey or blue flash.** Instead each should visibly shrink slightly the instant your finger lands — not when it lifts.
  - Long-press the "See Projects" button. No text selection, no iOS copy/share callout.
  - Long-press a gallery thumbnail. It should not pop the image save/share sheet.
  - At the very top of `/projects`, swipe down. **No pull-to-refresh spinner** (Android) and no whole-page rubber band (iOS).
  - Rotate to landscape. Body text must not inflate.
  - Check the status bar in light OS mode and dark OS mode, then toggle the site's own theme. The bar must match the top of the page in all four combinations.
  - Tap into a contact form field. The page must **not** zoom. If it does, the input font size regressed below 16px.
  - Use iOS Safari Web Inspector or `chrome://inspect` if anything looks off — emulation will not show you the problem.
- **Done when**: no tap highlight anywhere, every tappable element responds on press, no pull-to-refresh, no long-press callouts on controls, and the status bar matches the page in all four theme/OS combinations — all confirmed on a physical phone.

## Implementation notes (deviations from the plan as written)

The press-feedback rules were written with the `:not([data-no-press])` escape hatch
already in place rather than added later:

```css
button:active:not([data-no-press]), a:active:not([data-no-press]), … { transform: scale(0.97) }
```

The plan's own scope caution predicted this would be needed for full-width block links
and the skip link. Wiring the hook up front costs nothing and means opting an element
out is a one-attribute change. No element carries `data-no-press` yet — that decision
needs the on-device feel check.

`.lightbox-scroll` from target D was added even though nothing uses it yet; plan 007
is what will apply it.

## Verification results

- `grep -n "tap-highlight\|overscroll-behavior\|touch-action" app/globals.css` → all
  three present (lines 343, 352/397, 362).
- `bun run build`: succeeds, no warnings. `tsc --noEmit`: clean.
- `bun run lint`: unchanged pre-existing baseline.
- **Real-hardware checks: NOT RUN — no physical phone available.** Tap highlight,
  press feedback on touch, long-press callouts, pull-to-refresh, landscape font
  inflation and the status-bar colour across all four theme/OS combinations have
  none of them been observed. Chrome emulation reproduces none of these. See the
  Status line.

## Sign-off

Marked DONE by the owner on 2026-09-19 so v3 can ship. The physical-phone checks in this plan's Verification section were not run by the executor; the owner will run them on their own phone against the deployed build. Anything that fails there should reopen this plan.
