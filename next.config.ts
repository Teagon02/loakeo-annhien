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
  transpilePackages: [
    "sanity",
    "next-sanity",
    "@sanity/vision",
    "@sanity/image-url",
  ],
  serverComponentsExternalPackages: [
    "sanity",
    "@sanity/vision",
  ],
  webpack: (config, { isServer }) => {
    // Fix for Sanity modules bundling issue
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Handle Sanity ESM modules
    config.module = {
      ...config.module,
      rules: [
        ...(config.module?.rules || []),
        {
          test: /node_modules\/sanity\/.*\.mjs$/,
          type: "javascript/auto",
        },
      ],
    };

    return config;
  },
  experimental: {
    // Disable Turbopack for production builds
    turbo: false,
  },
};

export default nextConfig;
