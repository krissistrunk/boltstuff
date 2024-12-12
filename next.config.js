/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export configuration
  output: undefined,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;