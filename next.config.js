/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint:{
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '51ebo9nf5p.ufs.sh'
      }
    ],
  },
}

module.exports = nextConfig
