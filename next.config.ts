import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  cacheComponents: true,
  reactCompiler: true,
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
};

export default nextConfig;
