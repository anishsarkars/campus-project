/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      // This will ignore ESLint errors during build
      ignoreDuringBuilds: true,
    },
    typescript: {
      // This will ignore TypeScript errors during build
      ignoreBuildErrors: true,
    },
    // Optional: if you have any image optimization issues
    images: {
      unoptimized: true,
    },
  }
  
  module.exports = nextConfig