import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  basePath: '/korepetycje',
  assetPrefix: '/korepetycje',
  images: {
    unoptimized: true
  }
};

export default nextConfig;