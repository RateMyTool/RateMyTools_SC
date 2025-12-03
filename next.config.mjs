/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during production builds on Vercel
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
