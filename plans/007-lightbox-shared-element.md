# 007 — Shared-element lightbox with drag-to-dismiss

- **Status**: DONE
- **Commit**: `a6425c7`
- **Severity**: Opportunity (HIGH value)
- **Category**: Missed opportunities + Interruptibility
- **Estimated scope**: 1 file edited (`components/gallery/ImageGallery.tsx`), ~120 lines changed
- **Depends on**: plans 001, 002

## Problem

Opening a project image is the single most important interaction on an architecture portfolio, and it is currently a crossfade with no spatial connection to the thumbnail that was clicked.

### A. The image teleports

```tsx
// components/gallery/ImageGallery.tsx:413-432 — current
<motion.div
  initial={{ opacity: 0, scale: 0.95, y: 20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  transition={{
    duration: 0.6,
    type: 'spring',
    stiffness: 100,
    damping: 20,
  }}
  className="relative w-full h-full max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)]"
>
```

The full image appears in the centre of the screen with no relationship to where the thumbnail was. The user loses track of which image they opened and, on closing, where to look for it again.

### B. Exit animations never run

```tsx
// components/gallery/ImageGallery.tsx:346-349 — current
<AnimatePresence>
  {isModalOpen && (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
```

`AnimatePresence` can only play an exit animation on a child it still controls. Here the Radix `Dialog` is also conditionally rendered on `isModalOpen`, so when `isModalOpen` flips to `false` React removes the whole subtree in the same commit. The `exit={{ opacity: 0 }}` at line 360 is dead code. The lightbox **hard-cuts** on close.

### C. Delay chains

```tsx
// components/gallery/ImageGallery.tsx:367-370, 383-386, 403-406 — current
transition={{ delay: 0.3 }}    // previous button
transition={{ delay: 0.3 }}    // next button
transition={{ delay: 0.4, duration: 0.5 }}  // image counter
```

The controls a user needs in order to browse arrive 300–400ms after the lightbox does. If they click where the "next" button is going to be, nothing happens.

### D. Not interruptible, no gesture

Spamming next/prev restarts the fixed-duration tween from zero. There is no swipe, no drag-to-dismiss, no velocity — on a phone, where this gallery is mostly used, the only way out is to hit a small close target.

### E. Two `duration: 0.05` tweens

```tsx
// components/gallery/ImageGallery.tsx:296-298, 335-337 — current
transition={{ duration: 0.05 }}
```

50ms is neither instant nor animated — it is a hitch. Hover overlays should be either `0` or in the 100–160ms feedback range.

## Target

### A. Shared element via `layoutId`

Give each thumbnail and the lightbox image the same `layoutId`. Motion then morphs the thumbnail's rect into the lightbox's rect, and back on close.

```tsx
/* target — the thumbnail image wrapper in the grid, around line 280 */
<motion.div layoutId={`gallery-${id}-${index}`}>
  <ProfessionalImage … />
</motion.div>
```

```tsx
/* target — components/gallery/ImageGallery.tsx, replacing lines 413-432 */
<motion.div
  layoutId={`gallery-${id}-${currentImageIndex}`}
  drag="y"
  dragConstraints={{ top: 0, bottom: 0 }}
  dragElastic={0.6}
  onDragEnd={(_, info) => {
    // Velocity-based dismissal: how fast the finger was moving matters more
    // than how far it travelled. 0.11 px/ms is the threshold that separates
    // a deliberate flick from a slow drag the user is reconsidering.
    const speed = Math.abs(info.velocity.y) / 1000;
    const distance = Math.abs(info.offset.y);
    if (speed > 0.11 || distance > 150) {
      closeModal();
    }
  }}
  transition={spring}
  className="relative w-full h-full max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)] touch-none"
>
```

`dragElastic: 0.6` gives rising friction at the constraint instead of a hard stop — the image resists progressively rather than freezing.

### B. Let `AnimatePresence` own the exit

Remove the conditional render and let the Dialog stay mounted, with `AnimatePresence` inside it controlling the content:

```tsx
/* target — replacing lines 346-349 */
<Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
  <DialogContent className="fixed inset-0 w-screen h-screen max-w-none max-h-none min-w-full min-h-full p-6 bg-black/95 border-0 overflow-hidden m-0 translate-x-0 translate-y-0">
    <DialogTitle className="sr-only">
      {title} - Image {currentImageIndex !== null ? currentImageIndex + 1 : 1} of {imageUrls.length}
    </DialogTitle>
    <AnimatePresence mode="wait">
      {currentImageIndex !== null && (
        …
      )}
    </AnimatePresence>
  </DialogContent>
</Dialog>
```

