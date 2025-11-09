import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.giphy.com',
      },
    ],
  },
  turbopack: {
    root: '/Users/chainsona/Code/src/github.com/MaikersHQ/x402-referral',
  },
}

export default nextConfig
