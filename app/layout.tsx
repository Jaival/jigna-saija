import Footer from '@/components/footer';
import Navbar from '@/components/navBar';
import { Providers } from '@/components/provider';
import { Toaster } from '@/components/ui/toaster';
import { Metadata, Viewport } from 'next';
import { Figtree } from 'next/font/google';
import React from 'react';
import './globals.css';

const figtree = Figtree({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-figtree',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Jigna Saija',
    default: 'Jigna Saija | Architect & Interior Designer'
  },
  description: 'I am an architect and interior designer specializing in modern and sustainable design solutions.',
  keywords: ['architect', 'interior designer', 'sustainable design', 'modern architecture'],
  creator: 'Jigna Saija',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Jigna Saija | Architect & Interior Designer',
    description: 'Professional architect and interior designer specializing in modern and sustainable design solutions.',
    siteName: 'Jigna Saija Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jigna Saija | Architect & Interior Designer',
    description: 'Professional architect and interior designer specializing in modern and sustainable design solutions.',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f9fa' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${figtree.className} ${figtree.variable}`}>
      <body className="antialiased">
        <Providers>
          <main
            id="main-content"
            className="flex flex-col min-h-screen px-4 sm:px-8 md:px-16 lg:px-20 pt-8 md:pt-12 bg-white-dark dark:bg-blue-dark background"
          >
            <Navbar />
            <div className="flex-1 py-4 md:py-8">{children}</div>
            <Toaster />
            <Footer />
          </main>
        </Providers>
      </body>
    </html>
  );
}
