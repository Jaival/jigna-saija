# 011 — Typography tracking, palette consolidation, material stacking

- **Status**: DONE
- **Commit**: `a6425c7`
- **Severity**: MEDIUM
- **Category**: Design foundations (non-motion)
- **Estimated scope**: ~6 files edited, ~60 lines changed

> This plan is design work rather than motion work. It is included in v3 because the audit surfaced three foundation problems that undermine everything the motion plans fix — motion cannot make an incoherent surface feel considered.

## Problem

### A. Two palettes fighting

The project defines a deliberate brand palette in `app/globals.css:36-50` — aquamarine `#264653`, button-blue `#1d6793`, amaranth-purple `#a40e4c`, gold `#fb923c`. It then also ships a generic pink/purple/teal set and uses it in visible places:

```tsx
// app/not-found.tsx:29 — current
className="… bg-gradient-to-r from-pink-600 to-purple-600 dark:from-blue-500 dark:to-teal-400 …"
```

```tsx
// components/footer.tsx:96 — current
className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 text-white hover:shadow-lg … focus:ring-pink-500 …"
```

```tsx
// components/projects.tsx:472 — current
className="… group-hover:text-pink-600 dark:group-hover:text-pink-400 …"
```

```tsx
// components/aboutMe.tsx:322 — current
className="font-medium text-purple-600"
```

```css
/* app/globals.css — current, in the pulse-glow keyframes */
0%, 100% { box-shadow: 0 0 5px rgba(236, 72, 153, 0.3); }   /* pink-500 */
```

So the Instagram button is purple→pink, the project card hover is pink, and the brand gradient is blue→magenta→gold. Three unrelated colour stories on one site.

### B. The hero gradient text

```tsx
// components/hero.tsx:140 — current
className="text-3xl md:text-6xl font-bold leading-tight text-gradient-brand"
```

`text-gradient-brand` is `linear-gradient(135deg, #1d6793 0%, #a40e4c 50%, #fb923c 100%)` — blue through magenta to orange, across the primary headline of an architecture and interior design portfolio. It is the loudest element on the site and it is decoration, not hierarchy. It also has a contrast problem: the mid-gradient magenta on the light theme background sits near the AA threshold, and gradient text cannot be contrast-checked reliably at all.

### C. Fixed tracking across all sizes, and stacked glass

Tracking is applied as a single value regardless of size. `tracking-tight` appears on headings at `components/aboutMe.tsx:395`, `components/designProcess.tsx:138` and `components/hero.tsx:372`, while the 6xl hero headline at `components/hero.tsx:140` has **no** tracking at all — the largest text on the site is the one most in need of negative tracking. Large display text reads as too loose as it grows; small text wants slightly positive tracking.

And light translucent surfaces are stacked on light translucent surfaces:

```tsx
// components/contactMe.tsx:97 — current
<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg …">
```

```tsx
// components/contactMe.tsx:177 — current
<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg …">
```

These sit on top of the page's own radial-gradient wash. Translucency on translucency collapses legibility and destroys the depth hierarchy — the surfaces stop reading as layers and start reading as haze.

## Target

### A. One palette

Retire the pink/purple/teal set from all user-facing surfaces. Every accent resolves to a brand token.

| Current | Replace with |
| --- | --- |
| `from-pink-600 to-purple-600` (`app/not-found.tsx:29`) | `bg-gradient-brand` (the existing utility) |
| `from-purple-600 to-pink-600` (`components/footer.tsx:96`) | `bg-amaranth-purple` |
| `focus:ring-pink-500` (`components/footer.tsx:96`) | `focus:ring-button-blue` |
| `group-hover:text-pink-600 dark:group-hover:text-pink-400` (`components/projects.tsx:472, 485`) | `group-hover:text-button-blue dark:group-hover:text-honolulu-blue` |
| `text-purple-600` (`components/aboutMe.tsx:322`) | `text-amaranth-purple` |
| `rgba(236, 72, 153, …)` in `pulse-glow` keyframes (`app/globals.css`) | `color-mix(in oklab, var(--color-amaranth-purple) 40%, transparent)` |

Then delete the now-unused `--color-pink-600`, `--color-purple-600` and `--color-teal-400` tokens from the `/* Pink Scale for Gradients */` group in `app/globals.css`. Keep `--color-blue-500` — it is used by the focus-ring rules at `app/globals.css:325` and `:333`.

### B. Restrained hero headline

```tsx
/* target — components/hero.tsx:140 */
className="text-3xl md:text-6xl font-bold leading-[1.05] tracking-[-0.02em] text-foreground"
```

