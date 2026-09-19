# v3 Plans

Self-contained implementation plans for the v3 upgrade. Context and the full audit live in [`../V3_UPGRADE_PLAN.md`](../V3_UPGRADE_PLAN.md).

Each plan assumes **zero** context from the conversation that produced it. Hand one to any agent with:

```
Read plans/00N-<slug>.md and implement it exactly.
Do not touch files outside its Boundaries section.
```

All plans are stamped against commit `a6425c7`. If a plan's quoted code no longer matches the file, the plan says to STOP and report rather than improvise — honour that.

## Status

| # | Plan | Severity | Phase | Status |
| --- | --- | --- | --- | --- |
| 001 | [Establish the motion token system](001-motion-token-system.md) | HIGH | 1 — Foundation | DONE |
| 002 | [Real `prefers-reduced-motion` support](002-reduced-motion-support.md) | HIGH | 1 — Foundation | DONE |
| 013 | [Mobile platform baseline and press feedback](013-mobile-platform-baseline.md) | HIGH | 1 — Foundation | DONE |
| 014 | [Safe areas and dynamic viewport units](014-safe-areas-and-viewport-units.md) | HIGH | 1 — Foundation | DONE |
| 003 | [Delete the 27 infinite decorative loops](003-delete-decorative-loops.md) | HIGH | 2 — Subtraction | DONE |
| 004 | [Fix the six `scale(0)` entrances](004-fix-scale-zero-entrances.md) | HIGH | 2 — Subtraction | DONE |
| 005 | [Retire `transition-all`; gate hover](005-transition-all-and-hover-gating.md) | MEDIUM | 2 — Subtraction | DONE |
| 006 | [Rebuild entrance timing to the 300ms budget](006-entrance-timing-rebuild.md) | HIGH | 2 — Subtraction | DONE |
| 007 | [Shared-element lightbox with drag-to-dismiss](007-lightbox-shared-element.md) | Opportunity | 3 — Moments | DONE |
| 008 | [Layout animation on the projects grid](008-projects-grid-layout-animation.md) | Opportunity | 3 — Moments | DONE |
| 009 | [Cross-page view transitions](009-cross-page-view-transitions.md) | Opportunity | 3 — Moments | DONE |
| 010 | [Navbar scroll-edge material; fix `ease-in`](010-navbar-scroll-edge.md) | MEDIUM | 4 — Surface | DONE |
| 011 | [Typography, palette, material stacking](011-design-foundations.md) | MEDIUM | 4 — Surface | DONE |
| 012 | [Restore page-level metadata](012-restore-page-metadata.md) | LOW | 4 — Surface | DONE |

## Execution order and dependencies

```
001 ──┬── 004 ── 006 ──┬── 007 (also needs 002, 013)
      │                ├── 008
      ├── 005          └── 010
      ├── 013 ── 014
      └── 011 (independent)

002 ── (land early; it changes how you evaluate every other plan)

003 ── 012 ── 009 (also needs 001, 002)
```

Read as:

| Plan | Must land first |
| --- | --- |
| 001 | — |
| 002 | — |
| 003 | — |
| 004 | 001 |
| 005 | 001 |
| 006 | 001, 004 |
| 007 | 001, 002, 013 |
| 008 | 001, 006 |
| 009 | 001, 002, 012 |
| 010 | 001 |
| 011 | — |
| 012 | 003 |
| 013 | 001 |
| 014 | 013 |

**Land 001 and 002 first.** 001 creates `lib/motion.ts` and the CSS tokens that eight other plans import; 002 makes reduced motion actually work, which changes what you are looking at when you feel-check everything else.

**013 and 014 ship as one PR.** 013 adds `viewport-fit=cover`, which makes the page paint under the notch and the home indicator; 014 is what pads the content back out. 013 alone leaves tap targets under system UI — strictly worse than doing neither.

**013 before 007.** The lightbox drag-to-dismiss gesture in 007 will fight Android pull-to-refresh until 013 sets `overscroll-behavior: none`.

**Do not run Phase 3 before Phase 2 is merged.** Plans 007–009 add motion. Adding it on top of the 27 loops and the 600ms entrances that Phase 2 removes will make it impossible to judge whether the new motion is working.

## Rules for executors

1. Implement one plan per branch/PR. Do not batch. (The one exception is 013 + 014 — see above.)
2. Stay inside the plan's **Boundaries** section. If a fix seems obviously needed just outside it, note it and leave it.
3. Run the plan's full **Verification** section, including the feel check, before marking it done. Mechanical checks passing is not the same as the motion being right.
4. **Plans 005, 007, 013 and 014 require a physical phone.** Their symptoms — sticky hover, tap highlight, the URL bar's effect on `vh`, safe areas, overscroll, gesture velocity — do not reproduce in Chrome device emulation. If you cannot get to hardware, mark the plan `NEEDS-DEVICE` rather than `DONE`, and say which checks you could and could not run.
5. Update this file's Status column as part of the same change.
6. If the quoted code does not match what you find, STOP and report the drift. Do not guess at the intent.

## After all fourteen

Run the v3 definition-of-done checklist in [`../V3_UPGRADE_PLAN.md`](../V3_UPGRADE_PLAN.md) §4 and bump `package.json` to `3.0.0`.
