import type { NextConfig } from "next";

// Use basePath only for GitHub Pages deployment
const isGithubPages = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  // Only use basePath and assetPrefix for GitHub Pages
  basePath: isGithubPages ? '/korepetycje' : '',
  assetPrefix: isGithubPages ? '/korepetycje' : '',
  images: {
    unoptimized: true
  }
};

export default nextConfig;