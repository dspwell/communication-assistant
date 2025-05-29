/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Enable Server Actions if needed
    serverActions: {
      allowedOrigins: ['*']
    }
  }
};

export default nextConfig;