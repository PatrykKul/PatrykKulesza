import type { NextConfig } from "next";

// Use basePath only for GitHub Pages deployment
const isGithubPages = process.env.NODE_ENV === 'production';
const isExport = process.env.BUILD_EXPORT === 'true';

const nextConfig: NextConfig = {
  // Only use export for actual build, not for development
  ...(isExport && { output: 'export' }),
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