'use client';

import { ViewTransition, type ReactNode } from 'react';

// Wraps one page's content. Page files mount and unmount on navigation, so
// enter and exit fire here; in the layout they never would. Only navigations
// tagged nav-forward or nav-back slide. Everything else, including the browser
// back button, which carries no type, swaps without a slide.
export function PageTransition({ children }: { children: ReactNode }) {
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
