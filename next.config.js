/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // eslint:{
  //   ignoreDuringBuilds: true,
  // },
  // swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

module.exports = nextConfig
