import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  // Configure webpack to handle Sanity better
  webpack: (config, { isServer }) => {
    // Exclude Sanity from server-side bundle if needed
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  // Experimental options for better Sanity support
  experimental: {
    serverComponentsExternalPackages: ["sanity"],
  },
};

export default nextConfig;
