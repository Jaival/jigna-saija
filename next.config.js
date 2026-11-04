/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // Experimental features for better performance
  experimental: {
    // Package optimization for better bundling
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-toast',
      'react-hook-form',
      'motion'
    ],
    // Optimize bundle sizes
    optimizeServerReact: true,
    // Better caching
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  
  // Image optimization
  images: {
    // Every `quality` a next/image uses must be listed (required since Next 16).
    // 75: small thumbnails (the default). 90: cards, gallery tiles and the
    // lightbox. Each extra value multiplies the variants Vercel bills for.
    qualities: [75, 90],
    // Vercel bills one transformation per (image, width, quality, format).
    // WebP only: adding AVIF doubles every variant.
    formats: ['image/webp'],
    // Capped at 1920: source images are at most 1920px on the long edge, so
    // wider variants would only re-encode the same pixels.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Images in /public never change in place, so keep each transformation
    // cached for the Vercel maximum (31 days) instead of re-transforming.
    minimumCacheTTL: 2678400,
    // No remotePatterns: every image is local. An open hostname such as
    // raw.githubusercontent.com lets anyone run /_next/image on any file
    // there and spend this project's transformation quota.
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  },
}

module.exports = nextConfig
