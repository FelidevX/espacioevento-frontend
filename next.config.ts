import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Habilita el modo standalone para Docker
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
