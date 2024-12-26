import Footer from '@/components/footer';
import Navbar from '@/components/navBar';
import { Providers } from '@/components/provider';
import { Toaster } from '@/components/ui/toaster';
import { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import React from 'react';
import './globals.css';

const figtree = Figtree({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Jigna Saija',
  description: 'I am an architect and interior designer.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={figtree.className}>
      <body>
        <Providers>
          <main
            className={
              'h-full px-10 pt-12 md:px-20 bg-white-dark dark:bg-blue-dark background'
            }
          >
            <Navbar />
            <div className="px-4 py-2">{children}</div>
            <Toaster />
            <Footer />
          </main>
        </Providers>
      </body>
    </html>
  );
}