If Radix's own unmount still races the exit, add `forceMount` to `DialogContent` and gate its visibility on `isModalOpen`.

### C. Controls arrive with the lightbox

Delete `transition={{ delay: 0.3 }}` at lines 369 and 385, and `transition={{ delay: 0.4, duration: 0.5 }}` at line 405. Replace all three with `transition={enterTransition}` and no delay. The backdrop and the controls are one surface; they arrive together.

### D. Fix the hitch tweens

Replace `transition={{ duration: 0.05 }}` at lines 298 and 337 with `transition={{ duration: duration.press, ease: ease.out }}` (160ms).

### E. Reduced motion

`MotionConfig reducedMotion="user"` (plan 002) already disables `layout` animations, so the lightbox degrades to a fade automatically. Drag still works — gestures are direct manipulation, not animation, and should not be removed. No extra code needed; verify it in the feel check.

## Repo conventions to follow

- The gallery already composes Radix primitives from `@/components/ui/dialog`. Keep using `Dialog`, `DialogContent`, `DialogTitle` — do not hand-roll a modal.
- Keyboard handling already exists on the grid items (`onKeyDown` for Enter/Space at lines 274-279). Preserve it; drag is additive, never the only way out.
- `import { spring, enterTransition, duration, ease } from '@/lib/motion';` (plan 001).
- Existing accessible labels (`aria-label="Open image N of M in lightbox"`, the `sr-only` `DialogTitle`) must survive unchanged.

## Steps

1. Add the `@/lib/motion` imports to `components/gallery/ImageGallery.tsx`.
2. Wrap the grid thumbnail's image in a `motion.div` with `layoutId={`gallery-${id}-${index}`}`.
3. Restructure lines 346-440 per target B so `AnimatePresence` sits **inside** the always-mounted `Dialog`.
4. Replace the main image wrapper (lines 413-432) with target A, including drag props and `onDragEnd`.
5. Remove the three delay transitions per target C.
6. Replace the two `duration: 0.05` tweens per target D.
7. Add `exit={{ opacity: 0, transition: { duration: duration.press } }}` to the backdrop wrapper so closing fades out rather than cutting.
8. Run `bun run lint --fix`, then `bun run lint`.

## Boundaries

- Do NOT remove keyboard navigation, `aria-label`s, the `sr-only` `DialogTitle`, or focus management. Radix handles focus trapping — keep it.
- Do NOT change image `src`, `quality`, `sizes`, `priority` or the `ProfessionalImage` component's loading logic.
- Do NOT change the masonry/grid layout switch or `getBentoSpan`.
- Do NOT add a gesture library. Motion's built-in `drag` is sufficient.
- Do NOT add new dependencies.
- If `lib/motion.ts` does not exist, STOP — plan 001 must land first.

## Verification

- **Mechanical**: `bun run lint` and `bun run build` pass. `grep -n "duration: 0.05" components/gallery/ImageGallery.tsx` returns nothing.
- **Feel check** — run `bun run dev`, open any `/projects/[id]`:
  - Click a thumbnail in the **bottom-right** of the grid. The image should visibly expand **from that thumbnail's position**, not from the centre. Click one in the top-left and confirm it comes from there instead.
  - Close it. The image should shrink **back to its thumbnail**, not fade out in place.
  - DevTools → Animations → playback **10%**: confirm the morph is continuous — the thumbnail and the full image are the same object throughout, never two overlapping copies.
  - Click next/prev rapidly. The transition should retarget smoothly, never restart from zero.
  - The prev/next buttons and the counter must be clickable the instant the lightbox appears — not 300ms later.
  - **Touch (real device strongly preferred)**: drag the image down slowly and release before halfway — it should spring back. Flick it down quickly and release — it should dismiss even though it barely moved. Drag past the constraint and confirm resistance increases rather than the image freezing.
  - Press `Escape` — still closes.
  - `prefers-reduced-motion: reduce` — the lightbox fades instead of morphing, and drag-to-dismiss still works.
- **Done when**: the image is spatially continuous with its thumbnail in both directions, the close animation actually plays, controls are live on arrival, and a fast flick dismisses on a phone.

## Implementation notes (deviations from the plan as written)

**1. The `layoutId` includes the layout mode:** `gallery-${id}-${layoutMode}-${index}`.
The gallery can render the same index in more than one layout, and two mounted
elements sharing a `layoutId` would make Motion pick the wrong one to morph from.

