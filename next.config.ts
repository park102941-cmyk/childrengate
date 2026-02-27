import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Removed serverExternalPackages as it might cause issues on Edge/Worker runtimes
  // with next-on-pages if they aren't truly available as externals.
};

export default nextConfig;