Solid foreground colour. If a brand accent is wanted in the headline, put it on **one word** with `text-gradient-brand`, not the whole sentence — emphasis requires something to be un-emphasised.

### C. Size-specific tracking and unstacked glass

Tracking is a function of size, never one value for everything:

```css
/* target — app/globals.css, inside @layer base */

/* Tracking is size-specific. Large text reads loose as it grows; small text
   needs a little air. Body sits at 0. */
h1, .text-display {
  letter-spacing: -0.02em;
  line-height: 1.05;
  font-optical-sizing: auto;
}

h2 {
  letter-spacing: -0.015em;
  line-height: 1.15;
}

h3 {
  letter-spacing: -0.01em;
  line-height: 1.25;
}

.text-caption,
small {
  letter-spacing: 0.01em;
}
```

Remove the blanket `tracking-wide` at `components/aboutMe.tsx:290` — it is on an `md:text-xl lg:text-2xl` paragraph, which is exactly the size range that should sit at `0`.

For the stacked glass at `components/contactMe.tsx:97` and `:177`, make the inner surfaces **solid**. A translucent material is a floating functional layer; a content card sitting in the page flow is not floating:

```tsx
/* target — components/contactMe.tsx:97 */
<div className="bg-card text-card-foreground border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-150 ease-out group">
```

```tsx
/* target — components/contactMe.tsx:177 */
<div className="bg-card text-card-foreground border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-150 ease-out">
```

Translucency stays where it belongs: the navbar (floating chrome, plan 010) and the lightbox backdrop.

## Repo conventions to follow

- Brand colours are `@theme` tokens in `app/globals.css:36-50` and are consumed as Tailwind utilities by name — `bg-button-blue`, `text-amaranth-purple`. Exemplar: `app/projects/[id]/ProjectPageClient.tsx:225` uses `bg-button-blue hover:bg-honolulu-blue`.
- Semantic tokens (`--color-card`, `--color-border`, `--color-foreground`) already exist for both themes and are the correct choice for content surfaces.
- Custom utilities use `@utility` at the top level of `app/globals.css`. Exemplar: `@utility text-gradient-brand`.
- Base element styles go inside `@layer base`. Exemplar: the existing `body { … }` rule.

## Steps

1. Apply every row of the table in target A across the listed files.
2. Delete `--color-pink-600`, `--color-purple-600` and `--color-teal-400` from `app/globals.css`. Run `grep -rn "pink-\|purple-600\|teal-400" app components` and confirm no user-facing usage remains.
3. Apply target B to `components/hero.tsx:140`.
4. Add the tracking rules from target C to `@layer base` in `app/globals.css`.
5. Remove `tracking-wide` from `components/aboutMe.tsx:290`.
6. Apply the solid-surface targets to `components/contactMe.tsx:97` and `:177`.
7. Run `bun run lint`, then `bun run build`.

## Boundaries

- Do NOT change any copy, layout, spacing or component structure.
- Do NOT change the dark-theme token values in the `.dark` block — only the accent usages listed above.
- Do NOT remove `--color-blue-500`; the global focus-ring rules depend on it.
- Do NOT touch the navbar's translucency (plan 010) or the lightbox backdrop (plan 007) — those are correctly floating layers.
- Do NOT change the font family or add a new font.
- Do NOT add new dependencies.

## Verification

- **Mechanical**:
  - `grep -rn "pink-600\|pink-400\|pink-500\|purple-600\|teal-400" app components` returns nothing.
  - `bun run lint` and `bun run build` pass.
- **Eye check**:
  - Open `/`, `/projects`, `/contact-me`, `/projects/[id]` and a deliberately bad URL (for `/not-found`) in **both** light and dark theme. Every accent should belong to the same colour story — no pink anywhere.
  - The hero headline should read as a headline, not as a graphic. Compare against the "See Projects" button, which is now the loudest element — that is correct, it is the primary action.
  - Zoom the hero headline to 200%. Letter spacing should look *tight and set*, not airy.
  - The contact cards should now read as solid cards with a clear edge. Put text behind one (scroll so the page gradient sits underneath) and confirm no haze.
  - Run the page through DevTools → Lighthouse → Accessibility, or check contrast manually on the hero headline, the footer social buttons and the project card hover colour. All body and heading text should clear **4.5:1**; large text **3:1**.
- **Done when**: one palette across all routes in both themes, the hero headline is solid and tracked, no translucent surface sits on another translucent surface, and contrast passes on every changed element.

## Implementation notes

