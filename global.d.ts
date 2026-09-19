// Type declarations for CSS imports
declare module '*.css';

// Global CSS imports
declare module './globals.css';
declare module '@/app/globals.css';

// ViewTransition and Link's transitionTypes ship in the React canary that the
// App Router bundles; the stable typings only declare them under react/canary.
/// <reference types="react/canary" />
