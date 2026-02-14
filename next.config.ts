import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.clerk.com' },
      { protocol: 'https', hostname: '**.congress.gov' },
      { protocol: 'https', hostname: '**.parliament.uk' },
    ],
  },
};

export default nextConfig;
