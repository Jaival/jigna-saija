/**
 * Generate a simple blur data URL for image placeholders
 * This provides a better UX while images are loading
 */
export function getBlurDataURL(
  color: string = 'rgba(166, 160, 154, 0.2)',
): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
      <filter id="blur" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="20" />
      </filter>
      <rect width="100%" height="100%" fill="${color}" filter="url(#blur)" />
    </svg>
  `;

  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Get a themed blur data URL based on project type
 */
export function getProjectBlurDataURL(
  type: 'interior' | 'architecture' = 'interior',
): string {
  const color =
    type === 'interior'
      ? 'rgba(180, 84, 49, 0.1)' // clay tint
      : 'rgba(19, 85, 104, 0.1)'; // pine tint

  return getBlurDataURL(color);
}

/**
 * Generic shimmer effect for loading states
 */
export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#e5e0db" offset="20%" />
      <stop stop-color="#f3f0eb" offset="50%" />
      <stop stop-color="#e5e0db" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#e5e0db" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

export const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);