**2. There is no `AnimatePresence` inside the Dialog (target B and step 7 not applied
as written).** The Dialog does stay mounted with `open={isModalOpen}`, so the
conditional-render bug in problem B is fixed. But an `AnimatePresence` exit would keep
the lightbox image mounted after close, and while it is mounted the thumbnail cannot
take the `layoutId` back, so the morph back to the thumbnail is delayed or lost. The
content therefore unmounts right away. The still-mounted thumbnail picks up the
`layoutId` and morphs from full-screen back to its own rect. The backdrop's exit is
Radix's own `fade-out-0` on `DialogContent`, which Radix Presence keeps mounted until
the fade finishes. No `forceMount` is needed.

**3. Radix's zoom is pinned to scale 1.** `DialogContent` hardcodes `zoom-in-95` /
`zoom-out-95`. Motion measured the lightbox rect while that 95% transform was in effect,
so the morph landed in the wrong place. `--tw-enter-scale` and `--tw-exit-scale` are set
to `1` in an inline style on this one `DialogContent`. A class override is not reliable
because tailwind-merge does not know the tailwindcss-animate classes. `ui/dialog.tsx`
is untouched.

**4. The content wrapper's own opacity animation was dropped.** Radix already fades
`DialogContent`, and a second fade on top of it doubled the effect.

**5. `closeModal()` in the target is `handleOpenChange(false)`.** No `closeModal`
exists in the file. `handleOpenChange` is the existing close path used by Radix.

**6. The prev/next positioning classes moved from `Button` to its `motion.div`
wrapper. This was not in the plan.** The buttons were `absolute` inside an unpositioned
wrapper. While the wrapper animates `x`, its transform makes it the containing block,
so the buttons were laid out against a zero-width flex item. Measured at 48ms after
open, the Next button was at x = −16 instead of 1200. Under reduced motion, the image
also painted over both buttons for the first frames, so a click there did nothing.
This existed before, but removing the 300ms delay (target C) moved it to the moment of
arrival. The counter already used this pattern. Tailwind v4's `-translate-y-1/2` sets
the `translate` property, so it does not conflict with Motion's `transform`.

## Verification results

The in-app preview browser crashed on long-running evaluations. These checks were run
by driving headless Chrome (1280×800) over the DevTools protocol against `bun run dev`
on `/projects/shekhani-office`, using real mouse and key input events. The last
thumbnail was clicked (image 8 of 8, rect 464,274 336×252).

- **Open morph starts from the thumbnail: PASS.** The lightbox image's rect goes
  308,185 654×430 → 99,66 1080×667 → 24,24 1232×752, settling in about 380ms (the
  shared 400ms spring).
- **Close morph goes back to the thumbnail: PASS.** After `Escape`, the thumbnail's
  transform starts at `scale(3.66, 2.98)` (full-screen) and decays to `none` at
  about 470ms. The final rect is 458,264 350×262 (the thumbnail plus its hover scale).
  The Dialog unmounts at about 170ms, once Radix's fade finishes.
- **`Escape` closes: PASS.**
- **Controls live on arrival: PASS (after note 6).** 50ms after the click,
  `elementFromPoint` at the centre of each of Previous and Next returns that button.
  This passes with and without reduced motion.
- **Rapid next ×3 at 60ms intervals: PASS.** The counter steps 8→1→2→3 and the image
  rect stays at full-screen throughout, with no restart and no fly-in from the new
  index's thumbnail. The image swap itself is a hard cut, which the plan does not ask
  to change.
- **`prefers-reduced-motion: reduce` (emulated via CDP): PASS.** The image is at its
  final rect on the first sample (no morph). On close, the thumbnail's transform stays
  `none` throughout.
- **DevTools 10% playback continuity check: NOT RUN.** It needs a human eye. Rect
  sampling shows one continuous element in each direction.
- **Touch drag (slow drag springs back, fast flick dismisses, elastic resistance):
  NOT RUN.** It needs a physical phone, which is why this plan is `NEEDS-DEVICE`.
  Reduced-motion drag was not checked either.
- `grep -n "duration: 0.05" components/gallery/ImageGallery.tsx`: nothing.
- `tsc --noEmit`: clean. `bun run lint`: unchanged pre-existing baseline. `bun run
  build`: see plan 008, which ran a build including this change.

## Sign-off

Marked DONE by the owner on 2026-09-19 so v3 can ship. The physical-phone checks in this plan's Verification section were not run by the executor; the owner will run them on their own phone against the deployed build. Anything that fails there should reopen this plan.
