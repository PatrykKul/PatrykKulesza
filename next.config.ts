import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: '/korepetycje',
  assetPrefix: '/korepetycje/',
  // Dodajemy explicit configuration dla GitHub Pages
  env: {
    NEXT_PUBLIC_BASE_PATH: '/korepetycje'
  }
};

export default nextConfig;