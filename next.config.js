/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: 'pixxicrm.ae',
        pathname: '/api/profile/upload/**',
      },
    ],
    unoptimized: true,
  },
}

module.exports = nextConfig

