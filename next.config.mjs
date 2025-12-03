/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during production builds on Vercel
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
