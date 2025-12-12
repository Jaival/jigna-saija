import Footer from '@/components/footer';
import Navbar from '@/components/navBar';
import { Providers } from '@/components/provider';
import { Toaster } from '@/components/ui/toaster';
import BackToTop from '@/components/BackToTop';
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
    images: [
      {
        url: 'https://51ebo9nf5p.ufs.sh/f/is6rEBDHOhcsI88qStPgUxWgpaQnNi2mD4vRyJ6ObMZlGH8V',
        width: 480,
        height: 600,
      },
    ],
    url: 'https://jignasaija.vercel.app/',
    type: 'website',
    locale: 'en_US',
    title: 'Jigna Saija | Architect & Interior Designer',
    description:
      'Professional architect and interior designer specializing in modern and sustainable design solutions.',
    siteName: 'Jigna Saija Portfolio',
  },
  twitter: {
    images: [
      {
        url: 'https://51ebo9nf5p.ufs.sh/f/is6rEBDHOhcsI88qStPgUxWgpaQnNi2mD4vRyJ6ObMZlGH8V',
        width: 480,
        height: 600,
      },
    ],
    card: 'summary_large_image',
    title: 'Jigna Saija | Architect & Interior Designer',
    description:
      'Professional architect and interior designer specializing in modern and sustainable design solutions.',
  },
};

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#0f172a' }],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${titillium.className} ${titillium.variable}`}>
      <body className="antialiased">
        <Providers>
          {/* Skip to main content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-6 focus:py-3 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Skip to main content
          </a>
          <Navbar />
          <main
            id="main-content"
            className="flex flex-col min-h-screen px-4 sm:px-8 md:px-16 lg:px-20 pt-20 md:pt-28 background"
            role="main"
          >
            <div className="flex-1 py-4 md:py-8">{children}</div>
            <Toaster />
            <Footer />
          </main>
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
