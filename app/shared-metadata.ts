import type { Metadata } from 'next';

// Metadata merges shallowly: a page that sets `openGraph` replaces the root
// layout's object wholesale, including the file-generated image. Pages spread
// this back in so their link previews keep the site name and image.
export const sharedOpenGraph = {
  type: 'website',
  locale: 'en_US',
  siteName: 'Jigna Saija Portfolio',
  images: [
    {
      url: '/opengraph-image',
      width: 1200,
      height: 630,
      alt: 'Jigna Saija | Architect & Interior Designer',
    },
  ],
} satisfies NonNullable<Metadata['openGraph']>;
