import Footer from '@/components/footer';
import Navbar from '@/components/navBar';
import { Providers } from '@/components/provider';
import { Toaster } from '@/components/ui/toaster';
import BackToTop from '@/components/BackToTop';
import { ThemeColorSync } from '@/components/ThemeColorSync';
import { Analytics } from '@vercel/analytics/next';
import { Metadata, Viewport } from 'next';
import { Titillium_Web } from 'next/font/google';
import React from 'react';
import './globals.css';

// const figtree = Figtree({
//   weight: ['300', '400', '500', '600', '700', '800', '900'],
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-figtree',
// });

const titillium = Titillium_Web({
  weight: ['200', '300', '400', '600', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-titillium-web',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://jignasaija.vercel.app'),
  title: {
    template: '%s | Jigna Saija',
    default: 'Jigna Saija | Architect & Interior Designer',
  },
  description:
    'I am an architect and interior designer specializing in modern and sustainable design solutions.',
  keywords: [
    'architect',
    'interior designer',
    'sustainable design',
    'modern architecture',
  ],
  creator: 'Jaival Saija',
  openGraph: {
    url: 'https://jignasaija.vercel.app/',
    type: 'website',
    locale: 'en_US',
    title: 'Jigna Saija | Architect & Interior Designer',
    description:
      'Professional architect and interior designer specializing in modern and sustainable design solutions.',
    siteName: 'Jigna Saija Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jigna Saija | Architect & Interior Designer',
    description:
      'Professional architect and interior designer specializing in modern and sustainable design solutions.',
  },
};

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // next-themes sets the theme class and color-scheme on <html> before React
    // hydrates. This silences that one expected difference; it applies to this
    // element only, not to anything inside it.
    <html
      lang="en"
      className={`${titillium.className} ${titillium.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <Providers>
          <ThemeColorSync />
          {/* Skip to main content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-6 focus:py-3 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg"
          >
            Skip to main content
          </a>
          <Navbar />
          <main
            id="main-content"
            className="flex flex-col min-h-svh px-4 sm:px-8 md:px-16 lg:px-20 pt-20 md:pt-28 background"
            role="main"
          >
            <div className="flex-1 py-4 md:py-8">{children}</div>
            <Toaster />
            <Footer />
          </main>
          <BackToTop />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
