import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/p/:id',
        destination: '/p-portal?id=:id',
      },
      {
        source: '/scan/:instId/:studentId',
        destination: '/gate/:instId?studentId=:studentId',
      }
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
