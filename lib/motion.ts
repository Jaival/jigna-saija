'use client';

/**
 * Motion tokens for the whole site. Every duration, curve and spring lives here.
 * Values are fixed by V3_UPGRADE_PLAN.md §5 — do not hand-type new ones in components.
 */
import { useSyncExternalStore } from 'react';
import type { Transition, Variants } from 'motion/react';

/** Strong easing curves. Mirror the CSS custom properties in app/globals.css. */
export const ease = {
  out: [0.23, 1, 0.32, 1],
  inOut: [0.77, 0, 0.175, 1],
  drawer: [0.32, 0.72, 0, 1],
} as const;

/** Duration scale in seconds. UI motion stays at or under 0.3. */
export const duration = {
  press: 0.16,
  tooltip: 0.18,
  dropdown: 0.22,
  enter: 0.28,
  modal: 0.32,
} as const;

/** Critically damped. The default for anything the user did not throw. */
export const spring: Transition = {
  type: 'spring',
  bounce: 0,
  duration: 0.4,
};

/** Slight overshoot. Only after a flick, drag release or other carried momentum. */
export const springMomentum: Transition = {
  type: 'spring',
  bounce: 0.2,
  duration: 0.4,
};

/** Standard entrance tween for content arriving on scroll. */
export const enterTransition: Transition = {
  duration: duration.enter,
  ease: ease.out,
};

/** Stagger between siblings in a group entrance. 30–80ms; never blocks interaction. */
export const STAGGER = 0.05;

/** The one entrance the whole site uses. Fades up a short distance, scales from 0.96. */
export const enterVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: enterTransition },
};

/** Parent of a staggered group. Pair with enterVariants on the children. */
export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: STAGGER },
  },
};

const HOVER_QUERY = '(hover: hover) and (pointer: fine)';

function subscribeToHover(onChange: () => void) {
  const mq = window.matchMedia(HOVER_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

const getHoverSnapshot = () => window.matchMedia(HOVER_QUERY).matches;

/** Server and first client paint agree on "no hover" so hydration stays stable. */
const getHoverServerSnapshot = () => false;

/**
 * True when the device has a real pointer. Hover motion must be gated on this:
 * a tap fires a synthetic pointerenter, so an ungated `whileHover` that scales
 * leaves the tapped element stuck enlarged until the user taps elsewhere.
 *
 * Tailwind's `hover:` utilities need no equivalent — v4 compiles them to
 * `@media (hover: hover)` already. This is only for Motion's JS hover props.
 */
export function useHasHover() {
  return useSyncExternalStore(
    subscribeToHover,
    getHoverSnapshot,
    getHoverServerSnapshot,
  );
}