Line numbers had shifted because of earlier plans (e.g. the hero headline is now at `hero.tsx:101`, `tracking-wide` at `aboutMe.tsx:235`, the contact cards at `contactMe.tsx:99`/`:179`). The quoted code itself matched, so this isn't drift.

Deviations:

1. **Pink usages the table missed.** The table lists six replacements, but the verification grep requires zero matches, and about 16 more pink usages existed. They were mapped with the table's own conventions:
   - `components/projects.tsx`:
     - Focus rings (`focus:ring-pink-500`, ×5) → `focus:ring-button-blue`.
     - Active filter toggle `bg-pink-500 … border-pink-500` → `bg-button-blue … border-button-blue`.
     - Active grid/list toggle `text-pink-500` → `text-button-blue dark:text-light-periwinkle`.
     - Card arrow `text-pink-600 dark:text-pink-400 group-hover:text-pink-700 dark:group-hover:text-pink-300` → `text-button-blue dark:text-honolulu-blue group-hover:text-honolulu-blue dark:group-hover:text-light-periwinkle`.
   - `components/gallery/ImageGallery.tsx`:
     - The two active view toggles map the same way as in projects.
     - The thumbnail indicator dot `from-pink-400 to-purple-400` → `bg-gradient-brand`.
     - The spinner `border-pink-500` → `border-button-blue`.
2. **Contrast failures in the table's own mappings, replaced with passing brand tokens.** Contrast was computed from the token hex values (WCAG relative luminance):
   - Dark card/list title hover `dark:group-hover:text-honolulu-blue`: 3.69:1 on the dark card and 3.03:1 on gray-800. Now `dark:group-hover:text-light-periwinkle`: 10.93:1 and 8.98:1.
   - About Me accent `text-amaranth-purple` passes in light (7.65:1) but is 2.33:1 on the dark background. Added `dark:text-gold` (7.89:1). The old `text-purple-600` was ≈3.2:1 there, so this was already a failure before.
   - Not-found "Go Home" `bg-gradient-brand`: white text over the gold end is 2.26:1. Now `bg-button-blue hover:bg-honolulu-blue` (6.15:1 / 4.84:1), the repo's primary-button convention from `ProjectPageClient.tsx`. The old pink-600 button was 3.53:1, so it also failed before.
3. The `/* Pink Scale for Gradients */` comment was renamed, since the only token left under it is `--color-blue-500` (the focus-ring colour, kept per Boundaries).
4. `pulse-glow` uses the target's single 40% mix for both keyframes. The utility has no call sites.

Found, not fixed (outside Boundaries):

- **The navbar is invisible in the light theme before scrolling.** Unscrolled links are `text-white` and the logo asset is white, which only works on the dark theme. That colour logic is protected by plan 010's Boundaries and this plan's "no layout/structure" rule. It needs a theme-aware unscrolled link colour.
- The project detail badge still uses `from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900` (`ProjectPageClient.tsx:69`). It's not in the table or the verification grep, but it's off-palette.
- The contact form card (`contactMe.tsx:196`) is still `bg-white/80 backdrop-blur-sm`. It's a sibling of the two cards made solid here, not stacked on them, and the plan lists only those two.

## Verification results

- `grep -rn "pink-600\|pink-400\|pink-500\|purple-600\|teal-400" app components`: no output, and no other `pink-*` remains either. PASS.
- `tsc --noEmit` is clean and `bun run build` succeeds. `bun run lint` is unchanged from baseline (the pre-existing `projects.tsx` error plus 2 `opengraph-image.tsx` warnings).
- **Contrast** on every changed element, both themes:
  - Hero h1: 17.85 / 17.06.
  - Footer social icon: 7.65.
  - Card title hover: 6.15 / 10.93.
  - List title hover (dark): 8.98.
  - Arrow (graphic, 3:1 minimum): 6.15 / 3.69, hover 10.93.
  - View toggles: 6.15 / 6.31.
  - Active filter: 6.15.
  - About Me accent: 7.65 / 7.89.
  - 404 button: 6.15, hover 4.84.
  - PASS.
- **Eye check** (headless Chrome screenshots, prod build, light and dark):
  - `/`: the hero headline is solid foreground and tightly tracked; the "See Projects" gradient button is now the loudest element.
  - `/contact-me`: the email and QR cards read as solid bordered cards.
  - `/nope`: the button is brand blue.
  - `/projects`: no pink anywhere.
  - Hover colours were checked by computed contrast, not by eye. NOT RUN: 200% zoom inspection and a Lighthouse pass.
