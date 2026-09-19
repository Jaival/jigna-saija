'use client';

import { ThemeProvider } from 'next-themes';
import { MotionConfig } from 'motion/react';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      {/* reducedMotion="user" makes every motion component in the tree drop
          transform/layout animation when the OS asks, keeping opacity. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeProvider>
  );
}
