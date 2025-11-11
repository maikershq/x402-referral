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
  serverExternalPackages: ['knex', 'better-sqlite3', 'pg'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        'better-sqlite3': 'commonjs better-sqlite3',
        'pg': 'commonjs pg',
        'pg-native': 'commonjs pg-native',
        'mysql': 'commonjs mysql',
        'mysql2': 'commonjs mysql2',
        'oracledb': 'commonjs oracledb',
        'tedious': 'commonjs tedious',
        'pg-query-stream': 'commonjs pg-query-stream',
        'sqlite3': 'commonjs sqlite3',
      });
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'mysql': false,
        'mysql2': false,
        'oracledb': false,
        'tedious': false,
        'pg-query-stream': false,
        'sqlite3': false,
      };
    }
    return config;
  },
}

export default nextConfig
