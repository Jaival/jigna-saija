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
