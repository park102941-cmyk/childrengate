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
        source: '/dashboard/admin/student/:id',
        destination: '/dashboard/admin/student-detail?id=:id',
      }
    ];
  }
};

export default nextConfig;
