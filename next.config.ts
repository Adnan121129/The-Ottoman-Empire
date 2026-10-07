import type { NextConfig } from 'next';

/**
 * Static export: `next build` emits a fully static site in /out that can be
 * deployed to Vercel, Netlify, Cloudflare Pages, GitHub Pages or any CDN.
 */
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
