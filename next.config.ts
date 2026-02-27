import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Ensure we don't use any Node-specific APIs that might leak during SSR
  serverExternalPackages: ["firebase", "firebase-admin"],
};

export default nextConfig;
